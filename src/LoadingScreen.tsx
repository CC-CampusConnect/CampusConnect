// WaitConnectScreen.tsx
// 3-4. 하영드리미 로딩 페이지
// 5-1 랜덤 매칭 대기 페이지

import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import {CommonActions} from '@react-navigation/native';

type LoadingProps = {
  navigation: any;
  loadingMessage: string;
};

export default function LoadingScreen({
  navigation,
  loadingMessage,
}: LoadingProps) {
  const [isExistedBack, setIsExistedBack] = useState<Boolean>(false);
  const handleBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Home'}, {name: 'MainPage'}],
      }),
    );
  };
  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    BackImage: {
      width: 33,
      height: 26,
    },

    SmileDogImage: {
      width: 231,
      height: 185,
    },
  });

  useEffect(() => {
    if (loadingMessage === '매칭 중이에요...') {
      setIsExistedBack(true);
    }
  }, [loadingMessage]);

  return (
    <>
      <View className="flex w-full h-full relative justify-center items-center bg-white-gray ">
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

        <View className="absolute justify-center items-center">
          <Image
            className=""
            style={styles.SmileDogImage}
            source={require('images/SmileDog.png')}
          />
          <Text
            className="text-[32px] mt-2 text-brown"
            style={{fontFamily: 'GowunDodum-Regular'}}>
            {loadingMessage}
          </Text>
          {/* 로딩바 */}
          <View>
            {/* indeterminate ProgressBar */}
            <ProgressBar
              className="w-[300px] mt-12"
              indeterminate
              color={'#FF8967'}
            />
          </View>
        </View>
        {isExistedBack && (
          <TouchableOpacity
            className="absolute top-12 right-12 w-[56px] h-[56px] bg-pink-500 rounded-full"
            onPress={handleBack}>
            <Image
              source={require('images/Back.png')}
              className="mx-auto my-auto"
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
