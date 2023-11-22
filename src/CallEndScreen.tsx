// CallEndScreen.tsx
// 9-1 통화 종료 페이지 & 10-1 신고 모달창

import React, {useState} from 'react';
import {View, Button, TextInput, Modal, Alert, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import Checkbox from './Checkbox';
import {db} from './util/firestore';

export default function CallEndScreen({navigation}: {navigation: any}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // 선택된 옵션
  const [text, setText] = useState<string>(''); // 기타 사유
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태
  

  // 체크박스 선택 시 호출되는 함수
  const handleCheckboxChange = (option: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedOptions(prevOptions => [...prevOptions, option]);
    } else {
      setSelectedOptions(prevOptions =>
        prevOptions.filter(selectedOption => selectedOption !== option),
      );
    }
  };

  // 신고하기 버튼 클릭 시 호출되는 함수
  const handleReport = async () => {
    try {
      await db.collection('reports').add({
        profanity: selectedOptions.includes('욕설/인신공격'),
        illegal: selectedOptions.includes('불법 활동 유도'),
        sexual: selectedOptions.includes('음란/선정성'),
        threat: selectedOptions.includes('위협/협박'),
        etc: selectedOptions.includes('기타'),
        etcText: text,
      });
      Alert.alert('신고가 정상적으로 처리되었습니다.');
      setModalVisible(false);
    } catch (error) {
      console.error('신고 처리 오류 발생', error);
    }
  };

  // 신고 옵션 목록
  const options = [
    '욕설/인신공격',
    '불법 활동 유도',
    '음란/선정성',
    '위협/협박',
    '기타',
  ];

  // 이미지 크기를 위한 styleSheet
  const styles = StyleSheet.create({
    sirenImage: {
      width: 40,
      height: 34,
    },

    CCDogImage: {
      width:161,
      height:145,
    },

  });

  //  className='mx-auto my-auto w-[391px] h-[461px] bg-pink-500' <- 모달 클래스

  return (
    <View className='flex w-full h-full bg-backCat relative bg-white-gray '>

      
  
      
      {/* 배경 이미지 */}
      <View className="w-[346px] h-[767px] left-[33px] top-[30px] absolute">
        <Image className="w-[46px] h-[35px] left-0 top-0 absolute" source={require('images/Cat.png')} />
        <Image className="w-[46px] h-[35px] left-[6px] top-[402px] absolute" source={require('images/Cat.png')} />
        <Image className="w-[46px] h-[35px] left-[6px] top-[692px] absolute" source={require('images/Cat.png')} />

        <Image className="w-16 h-9 left-[155px] top-[191px] absolute" source={require('images/Rabbit.png')} />
        <Image className="w-16 h-9 left-[155px] top-[582px] absolute" source={require('images/Rabbit.png')} />
        
        <Image className="w-[53px] h-[35px] left-[293px] top-[69px] absolute" source={require('images/Dog.png')} />
        <Image className="w-[53px] h-[35px] left-[293px] top-[470px] absolute" source={require('images/Dog.png')} />
        <Image className="w-[53px] h-[35px] left-[293px] top-[732px] absolute" source={require('images/Dog.png')} />
      </View>

      {/* 신고 모달 */}
      <View>
        <Modal
          visible={modalVisible}
          // 안드로이드의 뒤로가기 버튼 클릭 시 모달 비활성화
          onRequestClose={() => {setModalVisible(!modalVisible);}}
          animationType="slide"
        >
          {/* 배경 이미지 */}
          <View className="w-[346px] h-[767px] left-[33px] top-[30px] absolute">
            <Image className="w-[46px] h-[35px] left-0 top-0 absolute" source={require('images/Cat.png')} />
            <Image className="w-[46px] h-[35px] left-[6px] top-[402px] absolute" source={require('images/Cat.png')} />
            <Image className="w-[46px] h-[35px] left-[6px] top-[692px] absolute" source={require('images/Cat.png')} />

            <Image className="w-16 h-9 left-[155px] top-[191px] absolute" source={require('images/Rabbit.png')} />
            <Image className="w-16 h-9 left-[155px] top-[582px] absolute" source={require('images/Rabbit.png')} />
            
            <Image className="w-[53px] h-[35px] left-[293px] top-[69px] absolute" source={require('images/Dog.png')} />
            <Image className="w-[53px] h-[35px] left-[293px] top-[470px] absolute" source={require('images/Dog.png')} />
            <Image className="w-[53px] h-[35px] left-[293px] top-[732px] absolute" source={require('images/Dog.png')} />
          </View>

          <View className='top-[178px] mx-auto w-[391px] h-[499px] bg-white border'>
            <Text 
              style={{fontFamily: 'GowunDodum-Regular'}}
              className='mx-auto text-[26px] mt-[22px] mb-[15px] ml-[29px] text-brown'>
                신고 사유
            </Text>
            
            {options.map(option => (
              <Checkbox
                key={option}
                label={option}
                isChecked={selectedOptions.includes(option)}
                onChange={isChecked => handleCheckboxChange(option, isChecked)} // onChange props에 콜백 함수 전달
            
              />
            ))}
            <TextInput
              className="w-[330px] h-[147px] ml-[30px] mt-[27px] border border-solid-100 bg-white-gray"
              value={text}
              onChangeText={t => {
                setText(t);
              }}
              placeholder="기타 사유를 입력해주세요."
            />
            <View className='flex flex-row mx-auto mt-[20px] space-x-24'>
              <TouchableOpacity onPress={handleReport}>
                <Text 
                  className="mx-auto text-[16px] text-black underline"
                  style={{fontFamily: 'GowunDodum-Regular'}}>
                    신고하기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text 
                  className="mx-auto text-[16px] text-black underline"
                  style={{fontFamily: 'GowunDodum-Regular'}}>
                  취소
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <View className='flex w-full h-full'>
        <Text
          className='text-[32px] text-brown mx-auto top-[450px]' 
          style={{fontFamily: 'GowunDodum-Regular'}}>
            통화가 종료됐어요!
        </Text>
        <Image
          className="mx-auto top-[260px]"
          style={styles.CCDogImage}
          source={require('images/CCDog.png')}
        />  
      </View>
      
      <View className="flex w-full h-full absolute justify-end mb-0">
        <TouchableOpacity
          className="w-full w-full justify-end h-[65px] bg-pink-500"
          onPress={() => navigation.navigate('MainPage')}>
          <Text className="mx-auto my-auto text-sm text-white">
            종료
          </Text>
        </TouchableOpacity>
      </View>
      {/* 신고하기 버튼 클릭 시 모달 활성화 */}
      <TouchableOpacity
        className="absolute top-[26px] right-[26px] w-[56px] h-[56px] bg-pink-500 rounded-full"
        onPress={() => setModalVisible(true)}>
          <Image style={styles.sirenImage} source={require('images/siren.png')} className='mx-auto my-auto'/>
      </TouchableOpacity>
    </View>
  );
}
