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
      <Pressable onPress={() => navigation.navigate('Home')}>
        <View className="w-full h-10 bg-blue-200">
          <Text>Home</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Dreamy')}>
        <View className="w-full h-10 bg-blue-300">
          <Text>Dreamy</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('SignUp')}>
        <View className="w-full h-10 bg-blue-400">
          <Text>SignUp</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('SignIn')}>
        <View className="w-full h-10 bg-blue-500">
          <Text>SignIn</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Deepar')}>
        <View className="w-full h-10 bg-blue-600">
          <Text>Deepar</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('WebRTCRoom')}>
        <View className="w-full h-10 bg-blue-700">
          <Text>WebRTCRoom</Text>
        </View>
      </Pressable>
      {/* <Pressable onPress={() => navigation.navigate('WebRTCCall')}>
        <View className="w-full h-10 bg-blue-800">
          <Text>WebRTCCall</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('WebRTCJoin')}>
        <View className="w-full h-10 bg-blue-900">
          <Text>WebRTCJoin</Text>
        </View>
      </Pressable> */}
      <View className="flex w-full h-full bg-red-300">
        {user ? (
          <View>
            <Text className="text-2xl text-center mt-56">
              안녕하세요 {user.email?.split('@')[0]}님
            </Text>
            <Button title="로그아웃" onPress={logout} />
          </View>
        ) : (
          <Text className="text-2xl text-center mt-56">로그인 해주세요</Text>
        )}
      </View>
    </View>
  );
}
