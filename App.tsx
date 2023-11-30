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
import MainPageScreen from './src/MainPageScreen';
import DreamyRequestScreen from './src/DreamyRequestScreen';
import WebRTCCallScreen from './src/WebRTCCallScreen';
import WebRTCJoinScreen from './src/WebRTCJoinScreen';
import WebRTCRoomScreen from './src/WebRTCRoomScreen';
import CallEndScreen from './src/CallEndScreen';
import {UserProvider} from './src/UserContext';
import Modaltest from './src/ModalTest';
import WaitConnectScreen from './src/WaitConnectScreen';
import ConnectFailScreen from './src/ConnectFailScreen';
import ConnectSuccessScreen from './src/ConnectSuccessScreen';
import RandomMatch from './src/RandomMatch';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Dreamy" component={DreamyScreen} />
          <Stack.Screen name="Deepar" component={DeeparScreen} />

          <Stack.Screen
            name="SignUpComplete"
            component={SignUpCompleteScreen}
          />
          <Stack.Screen
            name="DreamyComplete"
            component={DreamyCompleteScreen}
          />
          <Stack.Screen name="MainPage" component={MainPageScreen} />
          <Stack.Screen name="DreamyRequest" component={DreamyRequestScreen} />
          <Stack.Screen name="WebRTCCall" component={WebRTCCallScreen} />
          <Stack.Screen name="WebRTCJoin" component={WebRTCJoinScreen} />
          <Stack.Screen name="WebRTCRoom" component={WebRTCRoomScreen} />
          <Stack.Screen name="CallEndScreen" component={CallEndScreen} />
          <Stack.Screen name="ModalTest" component={Modaltest} />
          <Stack.Screen name="WaitConnect" component={WaitConnectScreen} />
          <Stack.Screen name="ConnectFail" component={ConnectFailScreen} />
          <Stack.Screen
            name="ConnectSuccess"
            component={ConnectSuccessScreen}
          />
          <Stack.Screen name="RandomMatch" component={RandomMatch} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
