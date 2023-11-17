// DeeparScreen.tsx

import React, {useEffect, useRef, useState, useMemo} from 'react';
import {View, Text, Button, Platform} from 'react-native';
import {Camera} from 'react-native-deepar';
import DeepAR, {IDeepARHandle} from 'react-native-deepar';
import Effects from './constants/Effects';

export default function DeeparScreen({navigation}: {navigation: any}) {
  const [isStatsEnabled, setIsStatsEnabled] = useState(false);
  const deepARRef = useRef<IDeepARHandle>(null);
  const [currEffectIndex, setCurrEffectIndex] = useState(0);

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

  const changeEffect = (direction: number) => {
    if (!deepARRef) {
      return;
    }

    let newIndex = direction > 0 ? currEffectIndex + 1 : currEffectIndex - 1;

    if (newIndex >= Effects.length) {
      newIndex = 0;
    }

    if (newIndex < 0) {
      newIndex = Effects.length - 1;
    }

    const newEffect = Effects[newIndex];

    if (newEffect?.platforms.includes(Platform.OS)) {
      deepARRef?.current?.switchEffect({
        mask: newEffect?.name as string,
        slot: 'effect',
      });
    } else {
      deepARRef?.current?.switchEffect({
        mask: Effects[0]?.name as string,
        slot: 'effect',
      });
    }

    setCurrEffectIndex(newIndex);
  };

  return (
    <>
      <View className="flex flex-col w-full">
        <View className="flex w-full h-8">
          <Button
            title="Show Stats"
            onPress={() => {
              setIsStatsEnabled(!isStatsEnabled);
              deepARRef?.current?.showStats(!isStatsEnabled);
            }}
          />
        </View>
        <View className="flex w-full h-8">
          <Button
            title="Clear All Effects"
            onPress={() => {
              setCurrEffectIndex(0);
              deepARRef?.current?.switchEffect({
                mask: Effects[0]?.name as string,
                slot: 'effect',
              });
              deepARRef?.current?.switchEffect({
                mask: Effects[0]?.name as string,
                slot: 'mask',
              });
            }}
          />
        </View>
        <View className="flex w-full h-8">
          <Button
            title="Next Effect"
            onPress={() => {
              changeEffect(1);
            }}
          />
        </View>
        <View className="flex w-full h-8">
          <Button
            title="Previous Effect"
            onPress={() => {
              changeEffect(-1);
            }}
          />
        </View>
        <Text className="text-lg bg-red-200 text-center">
          Current Effect : {Effects[currEffectIndex]?.title}
        </Text>
      </View>
      <DeepAR
        ref={deepARRef}
        apiKey="7ee374d76fb9e39fcc7e2fb2f5e139de294db2f3dce41ec076d4889099d54c979b749b9811d69024"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{flex: 1}}
        // onInitialized={() => {
        //   deepARRef?.current?.switchEffect({
        //     mask: 'Vendetta_Mask',
        //     slot: 'mask',
        //   });
        // }}
      />
    </>
  );
}
