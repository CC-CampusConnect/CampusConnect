import React, {useState} from 'react';
import {View, Button, TextInput, Modal, Alert, TouchableOpacity, Text} from 'react-native';
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

  return (
    <>
      {/* 신고 모달 */}
      <View>
        <Modal
          visible={modalVisible}
          // 안드로이드의 뒤로가기 버튼 클릭 시 모달 비활성화
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          {options.map(option => (
            <Checkbox
              key={option}
              label={option}
              isChecked={selectedOptions.includes(option)}
              onChange={isChecked => handleCheckboxChange(option, isChecked)} // onChange props에 콜백 함수 전달
            />
          ))}
          <TextInput
            className="w-[330px] h-[147px] bg-white-gray"
            value={text}
            onChangeText={t => {
              setText(t);
            }}
            placeholder="기타 사유를 입력해주세요."
          />

          <TouchableOpacity onPress={handleReport}>
            <Text 
              className="mx-auto text-xs text-black underline"
              style={{fontFamily: 'GowunDodum-Regular'}}>
                신고하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text 
              className="mx-auto text-xs text-black underline"
              style={{fontFamily: 'GowunDodum-Regular'}}>
              취소
            </Text>
          </TouchableOpacity>
        </Modal>
      </View>
      {/* 신고하기 버튼 클릭 시 모달 활성화 */}
      <View>
        <Button title="신고하기" onPress={() => setModalVisible(true)} />
      </View>
      <View>
        <Button title="종료" onPress={() => navigation.navigate('MainPage')} />
      </View>
    </>
  );
}
