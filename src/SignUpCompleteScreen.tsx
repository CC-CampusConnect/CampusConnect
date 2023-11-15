// SignUpCompleteScreen.tsx

import React from 'react';
import {View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import {useForm, Controller} from 'react-hook-form';

export default function SignUpCompleteScreen({navigation}: {navigation: any}) {
    const {control, handleSubmit, formState} = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        if(await signupcomplete(data)){
            console.log('회원가입 완료. 로그인 페이지로 이동합니다.');
            navigation.navigate('SignIn');
        }
    };

    const signupcomplete = async (data: FormData) => {
        return true;
    };

    return(
        <View>
            <TouchableOpacity
                className='mx-auto w-[327px] h-[57px] bg-pink-500'
                onPress={handleSubmit(onSubmit)}>
                <Text className='mx-auto my-auto font-sans text-md text-white'>시작하기</Text>
            </TouchableOpacity>
        </View>
    )
}