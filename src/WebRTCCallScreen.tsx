import React, {useState, useEffect} from 'react';
import {Text, Button, View, Modal, TouchableOpacity} from 'react-native';

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';

import {db} from './util/firestore';
import Timer from './Timer';
import {useContext} from 'react';
import {IsLoginContext} from './IsLoginContext';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
    {
      urls: 'turn:157.245.194.11:3478',
      username: 'cc',
      credential: '1234',
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function CallScreen({navigation, route}: any) {
  const roomId = route.params.roomId;
  const {uid} = useContext(IsLoginContext);

  // 통화 종료
  async function onBackPress() {
    if (cachedLocalPC) {
      const sender = cachedLocalPC.getSenders()[0];

      if (sender) {
        cachedLocalPC.removeTrack(sender);
      }

      cachedLocalPC.close();
    }
    // clean up
    setLocalStream(null);
    setRemoteStream(null);
    setCachedLocalPC(null);

    const roomRef = await db.collection('rooms').doc(roomId);
    await roomRef.update({
      endCallee: true,
      callEndTime: new Date().getTime(),
    });

    navigation.navigate('CallEndScreen');
  }

  const [localStream, setLocalStream] = useState<MediaStream | null>(null); // Stream of local user
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null); // When a call is connected, the video stream from the receiver is appended to this state in the stream
  const [cachedLocalPC, setCachedLocalPC] = useState<RTCPeerConnection | null>(
    null,
  );
  const [timerStarted, setTimerStarted] = useState(false); // 타이머 시작 여부

  const [isMuted, setIsMuted] = useState(false);

  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState(false); // 모달 상태
  const [initInfo, setInitInfo] = useState<boolean>(false); // 초기 정보
  const [major, setMajor] = useState<string>('?'); // 전공
  const [studentId, setStudentId] = useState<string>('?'); // 학번
  const [kakao, setKakao] = useState<string>('?'); // 카카오톡 계정
  const [insta, setInsta] = useState<string>('?'); // 인스타 계정

  useEffect(() => {
    startLocalStream();
  }, []);

  useEffect(() => {
    if (isEnd) {
      if (cachedLocalPC) {
        const sender = cachedLocalPC.getSenders()[0];

        if (sender) {
          cachedLocalPC.removeTrack(sender);
        }

        cachedLocalPC.close();
      }
      setLocalStream(null);
      setRemoteStream(null);
      setCachedLocalPC(null);

      navigation.navigate('CallEndScreen');
    }
  }, [isEnd, cachedLocalPC, navigation]);

  // 카메라 및 마이크 스트림 설정
  const startLocalStream = async () => {
    // isFront will determine if the initial camera should face user or environment
    const isFront = true;
    const devices: any = await mediaDevices.enumerateDevices();

    const facing = isFront ? 'front' : 'environment';
    const videoSourceId = devices.find(
      (device: any) => device.kind === 'videoinput' && device.facing === facing,
    );
    const facingMode = isFront ? 'user' : 'environment';
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  // 통화 시작
  const startCall = async (id: string) => {
    const roomRef = await db.collection('rooms').doc(id);

    const localPC = new RTCPeerConnection(configuration);

    if (localStream) {
      for (const track of localStream.getTracks()) {
        localPC.addTrack(track, localStream);
      }
    } else {
      console.log('localStream is null'); // 로컬스트림 에러 처리
    }

    const callerCandidatesCollection = roomRef.collection('callerCandidates');

    localPC.addEventListener('icecandidate', async e => {
      // icecandidate 이벤트는 로컬 RTCPeerConnection이 ICE candidate를 생성할 때마다 발생

      if (!e.candidate) {
        console.log('Got final candidate! <caller>');
        return;
      }
      callerCandidatesCollection.add(e.candidate.toJSON());
    });

    localPC.addEventListener('track', e => {
      //track 이벤트는 RTCPeerConnection의 연결된 미디어 소스로부터 발생합니다.

      if (e.streams[0] && remoteStream !== e.streams[0]) {
        if (remoteStream?.id === e.streams[0].id) {
          console.log('remoteStream update <caller>');
        } else {
          console.log('remoteStream recevied <caller>');
        }
        // console.log('RemotePC received the stream call', e.streams[0]);
        setRemoteStream(e.streams[0]);
      }
    });

    localPC.addEventListener('connectionstatechange', async () => {
      // connectionstatechange 이벤트는 RTCPeerConnection의 connectionState 속성이 바뀔 때마다 발생합니다.
      console.log('connectionState <caller>', localPC.connectionState);
      if (localPC.connectionState === 'connected') {
        console.log('피어 연결 완료 <caller>');
        await roomRef.update({
          //통화 시작 시간 설정
          callerReady: true,
          callStartTime: new Date().getTime(),
          extensionCount: 0,
          endCaller: false,
          endCallee: false,
          callerUid: uid,
        });
        // await updateInfo();
      }
    });

    const offer = await localPC.createOffer(null);
    await localPC.setLocalDescription(offer);

    const roomWithOffer = {offer};
    await roomRef.set(roomWithOffer);

    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!localPC.remoteDescription && data?.answer) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await localPC.setRemoteDescription(rtcSessionDescription);
      }
      if (!timerStarted && data?.callerReady && data?.calleeReady) {
        setTimerStarted(true);
      }
      if (
        data?.callerExtensionPressed &&
        data?.calleeExtensionPressed &&
        !isExtended &&
        data?.extensionCount < 2
      ) {
        console.log('통화 연장 <caller>');

        setIsExtended(true);

        await roomRef.update({
          callerExtensionPressed: false,
          calleeExtensionPressed: false,
          extensionCount: data.extensionCount + 1,
        });
      }
      if (data?.endCaller && !data?.endCallee && !isEnd) {
        setIsEnd(true);
      }
      // callee 정보 가져오기
      if (data?.calleeUid && !initInfo) {
        const userRef = db.collection('Users').doc(data.calleeUid);
        const userDoc = await userRef.get();
        const calleeMajor = userDoc.data()?.major;
        console.log('callee major 확인', calleeMajor);
        const calleeStudentId = userDoc.data()?.studentID;
        const calleeKakao = userDoc.data()?.kakao;
        const calleeInsta = userDoc.data()?.insta;

        setMajor(calleeMajor);
        setStudentId(calleeStudentId);
        setKakao(calleeKakao);
        setInsta(calleeInsta);

        setInitInfo(true); // 정보 세팅 완료
      }
    });

    roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          await localPC.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    setCachedLocalPC(localPC);
  };

  const switchCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track._switchCamera());
    }
  };

  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!remoteStream || !localStream) {
      return;
    }
    localStream.getAudioTracks().forEach(track => {
      // console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const extendCall = async () => {
    const roomRef = await db.collection('rooms').doc(roomId);
    await roomRef.update({
      callerExtensionPressed: true,
    });
  };

  return (
    <View className="w-full h-full flex flex-col">
      <Text>Call Screen</Text>
      <Text>Room : {roomId}</Text>

      <View>
        <View>
          <Button title="Click to stop call" onPress={onBackPress} />
        </View>
        <View>
          {!localStream && (
            <Button title="Click to start stream" onPress={startLocalStream} />
          )}
          {localStream && (
            <Button
              title="Click to start call"
              onPress={() => startCall(roomId)}
              disabled={!!remoteStream}
            />
          )}
        </View>
      </View>

      {localStream && (
        <View>
          <Button title="Switch camera" onPress={switchCamera} />
          <Button
            title={`${isMuted ? 'Unmute' : 'Mute'} stream`}
            onPress={toggleMute}
            disabled={!remoteStream}
          />
          <Button title="Click to extend call" onPress={extendCall} />
        </View>
      )}
      <View>
        <Timer
          onBackPress={onBackPress}
          timerStarted={timerStarted}
          isExtended={isExtended}
          setIsExtended={setIsExtended}
        />
      </View>
      {/* 정보 확인 버튼 */}
      <View>
        <Button title="View Info" onPress={() => setModalVisible(true)} />
      </View>
      {/* 정보 확인 모달 */}
      <View>
        <Modal
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <Text>"전공" {major}</Text>
          <Text>"학번" {studentId}</Text>
          <Text>"카카오톡" {kakao}</Text>
          <Text>"인스타그램" {insta}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text className="mx-auto text-[16px] text-black underline">
              취소
            </Text>
          </TouchableOpacity>
        </Modal>
      </View>
      <View className="w-full h-full flex flex-col">
        <View className="flex w-full h-[250px]">
          {localStream && (
            <RTCView
              className="w-full h-full bg-black"
              streamURL={localStream && localStream.toURL()}
            />
          )}
        </View>
        <View className="flex w-full h-[250px]">
          {remoteStream && (
            <RTCView
              className="w-full h-full bg-black"
              streamURL={remoteStream && remoteStream.toURL()}
            />
          )}
        </View>
      </View>
    </View>
  );
}
