// SignInScreen.tsx

import React from 'react';
import {View, Text, TextInput, TouchableOpacity , Button, Image, StyleSheet, ScrollView} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import auth from '@react-native-firebase/auth';


type FormData = {
  id: string;
  password: string;
};

export default function SignInScreen({navigation}: {navigation: any}) {
  const {control, handleSubmit, formState} = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (await signIn(data)) {
      console.log('로그인이 완료되었습니다. 하영드리미 인증 페이지로 이동합니다.');
      navigation.navigate('Home');
    }
  };

  const signIn = async (data: FormData) => {
    const id = data.id + '@cc.com';
    const password = data.password;

    try {
      return await auth().signInWithEmailAndPassword(id, password);
    } catch (error: any) {
      console.log(error);
    }
  };

  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    LogoImage:{
      width: 270,
      height: 334,
    },
  });

  return (
    <ScrollView className='flex w-full h-full bg-white-gray'>
      <View className='w-full space-y-[50px]'>
        <Image 
          className='mx-auto mt-[91px]'
          style={styles.LogoImage}
          source={require('images/CCLogo.png')} />
        <Text className='ml-[42px] font-sans text-xxl text-orange-600'>
          로그인
        </Text>
      </View>
      
      <View className='space-y-[22px] mt-[21px] mb-[45px]'>
         <View className="mt-4 mb-2">
          <Controller
            name="id"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                className='mx-auto bg-white w-[327px] h-[40px]'
                placeholder="아이디"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
            rules={{required: true}}
          />
        </View>
        <View className="mb-5">
          <Controller
            name="password"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                className='mx-auto bg-white w-[327px] h-[40px]'
                placeholder="비밀번호"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                secureTextEntry
              />
            )}
            rules={{required: true}}
          />
        </View>
      </View>
      <TouchableOpacity
        className='mx-auto w-[327px] h-[57px] bg-pink-500'
        onPress={() => {handleSubmit(onSubmit)}}>
          <Text className='mx-auto my-auto font-sans text-md text-white'>로그인 하기</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text className='mx-auto mt-[16px] mb-[144px] text-xs text-black underline'>가입하기!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
