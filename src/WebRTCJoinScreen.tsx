import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';

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
import {UserContext} from './UserContext';
import {CommonActions} from '@react-navigation/native';
import ConnectSuccessScreen from './ConnectSuccessScreen';

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

export default function JoinScreen({navigation, route}: any) {
  const roomId = route.params.roomId;
  const {uid} = useContext(UserContext);

  async function onBackPress() {
    if (cachedLocalPC) {
      const sender = cachedLocalPC.getSenders()[0];

      if (sender) {
        cachedLocalPC.removeTrack(sender);
      }

      cachedLocalPC.close();
    }
    // cleanup
    setLocalStream(null);
    setRemoteStream(null);
    setCachedLocalPC(null);

    const roomRef = await db.collection('rooms').doc(roomId);
    await roomRef.update({
      endCaller: true,
    });

    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [
          {name: 'Home'},
          {name: 'MainPage'},
          {
            name: 'CallEndScreen',
            params: {
              roomId: roomId,
            },
          },
        ],
      }),
    );
  }

  const [localStream, setLocalStream] = useState<MediaStream | null>(null); // Stream of local user
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null); // When a call is connected, the video stream from the receiver is appended to this state in the stream
  const [cachedLocalPC, setCachedLocalPC] = useState<RTCPeerConnection | null>(
    null,
  );

  const [init, setInit] = useState<boolean>(false); // 통화 시작 여부
  const [callerUid, setcallerUid] = useState<string>(''); // caller 정보
  const [timerStarted, setTimerStarted] = useState(false); // 타이머 시작 여부
  const [isCallStarted, setIsCallStarted] = useState(false); // 통화 시작 여부

  const [, setIsMuted] = useState(false);

  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const [infoModalVisible, setInfoModalVisible] = useState(false); // 모달 상태
  const [endModalVisible, setEndModalVisible] = useState(false); // 통화 종료 모달 상태
  const [major, setMajor] = useState<string>('?'); // 전공
  const [studentId, setStudentId] = useState<string>('?'); // 학번
  const [kakao, setKakao] = useState<string>('?'); // 카카오톡 계정
  const [insta, setInsta] = useState<string>('?'); // 인스타 계정

  const [isActivatedSns, setIsActivatedSns] = useState<boolean>(false); // caller의 SNS 공개 여부
  const [isActivatedMajor, setIsActivatedMajor] = useState<boolean>(false);
  const [isActivatedStudentId, setIsActivatedStudentId] =
    useState<boolean>(false);

  const [startCall, setStartCall] = useState<boolean>(false);

  useEffect(() => {
    startLocalStream();
  }, []);

  useEffect(() => {
    // caller offer 가져왔을 때 통화 시작
    const unscribe = db
      .collection('rooms')
      .doc(roomId)
      .onSnapshot(async snapshot => {
        const data = snapshot.data();
        if (data?.offer && localStream && roomId) {
          console.log('offer 받음 <callee>');
          setStartCall(true);
        }
      });
    return unscribe;
  }, [localStream, roomId]);

  useEffect(() => {
    // 통화 시작
    if (startCall) {
      joinCall(roomId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startCall, roomId]);

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

      navigation.dispatch(
        CommonActions.reset({
          index: 2,
          routes: [
            {name: 'Home'},
            {name: 'MainPage'},
            {
              name: 'CallEndScreen',
              params: {
                roomId: roomId,
              },
            },
          ],
        }),
      );
    }
  }, [isEnd, cachedLocalPC, navigation, roomId]);

  useEffect(() => {
    // caller 정보 가져오기
    if (callerUid) {
      db.collection('Users')
        .doc(callerUid)
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              setMajor(data.major);
              setStudentId(data.studentID);
              setKakao(data.kakao ?? '?');
              setInsta(data.insta ?? '?');
              console.log('caller Major', data.major);
            }
          } else {
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    }
  }, [callerUid]);

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
          minWidth: 391, // Provide your own width, height and frame rate here
          minHeight: 373,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  const joinCall = async (id: string) => {
    const roomRef = db.collection('rooms').doc(id); // 방 참가
    const roomSnapshot = await roomRef.get(); // 방 정보 가져오기

    if (!roomSnapshot.exists) {
      console.log('방 없음');
      return;
    }

    const localPC = new RTCPeerConnection(configuration);

    if (localStream) {
      for (const track of localStream.getTracks()) {
        localPC.addTrack(track, localStream);
      }
    } else {
      console.log('localStream is null'); // 로컬스트림 에러 처리
    }

    const calleeCandidatesCollection = roomRef.collection('calleeCandidates');

    localPC.addEventListener('icecandidate', async e => {
      //icecandidate 이벤트는 RTCPeerConnection의 로컬 ICE 에이전트가 새로운 ICE candidate를 생성했을 때 발생합니다.
      if (!e.candidate) {
        // 타이머 초기값 설정
        console.log('Got final candidate! <callee>');
        return;
      }
      await calleeCandidatesCollection.add(e.candidate.toJSON());
    });

    localPC.addEventListener('track', e => {
      //track 이벤트는 RTCPeerConnection의 연결된 미디어 소스로부터 발생합니다.

      if (e.streams[0] && remoteStream !== e.streams[0]) {
        if (remoteStream?.id === e.streams[0].id) {
          console.log('remoteStream update <callee>');
        } else {
          console.log('remoteStream recevied <callee>');
        }
        // console.log('RemotePC received the stream', e.streams[0]);
        setRemoteStream(e.streams[0]);
      }
    });

    localPC.addEventListener('connectionstatechange', async () => {
      // connectionstatechange 이벤트는 RTCPeerConnection의 connectionState 속성이 바뀔 때마다 발생합니다.
      console.log('connectionState <callee>', localPC.connectionState);
      if (localPC.connectionState === 'connected') {
        console.log('피어 연결 완료 <callee>');
        if (!init) {
          setInit(true);
          console.log('통화 시작 <callee>');
          await roomRef.update({
            calleeReady: true,
            calleeUid: uid,
          });
        }
      }
    });

    const roomData = roomSnapshot.data();

    if (roomData?.offer) {
      const offer = roomData.offer;
      await localPC.setRemoteDescription(new RTCSessionDescription(offer));
    }

    const answer = await localPC.createAnswer();
    await localPC.setLocalDescription(answer);

    const roomWithAnswer = {answer};
    await roomRef.update(roomWithAnswer);

    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!timerStarted && data?.callerReady && data?.calleeReady) {
        setTimerStarted(true);
        setIsCallStarted(true);
      }

      if (
        data?.callerExtensionPressed &&
        data?.calleeExtensionPressed &&
        !isExtended &&
        data?.extensionCount < 2
      ) {
        console.log('통화 연장 <callee>');
        setIsExtended(true);
      }

      // 통화 연장 시 정보 공개
      if (data?.extensionCount === 1 && !isActivatedMajor) {
        setIsActivatedMajor(true);
      } else if (data?.extensionCount === 2 && !isActivatedStudentId) {
        setIsActivatedStudentId(true);
      }
      // 상대가 통화 종료 시
      if (data?.endCallee && !data?.endCaller && !isEnd) {
        // onbackpress와 동일
        setIsEnd(true);
      }
      // caller 정보 가져오기
      if (data?.callerUid && !callerUid) {
        setcallerUid(data.callerUid);
      }
      if (data?.callerSnsAddPressed && !isActivatedSns) {
        setIsActivatedSns(true);
      }
    });

    roomRef.collection('callerCandidates').onSnapshot(snapshot => {
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
      calleeExtensionPressed: true,
    });
  };

  // SNS 추가 버튼 이벤트 핸들러
  const handleAddSns = async () => {
    const roomRef = await db.collection('rooms').doc(roomId);
    await roomRef.update({
      calleeSnsAddPressed: true,
    });
  };

  const handleEndCall = () => {
    setEndModalVisible(false);
    onBackPress();
  };

  // 이미지 크기 & 모달창을 위한 styleSheet
  const styles = StyleSheet.create({
    AddSnsImage: {
      width: 37,
      height: 41,
    },
    StopCallImage: {
      width: 45,
      height: 45,
    },
    InfoImage: {
      width: 35,
      height: 35,
    },
    AddTimeImage: {
      width: 35,
      height: 35,
    },
    MuteImage: {
      width: 30,
      height: 32,
    },
    // 모달창 투명배경을 만들기 위한
    modalView: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      // borderRadius: 20,
      padding: 35,
    },
  });

  return (
    <View className="w-full h-full bg-black">
      {!isCallStarted ? (
        <>
          <ConnectSuccessScreen />
        </>
      ) : (
        <>
          {/* 타이머 & start call & switchCamera & toggleMute & startLocalStream & roomId*/}
          <View className="flex-row justify-around items-center h-[50px] bg-black">
            {/* switchCamera */}
            {localStream && (
              <TouchableOpacity
                className="w-14 h-14 my-auto"
                onPress={switchCamera}>
                <Image
                  className="mx-auto my-auto"
                  style={styles.AddTimeImage}
                  source={require('images/FlipCamera.png')}
                />
              </TouchableOpacity>
            )}

            {/* 타이머 */}
            <Timer
              onBackPress={onBackPress}
              timerStarted={timerStarted}
              isExtended={isExtended}
              setIsExtended={setIsExtended}
            />

            {/* toggleMute */}
            {localStream && (
              <TouchableOpacity
                className="w-14 h-14 my-auto"
                onPress={toggleMute}
                disabled={!remoteStream}>
                <Image
                  className="ml-0 my-auto"
                  style={styles.MuteImage}
                  source={require('images/Mute.png')}
                />
              </TouchableOpacity>
            )}

            {/* startLocalStream */}
            {!localStream && (
              <TouchableOpacity
                className="w-[56px] h-[30px] bg-white rounded my-auto"
                onPress={startLocalStream}>
                <Text>Click to start stream</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 정보 확인 모달 */}
          <Modal
            visible={infoModalVisible}
            onRequestClose={() => {
              setInfoModalVisible(!infoModalVisible);
            }}
            animationType="fade"
            transparent={true}>
           
              <View
                className="w-11/12 h-[220px] mt-36 mx-auto"
                style={styles.modalView}>
                <View>
                  <Text
                    className="text-[20px] text-brown"
                    style={{fontFamily: 'GowunDodum-Regular'}}>
                    전공 : {isActivatedMajor ? major : '?'}
                  </Text>
                </View>

                <View>
                  <Text
                    className="text-[20px] text-brown "
                    style={{fontFamily: 'GowunDodum-Regular'}}>
                    학번 : {isActivatedStudentId ? studentId : '?'}
                  </Text>
                </View>
                <View>
                  <Text
                    className="text-[20px] text-brown "
                    style={{fontFamily: 'GowunDodum-Regular'}}>
                    카카오톡 : {isActivatedSns ? kakao : '?'}
                  </Text>
                  <Text
                    className="text-[20px] text-brown "
                    style={{fontFamily: 'GowunDodum-Regular'}}>
                    인스타그램 : {isActivatedSns ? insta : '?'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                  <Text className="mx-auto mt-7 text-[16px] text-black underline">
                    취소
                  </Text>
                </TouchableOpacity>
              </View>
        
          </Modal>

          {/* 통화 종료 확인 모달 */}
          <Modal
            visible={endModalVisible}
            onRequestClose={() => {
              setEndModalVisible(!endModalVisible);
            }}
            animationType="fade"
            transparent={true}>
      
              <View
                className="w-11/12 h-[143px] mx-auto mt-36"
                style={styles.modalView}>
                <View>
                  <Text
                    className="text-[20px] text-center text-brown"
                    style={{fontFamily: 'GowunDodum-Regular'}}>
                    통화를 종료하시겠습니까?
                  </Text>
                </View>
                <View className="flex-row justify-around">
                  <TouchableOpacity onPress={handleEndCall}>
                    <Text className="mx-auto mt-5 text-[16px] text-black underline">
                      네
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEndModalVisible(false)}>
                    <Text className="mx-auto mt-5 text-[16px] text-black underline">
                      아니요
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
          </Modal>

          {/* 통화 화면 */}
          <View className='flex-auto p-2 bg-black'>
            {init ? (
              <View className="flex-auto space-y-2">
                {remoteStream && (
                  <RTCView
                    className="flex-auto"
                    objectFit={'cover'}
                    streamURL={remoteStream && remoteStream.toURL()}
                  />
                )}
                {localStream && (
                  <RTCView
                    className="flex-auto"
                    objectFit={'cover'}
                    streamURL={localStream && localStream.toURL()}
                  />
                )}
              </View>
            ) : null}
          </View>

          {/* 버튼들 */}
          <View className="flex-row justify-around items-center h-[70px] bg-black">
            {/* SNS 추가 버튼 */}
            <TouchableOpacity
              className="w-14 h-14 bg-white rounded-full"
              onPress={handleAddSns}>
              <Image
                className="mx-auto my-auto"
                style={styles.AddSnsImage}
                source={require('images/AddSns.png')}
              />
            </TouchableOpacity>

            {/* 통화 종료 버튼 */}
            <TouchableOpacity
              className="w-14 h-14 bg-white rounded-full"
              onPress={() => setEndModalVisible(true)}>
              <Image
                className="mx-auto my-auto"
                style={styles.StopCallImage}
                source={require('images/StopCall.png')}
              />
            </TouchableOpacity>

            {/* 정보 확인 버튼 */}
            <TouchableOpacity
              className="w-14 h-14 bg-white rounded-full"
              onPress={() => setInfoModalVisible(true)}>
              <Image
                className="mx-auto my-auto"
                style={styles.InfoImage}
                source={require('images/Info.png')}
              />
            </TouchableOpacity>

            {/* 통화 연장 버튼 */}
            {localStream && (
              <TouchableOpacity
                className="w-14 h-14 bg-white rounded-full"
                onPress={extendCall}>
                <Image
                  className="mx-auto my-auto"
                  style={styles.AddTimeImage}
                  source={require('images/AddTime.png')}
                />
              </TouchableOpacity>
            )}
          </View>

       
        </>
      )}
    </View>
  );
}
