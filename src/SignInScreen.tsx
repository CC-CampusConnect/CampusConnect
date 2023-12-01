// SignInScreen.tsx
// 1. 로그인 페이지

import React, {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import {db} from './util/firestore';
import {useContext} from 'react';
import {UserContext} from './UserContext';
import {CommonActions} from '@react-navigation/native';

type FormData = {
  id: string;
  password: string;
};

export default function SignInScreen({navigation}: {navigation: any}) {
  const {control, handleSubmit, formState} = useForm<FormData>();
  const {setUid, uid, isCertified} = useContext(UserContext);

  useEffect(() => {
    const checkUserState = () => {
      // 자동 로그인되어 있고, 인증 하지 않은 사용자
      if (uid && !isCertified) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {name: 'Home'},
              {
                name: 'DreamyRequest',
              },
            ],
          }),
        );
        // 자동 로그인된 사용자
      } else if (uid) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {name: 'Home'},
              {
                name: 'MainPage',
              },
            ],
          }),
        );
        // 로그인 상태가 아닌 사용자
      } else {
        return;
      }
    };

    checkUserState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로그인 하기 버튼
  const onSubmit = async (data: FormData) => {
    if (await signIn(data)) {
      console.log('로그인이 완료되었습니다.');
    }
  };

  const signIn = async (data: FormData) => {
    const id = data.id + '@cc.com';
    const password = data.password;

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        id,
        password,
      );

      // 로그인 성공 시 uid를 context에 저장 (전역적으로 사용하기 위함)
      setUid(userCredential.user?.uid);
      console.log('uid 저장 완료', userCredential.user?.uid);

      // 인증 여부 확인
      const userDoc = await db
        .collection('Users')
        .doc(userCredential.user?.uid)
        .get();
      const userData = userDoc.data();

      if (userData && userData.is_certified) {
        console.log('인증 여부 확인', userData.is_certified);
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {name: 'Home'},
              {
                name: 'MainPage',
              },
            ],
          }),
        );
        return true;
      } else if (userData && !userData.is_certified) {
        console.log('인증 여부 확인', userData.is_certified);
        navigation.navigate('DreamyRequest');
        return true;
      } else {
        console.log('사용자 문서에서 인증 여부를 찾을 수 없습니다.');
        return false;
      }
    } catch (error: any) {
      console.log(error);
      return false;
    }
    // try {
    //   return await auth().signInWithEmailAndPassword(id, password);
    // } catch (error: any) {
    //   console.log(error);
    // }
  };

  // 가입하기 버튼
  const onSubmit2 = () => {
    console.log('회원가입 페이지로 이동합니다.');
    navigation.navigate('SignUp');
  };

  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    LogoImage: {
      width: 270,
      height: 334,
    },
  });

  return (
    <ScrollView className="flex w-full h-full bg-white-gray">
      <View className="w-full space-y-[50px]">
        <Image
          className="mx-auto mt-[91px]"
          style={styles.LogoImage}
          source={require('images/CCLogo.png')}
        />
        <Text
          style={{fontFamily: 'Nunito-ExtraBold'}}
          className="ml-[42px] text-xxl text-orange-600">
          로그인
        </Text>
      </View>

      <View className="space-y-[22px] mt-[21px] mb-[45px]">
        <View className="mt-4 mb-2">
          <Controller
            name="id"
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{fontFamily: 'Nunito-Regular'}}
                className="mx-auto text-black w-[327px] h-[40px]"
                placeholder="아이디"
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
                style={{fontFamily: 'Nunito-Regular'}}
                className="mx-auto text-black w-[327px] h-[40px]"
                placeholder="비밀번호"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                secureTextEntry
              />
            )}
            rules={{required: true}}
          />
        </View>
      </View>

      <TouchableOpacity
        className="mx-auto w-[327px] h-[57px] bg-pink-500"
        onPress={handleSubmit(onSubmit)}>
        <Text
          style={{fontFamily: 'Nunito-ExtraBold'}}
          className="mx-auto my-auto text-md text-white">
          로그인 하기
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSubmit2}>
        <Text
          style={{fontFamily: 'Nunito-ExtraBold'}}
          className="mx-auto mt-[16px] mb-[144px] text-xs text-black underline">
          가입하기!
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
