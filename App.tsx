import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import LoginScreen from './src/LoginScreen';
import DreamyScreen from './src/DreamyScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="Dreamy" component={DreamyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
