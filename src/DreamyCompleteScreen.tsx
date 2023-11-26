// 3-3. 인증 완료 페이지
// DreamyCompleteScreen.tsx

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {CommonActions} from '@react-navigation/native';

export default function DreamyCompleteScreen({navigation}: {navigation: any}) {
  const {control, handleSubmit, formState} = useForm<FormData>();
  const [isFont, setIsFont] = useState(false); // 폰트 적요을 위한 state 생성

  const onSubmit = async (data: FormData) => {
    console.log('인증 완료. 메인 페이지로 이동');
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {name: 'Home'},
          {
            name: 'MainPage',
          },
        ],
      }),
    );
  };

  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    LogoImage: {
      width: 270,
      height: 334,
    },

    catImage: {
      width: 46,
      height: 35,
    },

    dogImage: {
      width: 53,
      height: 35,
    },

    rabbitImage: {
      width: 64,
      height: 36,
    },
  });

  // Loading font

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

      <View className="ml-[29px] mr-[29px]">
        <Text
          style={{fontFamily: 'EmblemaOne-Regular'}}
          className="absolute mt-[140px] text-orange-400 text-[32px]">
          Campus Connect
        </Text>
        <Text
          style={{fontFamily: 'GowunDodum-Regular'}}
          className="absolute pt-[262px] text-brown text-[32px] font-EmblemaOne">
          인증 완료!
        </Text>
        <View className="mt-[313px]">
          <Text
            style={{fontFamily: 'GowunDodum-Regular'}}
            className="text-gray text-ssm">
            인증이 완료되었어요.
          </Text>
          <Text
            style={{fontFamily: 'GowunDodum-Regular'}}
            className="text-gray text-ssm">
            확인 버튼을 누르면 메인으로 이동합니다.
          </Text>
        </View>
      </View>

      <View className="flex w-full h-full absolute justify-end mb-0">
        <TouchableOpacity
          className="w-full w-full justify-end h-[65px] bg-pink-500"
          onPress={handleSubmit(onSubmit)}>
          <Text className="mx-auto my-auto text-sm text-white">확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
