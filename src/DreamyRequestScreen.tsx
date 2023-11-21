// 3-1. 하영드리미 인증 요청 페이지
// DreamyRequestScreen.tsx

import React from 'react';
import {View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import {useForm, Controller} from 'react-hook-form';

export default function DreamyRequestScreen({navigation}: {navigation: any}) {
    const {control, handleSubmit, formState} = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
            console.log('로그인 완료. 하영드리미 인증 요청 페이지로 이동합니다.');
            navigation.navigate('Dreamy');
    };

    // 이미지 크기를 위한 styleSheet
    const styles = StyleSheet.create({
        CatImage:{
        width:46,
        height:35,
        },
    });

    return(
        <View className='flex w-full h-full relative bg-white-gray'>
            <Image
                className="fixed left-[33px] top-[95px]"
                style={styles.CatImage}
                source={require('images/Cat.png')}
            />
            <View className='ml-[29px] mr-[29px]'>
                <Text
                    style={{fontFamily: 'EmblemaOne-Regular',}} 
                    className="absolute mt-[140px] text-orange-400 text-[32px]">Campus Connect</Text>
                <Text
                    style={{fontFamily: 'GowunDodum-Regular',}} 
                    className='absolute pt-[262px] text-brown text-[32px]'>하영드리미 인증</Text>
                <View className='mt-[313px]'>
                    <Text
                        style={{fontFamily: 'GowunDodum-Regular',}} 
                        className='text-gray text-ssm'>보다 안전한 서비스 이용을 위해 본인인증을 진행해 주세요.</Text>
                    <Text 
                        style={{fontFamily: 'GowunDodum-Regular',}}
                        className='text-gray text-ssm'>인증하기 버튼을 누르면</Text>
                    <Text
                        style={{fontFamily: 'GowunDodum-Regular',}} 
                        className='text-gray text-ssm'>하영드리미 로그인 화면으로 전환됩니다.</Text>
                </View>
            </View>

            <View className='flex w-full h-full absolute justify-end mb-0'>
                <TouchableOpacity
                    className='w-full w-full justify-end h-[65px] bg-pink-500'
                    onPress={handleSubmit(onSubmit)}>
                    <Text className='mx-auto my-auto text-sm text-white'>인증하기</Text>
                </TouchableOpacity>
            </View>
            {/* 배경 로고들 */}
            
        </View>
    )
}