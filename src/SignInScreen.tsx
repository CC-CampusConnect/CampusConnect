import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';
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

  return (
    <View className="flex justify-center w-full h-full p-4">
      <Text className="text-2xl">로그인</Text>
      <View className="mt-4 mb-2">
        <Controller
          name="id"
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border-2 border-gray-400"
              placeholder="Id"
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
              className="border-2 border-gray-400"
              placeholder="Password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              secureTextEntry
            />
          )}
          rules={{required: true}}
        />
      </View>
      <Button title="로그인" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
