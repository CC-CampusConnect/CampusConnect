// 개발자 홈
// HomeScreen.tsx

import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export default function HomeScreen({navigation}: {navigation: any}) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null);

  const logout = async () => {
    try {
      await auth().signOut();
    } catch (error: any) {
      console.log(error);
    }
  };

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (initializing) {
    return null;
  }

  return (
    <View className="flex">
      <Pressable onPress={() => navigation.navigate('SignIn')}>
        <View className="w-full h-10 bg-pink-500">
          <Text>CC APP</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Deepar')}>
        <View className="w-full h-10 bg-orange-600">
          <Text>Deepar</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('WebRTCRoom')}>
        <View className="w-full h-10 bg-orange-500">
          <Text>WebRTCRoom</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('SignUpComplete')}>
        <View className="w-full h-10 bg-orange-500">
          <Text>SignUpComplete</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Loading')}>
        <View className="w-full h-10 bg-orange-500">
          <Text>Loading</Text>
        </View>
      </Pressable>
      <View className="flex w-full h-full">
        {user ? (
          <View>
            <Text className="text-2xl text-center">
              안녕하세요 {user.email?.split('@')[0]}님
            </Text>
            <Button title="로그아웃" onPress={logout} />
          </View>
        ) : (
          <Text className="text-2xl text-center">로그인 해주세요</Text>
        )}
      </View>
    </View>
  );
}
