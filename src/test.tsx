import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';



export default function CallScreen({navigation, route}: any) {
    const [endModalVisible, setEndModalVisible] = useState(false); // 통화 종료 모달 상태
    const [infoModalVisible, setInfoModalVisible] = useState(false); // 모달 상태

    
  const handleEndCall = () => {
    setEndModalVisible(false);
  };

    // 이미지 크기 & 모달창을 위한 styleSheet
  const styles = StyleSheet.create({
    AddSnsImage: {
      width: 37,
      height: 41,
    },
    StopCallImage: {
      width: 45,
      height: 45,
    },
    InfoImage: {
      width: 35,
      height: 35,
    },
    AddTimeImage: {
      width: 35,
      height: 35,
    },
    MuteImage: {
      width: 30,
      height: 32,
    },
    // 모달창 투명배경을 만들기 위한
    modalView: {
      // backgroundColor: 'rgba(255, 255, 255, 0.9)',
      // borderRadius: 20,
      padding: 35,
    },
  });
    
    return(
        <View className='w-full h-full bg-slate-400'>
            {/* 타이머 & start call & switchCamera & toggleMute*/}
            <View className="h-[50px] bg-green-600">
                <Text>타이머</Text>
            </View>

            {/* 정보 확인 모달 */}
          <Modal
            visible={infoModalVisible}
            onRequestClose={() => {
              setInfoModalVisible(!infoModalVisible);
            }}
            animationType="fade"
            transparent={true}
        >
            <View className="w-[391px] h-[195px] mt-5 mx-auto bg-purple-300"
                style={styles.modalView}>
                <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                  <Text className="mx-auto mt-5 text-[16px] text-black underline">
                    취소
                  </Text>
                </TouchableOpacity>
            </View>
          </Modal>

            {/* 통화 화면 */}
            <View className='flex-auto p-4 bg-pink-500'>
                <View className="flex-auto space-y-4 bg-red">  
                    <Text className='flex-auto bg-white'>콜리</Text>
                    <Text className='flex-auto bg-white'>콜러</Text>
                </View>
            </View>

            {/* 버튼들 */}
            <View className="h-[110px] bg-green-200">
                {/* 정보 확인 버튼 */}
                <TouchableOpacity
                className="w-14 h-14 my-auto bg-white rounded-full"
                onPress={() => setInfoModalVisible(true)}>
                   
                </TouchableOpacity>
            </View>
        </View>
    );

}