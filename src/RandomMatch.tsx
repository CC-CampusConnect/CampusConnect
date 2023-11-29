import React, {useContext, useState, useEffect} from 'react';
import {View} from 'react-native';
import {db} from './util/firestore';
import {UserContext} from './UserContext';
import firestore from '@react-native-firebase/firestore';

import {CommonActions} from '@react-navigation/native';

import useInterval from './hooks/useInterval';
import LoadingScreen from './LoadingScreen';

export default function RandomMatch({navigation}: any) {
  const {uid} = useContext(UserContext);

  const [queue, setQueue] = useState<string[]>([]);
  const queueFirestoreRef = db.collection('queue');
  const [start, setStart] = useState<boolean>(false);
  const [targetUid, setTargetUid] = useState<string>('');

  const [delay, setDelay] = useState<number | null>(1000); // 1 밀리초 간격
  const [seconds, setSeconds] = useState<number>(10);

  /**
   * useInterval callback 함수
   * @name handleCountdown
   * @returns {void}
   * @description 매칭 시작 후 10초 카운트다운
   */
  const handleCountdown = () => {
    if (start) {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        setDelay(null);
        console.log('매칭 타이머 종료');

        deleteQueue(); // 파이어스토어 대기 큐에서 유저 삭제
        addQueue(); // 파이어스토어 대기 큐에 유저 추가
      }
    }
  };

  useInterval(handleCountdown, delay);

  /**
   * 파이어스토어 대기 큐에 유저 추가
   * @name addQueue
   * @returns {void}
   */
  const addQueue = async () => {
    await queueFirestoreRef.doc(uid).set({
      createdAt: firestore.FieldValue.serverTimestamp(),
      roomId: '',
      caller: false,
      callee: false,
      callerReady: false,
      calleeReady: false,
    });
  };

  /**
   * 파이어스토어 대기 큐에서 유저 삭제
   * @name deleteQueue
   * @description 화면에서 벗어날 때 실행
   * @returns {void}
   */
  const deleteQueue = async () => {
    await queueFirestoreRef.doc(uid).delete();
  };

  useEffect(() => {
    // 화면에 들어올 때 실행

    /**
     * 파이어스토어 대기 큐에 있는 유저들을 오름차순으로 정렬하여 가져옴
     * @name unscribe
     * @description 파이어스토어 대기 큐 리스너
     * @returns {void}
     */
    const unscribe = queueFirestoreRef
      .orderBy('createdAt')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.id);
        setQueue(data);
      });

    addQueue();

    return () => {
      // 화면 벗어날 때 실행
      unscribe(); // 리스너 해제

      deleteQueue();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 대기 큐에 있는 유저들 중 첫번째 유저가 나일 경우 매칭 권한 부여
    if (uid) {
      const index = queue.indexOf(uid);
      if (index === 0 && queue.length > 1 && !start) {
        // 대기 큐에 내가 있고, 내가 첫번째이고, 대기 큐에 사람이 두명 이상이고, 매칭이 시작되지 않았을 때
        setStart(true);
      }
    }
  }, [queue, uid, start]);

  useEffect(() => {
    // 매칭 권한 부여 후 실행
    if (start && uid && queue.length > 1 && !targetUid) {
      const random = Math.floor(Math.random() * (queue.length - 1) + 1);
      setTargetUid(queue[random]);
      // console.log('caller', uid, 'callee', queue[random]);
    }
  }, [start, uid, queue, targetUid]);

  useEffect(() => {
    // 매칭 대상이 있을 경우 실행

    /**
     * 파이어스토어 rooms docs에 새로운 방 생성
     * @name createRoom
     * @returns {void}
     */
    const createRoom = async () => {
      // rooms docs에 새로운 방 생성
      const roomRef = await db.collection('rooms').add({
        createdAt: firestore.FieldValue.serverTimestamp(),
        caller: uid,
        callee: targetUid,
      });
      const roomId = roomRef.id;

      const callerRef = db.collection('queue').doc(uid);
      const calleeRef = db.collection('queue').doc(targetUid);

      try {
        // queue uid docs에 방 id 추가 및 caller 값 변경
        await callerRef.update({
          roomId: roomId,
          caller: true,
          callerReady: true,
        });
        await calleeRef.update({
          callerReady: true,
        });

        // queue targetUid docs에 방 id 추가 및 callee 값 변경
        await calleeRef.update({
          roomId: roomId,
          callee: true,
          calleeReady: true,
        });
        await callerRef.update({
          calleeReady: true,
        });
      } catch (error) {
        console.log(error);

        console.log('방 생성 실패');

        const callerExists = (await callerRef.get()).exists;
        const calleeExists = (await calleeRef.get()).exists;

        await roomRef.delete();

        if (callerExists) {
          console.log('caller 초기화');
          await callerRef.update({
            roomId: '',
            caller: false,
            callee: false,
            callerReady: false,
            calleeReady: false,
          });
        } else {
          console.log('caller가 존재하지 않음');
        }
        if (calleeExists) {
          console.log('callee 초기화');
          await calleeRef.update({
            roomId: '',
            caller: false,
            callee: false,
            callerReady: false,
            calleeReady: false,
          });
        } else {
          console.log('callee가 존재하지 않음');
        }

        // 리셋
        setTargetUid('');
        setStart(false);
        setSeconds(10);

        console.log('매칭 다시 시작');
      }
    };

    if (uid && targetUid) {
      // rooms docs에 새로운 방 생성
      // 성공적으로 방 생성시 매칭 시작
      createRoom();
    }
  }, [targetUid, uid, navigation]);

  // 최종적으로 실행되는 로직
  // roomId가 있을 경우 방으로 이동
  // 해당 로직은 권한자와 피권한자 모두 실행
  useEffect(() => {
    if (uid) {
      const uidRef = db.collection('queue').doc(uid);
      /**
       * 파이어스토어 queue docs 리스너
       * @name unscribe
       * @description 방으로 이동
       * @returns {void}
       */
      const unscribe = uidRef.onSnapshot(doc => {
        const data = doc.data();
        if (data) {
          const roomId = data.roomId;
          const caller = data.caller;
          const callee = data.callee;
          const callerReady = data.callerReady;
          const calleeReady = data.calleeReady;
          if (roomId && callerReady && calleeReady) {
            console.log('방으로 이동');
            if (caller) {
              console.log('caller', uid);

              // callScreen으로 이동
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {name: 'Home'},
                    {
                      name: 'WebRTCCall',
                      params: {
                        roomId: roomId,
                      },
                    },
                  ],
                }),
              );

              // 리셋
              setStart(false);
              setTargetUid('');
            }
            if (callee) {
              console.log('callee', uid);

              // joinScreen으로 이동
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {name: 'Home'},
                    {
                      name: 'WebRTCJoin',
                      params: {
                        roomId: roomId,
                      },
                    },
                  ],
                }),
              );
              // 리셋
              setStart(false);
              setTargetUid('');
            }
          }
        }
      });
      return () => {
        unscribe();
      };
    }
  }, [uid, navigation]);

  return (
    <View>
      {/* <Text>{uid}</Text>
      <Text>랜덤 매칭 화면</Text>
      {start ? (
        <View>
          <Text>매칭 시작</Text>
          <Text>{seconds}초 까지 권한 부여</Text>
          <Text>targetUid: {targetUid}</Text>
        </View>
      ) : (
        <Text>매칭 대기 중</Text>
      )} */}
      <LoadingScreen
        navigation={navigation}
        loadingMessage="매칭 중이에요..."
      />
    </View>
  );
}
