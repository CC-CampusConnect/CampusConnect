// ConnectSuccessScreen.tsx
// 5-3. 랜덤 매칭 성공 페이지

import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, } from 'react-native';

export default function ConnectSuccessScreen({navigation}: {navigation: any}) {

    useEffect(() => {
        const timer = setTimeout(() => {
        navigation.navigate('WebRTCRoom'); // WebRTCRoom.tsx로 이동
        }, 2000); // 2초 후에 WebRTCRoom 이동

        return () => clearTimeout(timer);
    }, []);

  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    SmileDogImage: {
      width:231,
      height:185,
    },
  });

  return (
    <View className="flex w-full h-full relative justify-center items-center bg-white-gray">

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
      <View className="justify-center items-center">
        <Image
        className=""
        style={styles.SmileDogImage}
        source={require('images/SmileDogFace.png')}
        />  
        <Text
        className='text-[32px] text-brown mx-auto' 
        style={{fontFamily: 'GowunDodum-Regular'}}>
            매칭 성공!
        </Text>
      </View>
    </View>
  );
}