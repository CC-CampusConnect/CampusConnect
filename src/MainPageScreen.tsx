import React from 'react';
import {View, Text, TextInput, Button, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import {useForm, Controller} from 'react-hook-form';

export default function MainPageScreen({navigation}: {navigation: any}) {
    const {control, handleSubmit, formState} = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        if(await mainpage(data)){
            console.log('화상 통화 시작.');
            navigation.navigate('Deepar');
        }
    };

    const mainpage = async (data: FormData) => {
        return true;
    };

    return(
        <View className='flex w-full h-full relative bg-white-gray'>
            <View className='flex w-full h-full absolute justify-end mb-0'>
                <TouchableOpacity
                    className='w-full w-full justify-end h-[65px] bg-pink-500'
                    onPress={handleSubmit(onSubmit)}>
                    <Text className='mx-auto my-auto font-sans text-sm text-white'>매칭 시작</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}