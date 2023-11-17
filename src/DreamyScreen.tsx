import React, {useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import WebView from 'react-native-webview';
import auth from '@react-native-firebase/auth';
import {db} from './util/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export default function DreamyScreen({navigation}: {navigation: any}) {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCertified, setIsCertified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const webview = useRef<WebView>(null);

  const handleError = (error: any) => {
    setErrorText(error);
    setIsError(true);
  };

  const validURLs = [
    'https://dreamy.jejunu.ac.kr/frame/sysUserPwd.do?changepw=y',
    'https://dreamy.jejunu.ac.kr/frame/main.do',
  ];
  const InfoURL = 'https://dreamy.jejunu.ac.kr/frame/sysLeftmenu.do';

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const currentUser = await auth().currentUser;
      if (currentUser) {
        setIsLogin(true);
        setUser(currentUser);
      } else {
        console.log('유저 정보를 찾을 수 없습니다.');
        navigation.navigate('Home');
      }
    });
    return unsubscribe;
  }, [navigation]);

  

  return (
    <View className="flex-1">
      {isCertified ? (
        <View className="flex w-full h-full bg-blue-300">
          <Text className="text-2xl">Done!</Text>
        </View>
      ) : isLoading ? (
        <View className="flex w-full h-full bg-red-300">
          <Text className="text-2xl">This is a Loading Screen</Text>
        </View>
      ) : null}
      {isError ? (
        <View className="flex w-full h-full bg-red-300">
          <Text className="text-2xl">{errorText}</Text>
        </View>
      ) : (
        <WebView
          ref={webview}
          source={{uri: 'https://dreamy.jejunu.ac.kr/frame/index.do'}}
          
          injectedJavaScript={
            "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.8, maximum-scale=0.8, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); const scrollContainer = document.documentElement; const currentScrollLeft = scrollContainer.scrollLeft; const viewportWidth = window.innerWidth; const desiredScrollLeft = (scrollContainer.scrollWidth - viewportWidth) / 2; scrollContainer.scrollLeft = desiredScrollLeft;"
          }
          onError={handleError}
          onNavigationStateChange={navState => {
            if (navState.loading === false) {
              if (validURLs.includes(navState.url)) {
                setIsLoading(true);
                webview.current?.injectJavaScript(
                  'window.location.href = "https://dreamy.jejunu.ac.kr/frame/sysLeftmenu.do";',
                );
              }
              if (navState.url === InfoURL) {
                webview.current?.injectJavaScript(
                  'window.ReactNativeWebView.postMessage(document.getElementsByClassName("li-personal2")[0].innerText+document.getElementsByClassName("li-personal2")[1].innerText+document.getElementsByClassName("li-personal2")[2].innerText);',
                );
              }
            }
          }}
          onMessage={async event => {
            if (event.nativeEvent.data) {
              const regex = / \(\s*|\s*\)\s*|\s*\/\s*/;
              const result = event.nativeEvent.data.split(regex);

              // 이름, 학생 ID, 전공, 상태로 할당
              const name = result[0].trim();
              const studentID = result[1];
              const major = result[2].replace(/\s+/g, ' ');
              const status = result[3];

              setIsLoading(false);
              setIsCertified(true);

              console.log('이름: ' + name);
              console.log('학번: ' + studentID);
              console.log('전공: ' + major);
              console.log('상태: ' + status);

              try {
                if (user) {
                  await db.collection('Users').doc(user.uid).update({
                    name: name,
                    studentID: studentID,
                    major: major,
                    status: status,
                    is_certified: true,
                  });
                } else {
                  console.log('유저 정보를 찾을 수 없습니다.');
                  navigation.navigate('Home');
                }
                navigation.navigate('Home');
              } catch (error: any) {
                console.log(error);
              }
            }
          }}
        />
      )}
    </View>
  );
}
