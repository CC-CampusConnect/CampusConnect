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

  const [localStream, setLocalStream] = useState<MediaStream | null>(null); // Stream of local user
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(
    null,
  ); /* When a call is connected, the video stream from the receiver is appended to this state in the stream*/
  const [cachedLocalPC, setCachedLocalPC] = useState<RTCPeerConnection | null>( // 로컬 PeerConnection
    null,
  );

  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    startLocalStream();
  }, []);

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

  const joinCall = async (id: string) => {
    const roomRef = await db.collection('rooms').doc(id); // 방 참가
    const roomSnapshot = await roomRef.get(); // 방 정보 가져오기

    if (!roomSnapshot.exists) {
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

    localPC.addEventListener('icecandidate', e => {
      //icecandidate 이벤트는 RTCPeerConnection의 로컬 ICE 에이전트가 새로운 ICE candidate를 생성했을 때 발생합니다.
      if (!e.candidate) {
        console.log('Got final candidate!');
        return;
      }
      calleeCandidatesCollection.add(e.candidate.toJSON());
    });

    localPC.addEventListener('track', e => {
      //track 이벤트는 RTCPeerConnection의 연결된 미디어 소스로부터 발생합니다.

      if (e.streams[0] && remoteStream !== e.streams[0]) {
        console.log('RemotePC received the stream', e.streams[0]);
        setRemoteStream(e.streams[0]);
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

  return (
    <View className="w-full h-full flex flex-col">
      <Text>Join Screen</Text>
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
              title="Click to join call"
              onPress={() => joinCall(roomId)}
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
