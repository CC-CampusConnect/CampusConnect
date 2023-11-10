// SignInScreen.tsx

import React from 'react';
import {View, Text, TextInput, TouchableOpacity , Button, Image, StyleSheet} from 'react-native';
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
      console.log('로그인이 완료되었습니다.');
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

  // 스타일
  const styles = StyleSheet.create({
    background:{
      backgroundColor: "#F8F8F8",
    },
    buttonStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 327,
      height: 57,
      backgroundColor:'#FF8967',
    },
    buttonText: {
      fontSize: 26,
      color: 'white',
      fontFamily: "Nunito-Italic-VariableFont_wght",
      // textAlign: 'center', 
    },

    buttonSignUp: {
      alignContent: 'center',
      justifyContent: 'center',
      width: 327,
      height: 57,
      color: 'black',
    },

    text: {
      fontSize: 32,
      color: "#FF9730",
      
    },
    LogoImage:{
      width: 270,
      height: 334,
    },
    FormInput:{
      width: 327,
      height: 40,
      color:"#FFFFFF",
    },
    FormInputText:{
      fontSize: 16,
      color: "#A6A6A6",
      fontFamily: "Nunito-Italic-VariableFont_wght",
    },
    SignUp:{
      fontSize: 14,
      fontFamily: "Nunito-Italic-VariableFont_wght",
      color:"black",
    },
  });

  return (
    <View className='flex w-full h-full bg-white-gray'>
      <View className='w-full'>
        <Image 
          className='mx-auto mt-[91px]'
          style={styles.LogoImage}
          source={require('images/CCLogo.png')} />
      </View>
      <Text className='justify-center font-sans text-xxl text-orange-600'>로그인</Text>
      <View className='bg-pink-500 '>
        <Controller
          name="id"
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className='mx-auto bg-white border-2 w-[327px]'
              placeholder="  아이디"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          rules={{required: true}}
        />
      </View>
      <View className='bg-orange-600'>
        <Controller
          name="password"
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className='mx-auto bg-white border-2 w-[327px]'
              placeholder="  비밀번호"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              secureTextEntry
            />
          )}
          rules={{required: true}}
        />
      </View>

        <Button title="로그인 하기" onPress={handleSubmit(onSubmit)} />

      {/*<Text className="ml-20" style={styles.SignUp}>가입하기</Text> */}
    </View>
  );
}
