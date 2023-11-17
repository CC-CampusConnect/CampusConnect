// 4. 메인페이지
// MainPageScreen.tsx

import React from 'react';
import {View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import auth from '@react-native-firebase/auth';

export default function MainPageScreen({navigation}: {navigation: any}) {
    const {control, handleSubmit, formState} = useForm<FormData>();

    // 매칭 시작 버튼 누르면 Deepar로 이동
    const onSubmit = async (data: FormData) => {
        console.log('화상 통화 시작.');
        navigation.navigate('Deepar');

    };

    // 로그아웃 버튼
    const logout = async () => {
        try {
            await auth().signOut();
            console.log('로그아웃 되었습니다. 로그인 페이지로 이동합니다.');
            navigation.navigate('SignIn');
            
        } catch (error: any) {
            console.log(error);
        }
    };

    // 카카오톡 계정 입력
    const snsKakao = async () => {
        console.log('카카오톡 계정을 입력해 주세요');
    };

    // 인스타 계정 입력
    const snsInsta = async () => {
        console.log('인스타 계정을 입력해 주세요');
    };


    // 이미지 크기를 위한 styleSheet
    const styles = StyleSheet.create({
        LogoImage:{
        width: 270,
        height: 334,
        },

        snsImage:{
            width: 35,
            height: 35,
        },
    });

    return(
        <View className='flex w-full h-full relative bg-white-gray'>
            <TouchableOpacity
                className='absolute top-0 right-5'
                onPress={logout}>
                <Text className='mx-auto mt-[16px] mb-[144px] text-xs text-black underline'>로그아웃</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className='absolute top-5 ml-[20px]'
                onPress={snsKakao}>
                <Image 
                    style={styles.snsImage}
                    source={require('images/kakao.png')}/>
            </TouchableOpacity>

            <TouchableOpacity 
                className='absolute top-5 ml-[70px]'
                onPress={snsInsta}>
                <Image 
                    style={styles.snsImage}
                    source={require('images/insta.png')}/>
            </TouchableOpacity>

            <Image 
                className='mx-auto mt-[91px]'
                style={styles.LogoImage}
                source={require('images/CCLogo.png')}/>
            
            <TouchableOpacity
                className='mx-auto mt-[160px] w-[217px] h-[217px] bg-pink-500 rounded-full shadow'
                onPress={handleSubmit(onSubmit)}>
                <Text className='mx-auto mt-auto font-sans text-xxl text-white'>매칭</Text>
                <Text className='mx-auto mb-auto font-sans text-xxl text-white'>시작</Text>
            </TouchableOpacity>
        </View>
    )
}