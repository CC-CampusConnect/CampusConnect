// 4. 메인페이지
// MainPageScreen.tsx

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import {db} from './util/firestore';
import {useContext} from 'react';
import {UserContext} from './UserContext';
import {CommonActions} from '@react-navigation/native';

export default function MainPageScreen({navigation}: {navigation: any}) {
  const {control, handleSubmit, formState} = useForm<FormData>();
  const [kakaoId, setKakaoid] = useState<string>(''); // 카카오톡 계정 입력
  const [instaId, setInstaid] = useState<string>(''); // 인스타 계정 입력
  const [modalVisible, setModalVisible] = useState(false); // 카카오톡 모달 상태
  const [modalVisible2, setModalVisible2] = useState(false); // 인스타 모달 상태
  const {setUid, uid} = useContext(UserContext);

  // 매칭 시작 버튼 누르면 WebRTCRoom으로 이동
  const onSubmit = async (data: FormData) => {
    console.log('화상 통화 시작.');
    navigation.navigate('WebRTCRoom');
  };

  // 로그아웃 버튼
  const logout = async () => {
    try {
      await auth().signOut();
      // 로그아웃 시 uid를 null로 변경
      setUid(undefined);
      console.log('로그아웃 되었습니다. 로그인 페이지로 이동합니다.');
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {name: 'Home'},
            {
              name: 'SignIn',
            },
          ],
        }),
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  // 카카오톡 클릭 시 호출되는 함수
  const kakaohandleReport = async () => {
    try {
      const userRef = db.collection('Users').doc(uid);
      await userRef.update({
        kakao: kakaoId,
      });
      Alert.alert('카카오톡 계정 입력이 완료되었습니다.');
      setModalVisible(false);
    } catch (error) {
      console.error('계정 정보 처리 오류 발생', error);
    }
  };

  // 인스타 클릭 시 호출되는 함수
  const instahandleReport = async () => {
    try {
      const userRef = db.collection('Users').doc(uid);
      await userRef.update({
        insta: instaId,
      });
      Alert.alert('인스타 계정 입력이 완료되었습니다.');
      setModalVisible2(false);
    } catch (error) {
      console.error('계정 정보 처리 오류 발생', error);
    }
  };

  const clearKakao = async () => {
    const userRef = db.collection('Users').doc(uid);
    const doc = await userRef.get();
    const kakao = doc.data()?.kakao;
    setKakaoid(kakao);

    setModalVisible(false);
  };

  const clearInsta = async () => {
    const userRef = db.collection('Users').doc(uid);
    const doc = await userRef.get();
    const insta = doc.data()?.insta;
    setInstaid(insta);

    setModalVisible2(false);
  };

  // 처음 렌더링 될 때 db에서 계정 정보 가져와서 표시
  const getAccount = async () => {
    const userRef = db.collection('Users').doc(uid);
    const doc = await userRef.get();
    const kakao = doc.data()?.kakao;
    const insta = doc.data()?.insta;
    if (kakao === undefined) {
      setKakaoid('');
    } else {
      setKakaoid(kakao);
    }
    if (insta === undefined) {
      setInstaid('');
    } else {
      setInstaid(insta);
    }
  };

  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    LogoImage: {
      width: 270,
      height: 334,
    },

    snsImage: {
      width: 35,
      height: 35,
    },
  });

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <View className="flex w-full h-full bg-[#F5F1E8] relative">
      {/* 배경 이미지 */}
      <View className="w-[346px] h-[767px] left-[33px] top-[30px] absolute">
        <Image className="w-[46px] h-[35px] left-[6px] top-[60px] absolute" source={require('images/Cat.png')} />
        <Image className="w-[46px] h-[35px] left-[6px] top-[402px] absolute" source={require('images/Cat.png')} />
        <Image className="w-[46px] h-[35px] left-[6px] top-[660px] absolute" source={require('images/Cat.png')} />

        <Image className="w-16 h-9 left-[155px] top-[300px] absolute" source={require('images/Rabbit.png')} />
        <Image className="w-16 h-9 left-[155px] top-[582px] absolute" source={require('images/Rabbit.png')} />
        
        <Image className="w-[53px] h-[35px] left-[293px] top-[69px] absolute" source={require('images/Dog.png')} />
        <Image className="w-[53px] h-[35px] left-[293px] top-[430px] absolute" source={require('images/Dog.png')} />
        
      </View>
      
      {/* 인스타, 카카오톡, 로그아웃 */}
      <View className='top-[37px] left-[49px] right-[49px] absolute'>
        <TouchableOpacity className="absolute right-5" onPress={logout}>
          <Text className="text-xs text-black underline">
            로그아웃
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="absolute left-[50px]"
          onPress={() => setModalVisible(true)}>
          <Image style={styles.snsImage} source={require('images/kakao.png')} />
        </TouchableOpacity>

        <TouchableOpacity
          className="absolute"
          onPress={() => setModalVisible2(true)}>
          <Image style={styles.snsImage} source={require('images/insta.png')} />
        </TouchableOpacity>
      </View>

      {/* Campus Connect CC로 새로운 인연을 만들어보세요*/}
      <View className='top-[166px] left-[49px] absolute'>
        <Text
          style={{fontFamily: 'EmblemaOne-Regular'}}
          className=" text-orange-400 text-[45px]">
          Campus
        </Text>
        <Text
          style={{fontFamily: 'EmblemaOne-Regular'}}
          className=" text-orange-400 text-[45px]">
          Connect
        </Text>
        <Text
          style={{fontFamily: 'GowunDodum-Regular'}}
          className=" text-brown text-[20px]">
          CC로 새로운 인연을 만들어보세요
        </Text>
      </View>

      {/* 매칭 시작 버튼 */}
      <View className='p-12 absolute bottom-0 w-full'>
        <TouchableOpacity
          className="p-2 rounded-[35px] bg-pink-500"
          onPress={handleSubmit(onSubmit)}>
          <Text style={{fontFamily: 'GowunDodum-Regular'}} className="text-center text-[40px] text-white">
            매칭 시작
          </Text>
        </TouchableOpacity>
      </View>

      {/* 카카오톡 계정 입력 모달 */}
      <View>
        <Modal
          visible={modalVisible}
          // 안드로이드의 뒤로가기 버튼 클릭 시 모달 비활성화
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
          animationType="slide">
 
          {/* 배경 이미지 */}
          <View className="w-[346px] h-[767px] left-[33px] top-[30px] absolute">
            <Image className="w-[46px] h-[35px] left-0 top-0 absolute" source={require('images/Cat.png')} />
            <Image className="w-[46px] h-[35px] left-[6px] top-[402px] absolute" source={require('images/Cat.png')} />
            <Image className="w-[46px] h-[35px] left-[6px] top-[692px] absolute" source={require('images/Cat.png')} />

            <Image className="w-16 h-9 left-[155px] top-[191px] absolute" source={require('images/Rabbit.png')} />
            <Image className="w-16 h-9 left-[155px] top-[582px] absolute" source={require('images/Rabbit.png')} />
            
            <Image className="w-[53px] h-[35px] left-[293px] top-[69px] absolute" source={require('images/Dog.png')} />
            <Image className="w-[53px] h-[35px] left-[293px] top-[470px] absolute" source={require('images/Dog.png')} />
            <Image className="w-[53px] h-[35px] left-[293px] top-[732px] absolute" source={require('images/Dog.png')} />
          </View>

          <View className="top-[178px] mx-auto w-[391px] h-[207px] bg-white border">
            <View className="flex-row mx-5 mt-5">
              <Image
                style={styles.snsImage}
                source={require('images/kakao.png')}
              />
              <Text
                style={{fontFamily: 'GowunDodum-Regular'}}
                className="ml-2 text-[26px] text-brown">
                카카오톡
              </Text>
            </View>

            <TextInput
              className="w-[330px] h-[52px] ml-[30px] mt-[20px] border border-solid-100 bg-white-gray"
              value={kakaoId}
              onChangeText={t => {
                setKakaoid(t);
              }}
              placeholder="카카오톡 계정을 입력해주세요."
            />
            <View className="flex flex-row mx-auto mt-[20px] space-x-24">
              <TouchableOpacity onPress={clearKakao}>
                <Text
                  className="mx-auto text-[16px] text-black underline"
                  style={{fontFamily: 'GowunDodum-Regular'}}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={kakaohandleReport}>
                <Text
                  className="mx-auto text-[16px] text-black underline"
                  style={{fontFamily: 'GowunDodum-Regular'}}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* 인스타 계정 입력 모달 */}
      <View>
        <Modal
          visible={modalVisible2}
          // 안드로이드의 뒤로가기 버튼 클릭 시 모달 비활성화
          onRequestClose={() => {
            setModalVisible2(!modalVisible2);
          }}
          animationType="slide">
        {/* 배경 이미지 */}
        <View className="w-[346px] h-[767px] left-[33px] top-[30px] absolute">
          <Image className="w-[46px] h-[35px] left-0 top-0 absolute" source={require('images/Cat.png')} />
          <Image className="w-[46px] h-[35px] left-[6px] top-[402px] absolute" source={require('images/Cat.png')} />
          <Image className="w-[46px] h-[35px] left-[6px] top-[692px] absolute" source={require('images/Cat.png')} />

          <Image className="w-16 h-9 left-[155px] top-[191px] absolute" source={require('images/Rabbit.png')} />
          <Image className="w-16 h-9 left-[155px] top-[582px] absolute" source={require('images/Rabbit.png')} />
          
          <Image className="w-[53px] h-[35px] left-[293px] top-[69px] absolute" source={require('images/Dog.png')} />
          <Image className="w-[53px] h-[35px] left-[293px] top-[470px] absolute" source={require('images/Dog.png')} />
          <Image className="w-[53px] h-[35px] left-[293px] top-[732px] absolute" source={require('images/Dog.png')} />
        </View>

          <View className="top-[178px] mx-auto w-[391px] h-[207px] bg-white border">
            <View className="flex-row mx-5 mt-5">
              <Image
                style={styles.snsImage}
                source={require('images/insta.png')}
              />
              <Text
                style={{fontFamily: 'GowunDodum-Regular'}}
                className="text-[26px] ml-2 text-brown">
                인스타
              </Text>
            </View>

            <TextInput
              className="w-[330px] h-[52px] ml-[30px] mt-[20px] border border-solid-100 bg-white-gray"
              value={instaId}
              onChangeText={t => {
                setInstaid(t);
              }}
              placeholder="인스타 계정을 입력해주세요."
            />
            <View className="flex flex-row mx-auto mt-[20px] space-x-24">
              <TouchableOpacity onPress={clearInsta}>
                <Text
                  className="mx-auto text-[16px] text-black underline"
                  style={{fontFamily: 'GowunDodum-Regular'}}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={instahandleReport}>
                <Text
                  className="mx-auto text-[16px] text-black underline"
                  style={{fontFamily: 'GowunDodum-Regular'}}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      
    </View>
  );
}
