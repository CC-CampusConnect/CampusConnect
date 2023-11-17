// 3-3. 인증 완료 페이지
// DreamyCompleteScreen.tsx

import React from 'react';
import {View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import {useForm, Controller} from 'react-hook-form';

export default function DreamyCompleteScreen({navigation}: {navigation: any}) {
    const {control, handleSubmit, formState} = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        if(await dreamycomplete(data)){
            console.log('인증 완료. 메인 페이지로 이동');
            navigation.navigate('MainPage');
        }
    };

    const dreamycomplete = async (data: FormData) => {
        return true;
    };

    return(
        <View className='flex w-full h-full relative bg-white-gray'>
            <View className='ml-[29px]'>
                <Text className="absolute mt-[140px] text-orange-400 text-[32px] font-EmblemaOne">Campus Connect</Text>
                <Text className='absolute pt-[262px] text-brown text-[32px] font-EmblemaOne'>인증 완료!</Text>
                <View className='mt-[313px]'>
                    <Text className='text-gray text-ssm'>인증이 완료되었어요.</Text>
                    <Text className='text-gray text-ssm'>확인 버튼을 누르면 메인으로 이동합니다.</Text>
                </View>
            </View>

            <View className='flex w-full h-full absolute justify-end mb-0'>
                <TouchableOpacity
                    className='w-full w-full justify-end h-[65px] bg-pink-500'
                    onPress={handleSubmit(onSubmit)}>
                    <Text className='mx-auto my-auto font-sans text-sm text-white'>확인</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}