import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {useForm, Controller} from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen({navigation}: {navigation: any}) {
  const {control, handleSubmit, formState} = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // 여기에서 로그인 로직을 구현합니다.
    console.log(data);
    navigation.navigate('Home');
    // 예를 들어, 서버로 로그인 정보를 전송할 수 있습니다.
    // axios 또는 fetch 등을 사용하여 API 요청을 보낼 수 있습니다.
  };

  return (
    <View className="flex justify-center w-full h-full p-4">
      <Text className="text-2xl">로그인</Text>
      <View className="mt-4 mb-2">
        <Controller
          name="email"
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              className="border-2 border-gray-400"
              placeholder="Email"
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
