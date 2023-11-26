// Modaltest.tsx

import React, { useState } from 'react';
import {View, Modal, StyleSheet, Text, TouchableHighlight } from 'react-native';

export default function CallEndScreen({navigation, route}: any) {
  const [modalVisible, setModalVisible] =useState(false);

  const styles = StyleSheet.create({
    // 모달창 투명배경을 만들기 위한
    modalView: {
      margin: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      // borderRadius: 20,
      padding: 35,
    },
    openButton: {
      backgroundColor: '#f194ff',
      borderRadius: 20,
      padding: 10,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    })

  return (
    <View>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
      >
        <View className='flex flex-1 justify-center items-center mt-22'>
          <View style={styles.modalView}>
            <Text className='mb-[15px] text-[20px] text-brown' style={{fontFamily: 'GowunDodum-Regular'}}>
                전공
            </Text>
            <TouchableHighlight
              //styles.openButton을 복사한뒤 새로운 값 backgroundColor 추가
              style={{ ...styles.openButton, backgroundColor: '#2196F3'}}
              onPress={()=>{
                setModalVisible(!modalVisible)
              }}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      
      <TouchableHighlight 
        style={styles.openButton}
        onPress={()=> {
          setModalVisible(true)
        }}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </TouchableHighlight>
    </View>
  );
}
