import React, {useRef} from 'react';
import {set} from 'react-hook-form';
import {View, Text} from 'react-native';
import WebView from 'react-native-webview';

export default function DreamyScreen({navigation}: {navigation: any}) {
  const [isLogin, setIsLogin] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState({}); // [name, studentID, major, status
  const webview = useRef<WebView>(null);

  const validURLs = [
    'https://dreamy.jejunu.ac.kr/frame/sysUserPwd.do?changepw=y',
    'https://dreamy.jejunu.ac.kr/frame/main.do',
  ];
  const InfoURL = 'https://dreamy.jejunu.ac.kr/frame/sysLeftmenu.do';

  return (
    <View className="flex-1">
      {isLogin ? (
        isLoading ? (
          <View className="flex w-full h-full bg-red-300">
            <Text className="text-2xl">This is a Loading Screen</Text>
          </View>
        ) : (
          <View className="flex w-full h-full bg-blue-300">
            {Object.values(data).map((item: any, index: any) => (
              <Text key={index} className="text-2xl">
                {item}
              </Text>
            ))}
          </View>
        )
      ) : null}
      <WebView
        ref={webview}
        source={{uri: 'https://dreamy.jejunu.ac.kr/frame/index.do'}}
        injectedJavaScript={
          "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); const scrollContainer = document.documentElement; const currentScrollLeft = scrollContainer.scrollLeft; const viewportWidth = window.innerWidth; const desiredScrollLeft = (scrollContainer.scrollWidth - viewportWidth) / 8; scrollContainer.scrollLeft = desiredScrollLeft;"
        }
        onNavigationStateChange={navState => {
          if (navState.loading === false) {
            if (validURLs.includes(navState.url)) {
              setIsLogin(true);
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
        onMessage={event => {
          if (event.nativeEvent.data) {
            const parts = event.nativeEvent.data?.split(/\s+/);

            const name = parts[1];
            const studentID = parts[3].replace(/\(|\)/g, ''); // 괄호 제거
            const major = parts[5];
            const status = parts[8];

            setData({
              name,
              studentID,
              major,
              status,
            });
            setIsLoading(false);

            console.log('이름: ' + name);
            console.log('학번: ' + studentID);
            console.log('전공: ' + major);
            console.log('상태: ' + status);
          }
        }}
      />
    </View>
  );
}
