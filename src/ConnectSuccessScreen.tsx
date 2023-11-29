// ConnectSuccessScreen.tsx
// 5-3. 랜덤 매칭 성공 페이지

import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {ProgressBar} from 'react-native-paper';

export default function ConnectSuccessScreen() {
  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    SmileDogImage: {
      width: 231,
      height: 185,
    },
  });

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
      <View className="justify-center items-center">
        <Image
          className=""
          style={styles.SmileDogImage}
          source={require('images/SmileDogFace.png')}
        />
        <Text
          className="text-[32px] text-brown mx-auto"
          style={{fontFamily: 'GowunDodum-Regular'}}>
          매칭 성공!
        </Text>
        <Text
          className="top-[330px] text-[32px] text-brown mx-auto"
          style={{fontFamily: 'GowunDodum-Regular'}}>
          영상 통화 연결 중입니다.
        </Text>

        {/* 로딩바 */}
        <View className="space-y-4 top-[350px]">
          <View>
            {/* indeterminate ProgressBar */}
            <ProgressBar
              className="mx-auto w-[300px]"
              indeterminate
              color={'#FF8967'}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
