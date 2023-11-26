// ConnectSuccessScreen.tsx
// 5-3. 랜덤 매칭 성공 페이지

import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet, } from 'react-native';

export default function ConnectSuccessScreen({navigation}: {navigation: any}) {

  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    StopCallImage: {
      width: 45,
      height: 45,
    },

    SmailDogImage: {
      width:231,
      height:185,
    },
  });

  return (
    <View className="flex w-full h-full relative bg-white-gray">

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

      {/* 이미지, 멘트 */}
      <View className="flex w-full h-full">
        <Image
        className="mx-auto top-[300px]"
        style={styles.SmailDogImage}
        source={require('images/SadDog.png')}
        />  
        <Text
        className='top-[330px] text-[32px] text-brown mx-auto' 
        style={{fontFamily: 'GowunDodum-Regular'}}>
            매칭 실패에요...
        </Text>
      </View>

      {/* 5-1 랜덤 매칭 대기 페이지로 이동 */}
      <View className="flex w-full h-full absolute justify-end mb-0">
        <TouchableOpacity
            className="w-full w-full justify-end h-[65px] bg-pink-500"
                onPress={() => navigation.navigate('WaitConnect')}>
            <Text className='mx-auto my-auto text-sm text-white'>다시 시도</Text>
        </TouchableOpacity>
      </View>

      {/* 메인페이지로 이동(통화 취소하기) */}
      <TouchableOpacity
        className="absolute top-[26px] right-[26px] w-[56px] h-[56px] bg-pink-500 rounded-full"
        onPress={() => navigation.navigate('MainPage')}>
        <Image style={styles.StopCallImage} source={require('images/StopCall.png')} className='mx-auto my-auto'/>
      </TouchableOpacity>
    </View>
  );
}