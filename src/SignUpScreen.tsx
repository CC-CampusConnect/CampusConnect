import React from 'react';
import {View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import {db} from './util/firestore';

type FormData = {
  id: string;
  password: string;
};

export default function SignUpScreen({navigation}: {navigation: any}) {
  const {control, handleSubmit, formState} = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!(await validateId(data))) {
      console.log('id를 확인해주세요.');
      return;
    }
    if (!(await validatePassword(data))) {
      console.log('password를 확인해주세요.');
      return;
    }
    if (await signup(data)) {
      console.log('회원가입이 완료되었습니다.');
      navigation.navigate('Home');
    } else {
      console.log('알 수 없는 오류로 회원가입에 실패하였습니다.');
    }
  };

  const validateId = async (data: FormData) => {
    // id는 영어 소문자, 숫자로만 구성되어야 합니다.
    // id는 5글자 이상이어야 합니다.
    const id = data.id;
    const regex = /^[a-z0-9]{5,}$/;
    return regex.test(id);
  };

  const validatePassword = async (data: FormData) => {
    // password는 영어 대문자, 소문자, 숫자, 특수문자로만 구성되어야 합니다.
    // password는 8글자 이상이어야 합니다.
    const password = data.password;
    const regex = /^[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const signup = async (data: FormData) => {
    const id = data.id + '@cc.com';
    const password = data.password;

    try {
      const userInfo = await auth().createUserWithEmailAndPassword(
        id,
        password,
      );
      await db.collection('Users').doc(userInfo.user?.uid).set({
        is_certified: false,
      });
      return true;
    } catch (error: any) {
      console.log(error);
      return false;
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
          회원가입
        </Text>
      </View>
  

      <View className='space-y-[18px] mt-[21px] mb-[48px]'>
        <View className="mt-4">
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
        <View>
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
        <View>
          <Controller
            name="password"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                className='mx-auto bg-white w-[327px] h-[40px]'
                placeholder="비밀번호 확인"
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
      <Text className='mx-auto mb-[14px]'>
        CC에 가입함으로써 이용약관과 개인보호정책에 수락합니다
      </Text>
      <TouchableOpacity
        className='mx-auto mb-[103px] w-[327px] h-[57px] bg-pink-500'
        onPress={handleSubmit(onSubmit)}>
          <Text className='mx-auto my-auto font-sans text-md text-white'>가입하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
