import React, {useEffect, useRef} from 'react';
import {View, Text, Button} from 'react-native';
import {Camera} from 'react-native-deepar';
import DeepAR, {IDeepARHandle} from 'react-native-deepar';

export default function DeeparScreen({navigation}: {navigation: any}) {
  const deepARRef = useRef<IDeepARHandle>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      const microphonePermission = await Camera.getMicrophonePermissionStatus();

      if (cameraPermission === 'not-determined') {
        await Camera.requestCameraPermission();
      }
      if (microphonePermission === 'not-determined') {
        await Camera.requestMicrophonePermission();
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <View className="flex w-20 h-20">
        <Button
          title="Switch Effect"
          onPress={() => {
            deepARRef?.current?.switchEffect({mask: 'Vendetta', slot: 'mask'});
          }}
        />
      </View>
      <DeepAR
        ref={deepARRef}
        apiKey="7ee374d76fb9e39fcc7e2fb2f5e139de294db2f3dce41ec076d4889099d54c979b749b9811d69024"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{flex: 1}}
        onInitialized={() => {
          // ..
        }}
      />
    </>
  );
}
