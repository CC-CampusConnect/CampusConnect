import React from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
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
    // 예를 들어, 서버로 로그인 정보를 전송할 수 있습니다.
    // axios 또는 fetch 등을 사용하여 API 요청을 보낼 수 있습니다.
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Controller
        name="email"
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Email"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
        rules={{required: true}}
      />
      <Controller
        name="password"
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            placeholder="Password"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            secureTextEntry
          />
        )}
        rules={{required: true}}
      />
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
