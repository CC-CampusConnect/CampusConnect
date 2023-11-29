// ConnectFailScreen.tsx
// 5-2. 랜덤 매칭 실패 페이지

import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {CommonActions} from '@react-navigation/native';

export default function ConnectFailScreen({navigation}: {navigation: any}) {
  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    StopCallImage: {
      width: 45,
      height: 45,
    },

    SmileDogImage: {
      width: 231,
      height: 185,
    },
  });

  const handleCancle = () => {
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
  return (
    <View className="flex w-full h-full relative justify-center items-center bg-white-gray">
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

      
      {/* 이미지, 멘트 */}
      <View className="absolute justify-center items-center">
        <Image
          className=""
          style={styles.SmileDogImage}
          source={require('images/SadDog.png')}
        />
        <Text
          className="text-[32px] text-brown"
          style={{fontFamily: 'GowunDodum-Regular'}}>
          매칭 실패에요...
        </Text>
      </View>

      {/* 다시시도, 취소 버튼 */}
      <View className="w-full absolute bottom-0 ">
        <TouchableOpacity
          className="w-full justify-end h-[75px] bg-orange-500"
          onPress={() => navigation.navigate('WaitConnect')}>
          <Text className="mx-auto my-auto text-sm text-white">다시 시도</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full justify-end h-[75px] mt-1 bg-pink-500"
          onPress={handleCancle}>
          <Text className="mx-auto my-auto text-sm text-white">취소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
