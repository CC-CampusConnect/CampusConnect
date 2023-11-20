import React, {useState} from 'react';
import {Text, Button, View, TextInput} from 'react-native';

export default function RoomScreen({navigation}: any) {
  const [roomId, setRoomId] = useState<string>('');

  const onCallOrJoin = (screen: string) => {
    if (roomId.length > 0) {
      navigation.navigate(screen, {roomId: roomId});
    }
  };

  return (
    <>
      <Text>Select a Room</Text>
      <TextInput
        className="w-full bg-red-300"
        value={roomId}
        onChangeText={setRoomId}
        placeholder="Room ID 입력"
      />
      <View>
        <Button
          title="Join Screen"
          onPress={() => onCallOrJoin('WebRTCJoin')}
        />
      </View>
      <View>
        <Button
          title="Call Screen"
          onPress={() => onCallOrJoin('WebRTCCall')}
        />
      </View>
    </>
  );
}
