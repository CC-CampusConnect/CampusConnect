import React, {useRef} from 'react';
import {View, Text} from 'react-native';
import WebView from 'react-native-webview';

export default function DreamyScreen({navigation}: {navigation: any}) {
  const [isLogin, setIsLogin] = React.useState(false);
  const webview = useRef<WebView>(null);

  const validURLs = [
    'https://dreamy.jejunu.ac.kr/frame/sysUserPwd.do?changepw=y',
    'https://dreamy.jejunu.ac.kr/frame/main.do',
  ];
  const InfoURL = 'https://dreamy.jejunu.ac.kr/hjju/hj/sta_hj_1010q.jejunu';

  return (
    <View className="flex-1">
      {isLogin ? (
        <View className="flex w-full h-full bg-red-300">
          <Text className="text-2xl">This is a Loading Screen</Text>
        </View>
      ) : null}
      <WebView
        ref={webview}
        source={{uri: 'https://dreamy.jejunu.ac.kr/frame/index.do'}}
        injectedJavaScript={
          "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); const scrollContainer = document.documentElement; const currentScrollLeft = scrollContainer.scrollLeft; const viewportWidth = window.innerWidth; const desiredScrollLeft = (scrollContainer.scrollWidth - viewportWidth) / 8; scrollContainer.scrollLeft = desiredScrollLeft;"
        }
        onNavigationStateChange={navState => {
          if (validURLs.includes(navState.url)) {
            setIsLogin(true);
            webview.current?.injectJavaScript(
              'window.location.href = "https://dreamy.jejunu.ac.kr/hjju/hj/sta_hj_1010q.jejunu";',
            );
          }
          if (navState.url === InfoURL) {
            webview.current?.injectJavaScript(
              'window.ReactNativeWebView.postMessage(JSON.stringify({member_no:document.getElementById("member_no").value,"user_dept_nm":document.getElementById("user_dept_nm").value}));',
            );
          }
        }}
        onMessage={event => {
          if (event.nativeEvent.data) {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.member_no && data.user_dept_nm) {
              console.log(data.member_no);
              console.log(data.user_dept_nm);
            }
          }
        }}
      />
    </View>
  );
}
