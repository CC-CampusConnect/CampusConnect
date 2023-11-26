// WaitConnectScreen.tsx
// 5-1 랜덤 매칭 대기 페이지

import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { ProgressBar } from 'react-native-paper';

export default function WaitConnectScreen({navigation}: {navigation: any}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // 10초 후에 clearInterval로 인터벌 제거
      if (progress < 1) {
        setProgress(prevProgress => prevProgress + 0.07);
      } else {
        clearInterval(interval);
      }
    }, 1000); // 1초마다 증가시켜 10초 동안 진행
    return () => clearInterval(interval);
  }, [progress]);

  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    BackImage: {
      width: 33,
      height: 26,
    },

    SmileDogImage: {
      width:231,
      height:185,
    },
  });

  return (
    <View className='flex w-full h-full relative bg-white-gray '>
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

      <View>
        <Image
          className="mx-auto top-[300px]"
          style={styles.SmileDogImage}
          source={require('images/SmileDog.png')}
        />  
        <Text
          className='top-[330px] text-[32px] text-brown mx-auto' 
          style={{fontFamily: 'GowunDodum-Regular'}}>
            매칭 중이에요...
        </Text>

        {/* 로딩바 */}
        <View className='space-y-4 top-[350px]'>
          <View>
            {/* progress state를 이용한 ProgressBar */}
            <ProgressBar className='mx-auto w-[300px]' progress={progress} color={'#FF8967'} />
          </View>
          <View>
            {/* indeterminate ProgressBar */}
            <ProgressBar className='mx-auto w-[300px]' indeterminate color={'#FF8967'} />
          </View>
          <View>
            {/* ActivityIndicator 동그란 로딩 */}
            <ActivityIndicator size="large" color={'#FF8967'} style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1 }} />
          </View>
        </View>
      </View>
      
      {/* 메인페이지로 이동(뒤로가기) */}
      <TouchableOpacity
        className="absolute top-[26px] right-[26px] w-[56px] h-[56px] bg-pink-500 rounded-full"
        onPress={() => navigation.navigate('MainPage')}>
          <Image style={styles.BackImage} source={require('images/Back.png')} className='mx-auto my-auto'/>
      </TouchableOpacity>
      
    </View>
  );
}