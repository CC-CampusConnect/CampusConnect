import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DreamyScreen from './src/DreamyScreen';
import HomeScreen from './src/HomeScreen';
import SignUpScreen from './src/SignUpScreen';
import SignInScreen from './src/SignInScreen';
import DeeparScreen from './src/DeeparScreen';
import WebRTCCallScreen from './src/WebRTCCallScreen';
import WebRTCJoinScreen from './src/WebRTCJoinScreen';
import WebRTCRoomScreen from './src/WebRTCRoomScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Dreamy" component={DreamyScreen} />
        <Stack.Screen name="Deepar" component={DeeparScreen} />
        <Stack.Screen name="WebRTCCall" component={WebRTCCallScreen} />
        <Stack.Screen name="WebRTCJoin" component={WebRTCJoinScreen} />
        <Stack.Screen name="WebRTCRoom" component={WebRTCRoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
