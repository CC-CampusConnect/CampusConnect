import React, {useState, useEffect} from 'react';
import {Text, Button, View} from 'react-native';

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

  // 통화 종료
  function onBackPress() {
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
    // cleanup
    navigation.navigate('WebRTCRoom');
  }

  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [cachedLocalPC, setCachedLocalPC] = useState<RTCPeerConnection | null>(
    null,
  );

  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    startLocalStream();
  }, []);

  useEffect(() => {
    if (localStream && remoteStream) {
      saveCallStartTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStream, remoteStream]);

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

    localPC.addEventListener('icecandidate', e => {
      // icecandidate 이벤트는 로컬 RTCPeerConnection이 ICE candidate를 생성할 때마다 발생

      if (!e.candidate) {
        console.log('Got final candidate!');
        return;
      }
      callerCandidatesCollection.add(e.candidate.toJSON());
    });

    localPC.addEventListener('track', e => {
      //track 이벤트는 RTCPeerConnection의 연결된 미디어 소스로부터 발생합니다.

      if (e.streams[0] && remoteStream !== e.streams[0]) {
        console.log('RemotePC received the stream call', e.streams[0]);
        setRemoteStream(e.streams[0]);
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

  // 통화를 시작한 시간을 Firestore에 저장하는 함수
  const saveCallStartTime = async () => {
    const roomRef = await db.collection('rooms').doc(roomId);
    const callStartTime = new Date();
    await roomRef.update({
      created_date: callStartTime,
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
        </View>
      )}
      <View>
        <Timer onBackPress={onBackPress} roomId={roomId} />
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
