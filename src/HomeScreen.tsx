import React from 'react';
import {View, Text, Pressable} from 'react-native';

export default function HomeScreen({navigation}: {navigation: any}) {
  return (
    <View className="flex">
      <Pressable onPress={() => navigation.navigate('Home')}>
        <View className="w-full h-10 bg-blue-200">
          <Text>Home</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Dreamy')}>
        <View className="w-full h-10 bg-blue-400">
          <Text>Dreamy</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <View className="w-full h-10 bg-blue-600">
          <Text>Login</Text>
        </View>
      </Pressable>
      <View className="flex w-full h-full bg-red-300">
        <Text className="text-2xl">This is a Home Screen</Text>
      </View>
    </View>
  );
}
