// 2-2. 회원가입 완료 페이지
// SignUpCompleteScreen.tsx

import React from 'react';
import {View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import {useForm, Controller} from 'react-hook-form';

export default function SignUpCompleteScreen({navigation}: {navigation: any}) {
    const {control, handleSubmit, formState} = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        console.log('회원가입 완료. 로그인 페이지로 이동합니다.');
        navigation.navigate('SignIn');
    };

    return(
        <View className='flex w-full h-full relative bg-white-gray'>
            <View className='ml-[29px]'>
                <Text className="absolute mt-[140px] text-orange-400 text-[32px] font-EmblemaOne">Campus Connect</Text>
                <Text className='absolute pt-[262px] text-brown text-[32px] font-EmblemaOne'>회원가입 완료!</Text>
                <View className='mt-[313px]'>
                    <Text className='text-gray text-ssm'>CC회원이 되신 것을 환영해요.</Text>
                    <Text className='text-gray text-ssm'>다양한 학과 사람들을 만나보세요!</Text>
                    <Text className='text-gray text-ssm'>시작하기 버튼을 누르면 로그인 페이지로 이동합니다.</Text>
                </View>
            </View>

            <View className='flex w-full h-full absolute justify-end mb-0'>
                <TouchableOpacity
                    className='w-full w-full justify-end h-[65px] bg-pink-500'
                    onPress={handleSubmit(onSubmit)}>
                    <Text className='mx-auto my-auto font-sans text-sm text-white'>시작하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}