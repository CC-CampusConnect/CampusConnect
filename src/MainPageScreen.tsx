// 4. 메인페이지
// MainPageScreen.tsx

import React, {useState} from 'react';
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
import {IsLoginContext} from './IsLoginContext';

export default function MainPageScreen({navigation}: {navigation: any}) {
  const {control, handleSubmit, formState} = useForm<FormData>();
  const [text, setText] = useState<string>(''); // 기타 사유
  const [modalVisible, setModalVisible] = useState(false); // 카카오톡 모달 상태
  const [modalVisible2, setModalVisible2] = useState(false); // 인스타 모달 상태
  const {setUid} = useContext(IsLoginContext);

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
      setUid(null);
      console.log('로그아웃 되었습니다. 로그인 페이지로 이동합니다.');
      navigation.navigate('SignIn');
    } catch (error: any) {
      console.log(error);
    }
  };

  // 카카오톡 클릭 시 호출되는 함수
  const kakaohandleReport = async () => {
    try {
      await db.collection('reports').add({
        etcText: text,
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
      await db.collection('reports').add({
        etcText: text,
      });
      Alert.alert('인스타 계정 입력이 완료되었습니다.');
      setModalVisible2(false);
    } catch (error) {
      console.error('계정 정보 처리 오류 발생', error);
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

  return (
    <View className="flex w-full h-full relative bg-white-gray">
      {/* 배경 이미지 */}
      <View className="w-[346px] h-[767px] left-[33px] top-[30px] absolute">
        <Image
          className="w-[46px] h-[35px] left-0 top-0 absolute"
          source={require('images/Cat.png')}
        />
        <Image
          className="w-[46px] h-[35px] left-[6px] top-[402px] absolute"
          source={require('images/Cat.png')}
        />
        <Image
          className="w-[46px] h-[35px] left-[6px] top-[692px] absolute"
          source={require('images/Cat.png')}
        />

        <Image
          className="w-16 h-9 left-[155px] top-[191px] absolute"
          source={require('images/Rabbit.png')}
        />
        <Image
          className="w-16 h-9 left-[155px] top-[582px] absolute"
          source={require('images/Rabbit.png')}
        />

        <Image
          className="w-[53px] h-[35px] left-[293px] top-[69px] absolute"
          source={require('images/Dog.png')}
        />
        <Image
          className="w-[53px] h-[35px] left-[293px] top-[470px] absolute"
          source={require('images/Dog.png')}
        />
        <Image
          className="w-[53px] h-[35px] left-[293px] top-[732px] absolute"
          source={require('images/Dog.png')}
        />
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
            <Image
              className="w-[46px] h-[35px] left-0 top-0 absolute"
              source={require('images/Cat.png')}
            />
            <Image
              className="w-[46px] h-[35px] left-[6px] top-[402px] absolute"
              source={require('images/Cat.png')}
            />
            <Image
              className="w-[46px] h-[35px] left-[6px] top-[692px] absolute"
              source={require('images/Cat.png')}
            />

            <Image
              className="w-16 h-9 left-[155px] top-[191px] absolute"
              source={require('images/Rabbit.png')}
            />
            <Image
              className="w-16 h-9 left-[155px] top-[582px] absolute"
              source={require('images/Rabbit.png')}
            />

            <Image
              className="w-[53px] h-[35px] left-[293px] top-[69px] absolute"
              source={require('images/Dog.png')}
            />
            <Image
              className="w-[53px] h-[35px] left-[293px] top-[470px] absolute"
              source={require('images/Dog.png')}
            />
            <Image
              className="w-[53px] h-[35px] left-[293px] top-[732px] absolute"
              source={require('images/Dog.png')}
            />
          </View>

          <View className="top-[178px] mx-auto w-[391px] h-[207px] bg-white border">
            <Text
              style={{fontFamily: 'GowunDodum-Regular'}}
              className="mx-auto text-[26px] mt-[22px] ml-[29px] text-brown">
              카카오톡
            </Text>
            <TextInput
              className="w-[330px] h-[52px] ml-[30px] mt-[20px] border border-solid-100 bg-white-gray"
              value={text}
              onChangeText={t => {
                setText(t);
              }}
              placeholder="카카오톡 계정을 입력해주세요."
            />
            <View className="flex flex-row mx-auto mt-[20px] space-x-24">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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
            <Image
              className="w-[46px] h-[35px] left-0 top-0 absolute"
              source={require('images/Cat.png')}
            />
            <Image
              className="w-[46px] h-[35px] left-[6px] top-[402px] absolute"
              source={require('images/Cat.png')}
            />
            <Image
              className="w-[46px] h-[35px] left-[6px] top-[692px] absolute"
              source={require('images/Cat.png')}
            />

            <Image
              className="w-16 h-9 left-[155px] top-[191px] absolute"
              source={require('images/Rabbit.png')}
            />
            <Image
              className="w-16 h-9 left-[155px] top-[582px] absolute"
              source={require('images/Rabbit.png')}
            />

            <Image
              className="w-[53px] h-[35px] left-[293px] top-[69px] absolute"
              source={require('images/Dog.png')}
            />
            <Image
              className="w-[53px] h-[35px] left-[293px] top-[470px] absolute"
              source={require('images/Dog.png')}
            />
            <Image
              className="w-[53px] h-[35px] left-[293px] top-[732px] absolute"
              source={require('images/Dog.png')}
            />
          </View>

          <View className="top-[178px] mx-auto w-[391px] h-[207px] bg-white border">
            <Text
              style={{fontFamily: 'GowunDodum-Regular'}}
              className="mx-auto text-[26px] mt-[22px] ml-[29px] text-brown">
              인스타
            </Text>
            <TextInput
              className="w-[330px] h-[52px] ml-[30px] mt-[20px] border border-solid-100 bg-white-gray"
              value={text}
              onChangeText={t => {
                setText(t);
              }}
              placeholder="인스타 계정을 입력해주세요."
            />
            <View className="flex flex-row mx-auto mt-[20px] space-x-24">
              <TouchableOpacity onPress={() => setModalVisible2(false)}>
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

      <TouchableOpacity className="absolute top-0 right-5" onPress={logout}>
        <Text className="mx-auto mt-[16px] mb-[144px] text-xs text-black underline">
          로그아웃
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="absolute top-5 ml-[20px]"
        onPress={() => setModalVisible(true)}>
        <Image style={styles.snsImage} source={require('images/kakao.png')} />
      </TouchableOpacity>

      <TouchableOpacity
        className="absolute top-5 ml-[70px]"
        onPress={() => setModalVisible2(true)}>
        <Image style={styles.snsImage} source={require('images/insta.png')} />
      </TouchableOpacity>

      <Image
        className="mx-auto mt-[91px]"
        style={styles.LogoImage}
        source={require('images/CCLogo.png')}
      />

      <TouchableOpacity
        className="mx-auto mt-[160px] w-[217px] h-[217px] bg-pink-500 rounded-full shadow"
        onPress={handleSubmit(onSubmit)}>
        <Text
          style={{fontFamily: 'GowunDodum-Regular'}}
          className="mx-auto mt-auto text-xxl text-white">
          매칭
        </Text>
        <Text
          style={{fontFamily: 'GowunDodum-Regular'}}
          className="mx-auto mb-auto text-xxl text-white">
          시작
        </Text>
      </TouchableOpacity>
    </View>
  );
}
