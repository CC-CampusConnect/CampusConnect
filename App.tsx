import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DreamyScreen from './src/DreamyScreen';
import HomeScreen from './src/HomeScreen';
import SignUpScreen from './src/SignUpScreen';
import SignInScreen from './src/SignInScreen';
import DeeparScreen from './src/DeeparScreen';
import SignUpCompleteScreen from './src/SignUpCompleteScreen';
import DreamyCompleteScreen from './src/DreamyCompleteScreen';

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
        <Stack.Screen name="SignUpComplete" component={SignUpCompleteScreen} />
        <Stack.Screen name="DreamyComplete" component={DreamyCompleteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
