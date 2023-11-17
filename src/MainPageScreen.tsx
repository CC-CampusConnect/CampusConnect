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
            console.log('로그아웃 되었습니다.');
            navigation.navigate('Home');
            
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

    return(
        <View className='flex w-full h-full relative bg-white-gray'>
            <Image 
                className='mx-auto mt-[91px]'
                style={styles.LogoImage}
                source={require('images/CCLogo.png')}/>

            <View className='flex w-full h-full absolute justify-end mb-0'>
                <TouchableOpacity
                    className='w-full w-full justify-end h-[65px] bg-pink-500'
                    onPress={handleSubmit(onSubmit)}>
                    <Text className='mx-auto my-auto font-sans text-sm text-white'>매칭 시작</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={logout}>
                <Text className='mx-auto mt-[16px] mb-[144px] text-xs text-black underline'>로그아웃</Text>
            </TouchableOpacity>
        </View>
    )
}