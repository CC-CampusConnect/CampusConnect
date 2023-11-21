// Checkbox.tsx

import { styled } from 'nativewind';
import React, {useCallback} from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  // style?: StyleProp<ViewStyle>;
}

const Checkbox: React.FC<CheckboxProps> = ({label, isChecked, onChange}) => {
  // 꼭 콜백함수로 작성해야할까?
  const handleCheckboxChange = useCallback(() => {
    onChange(!isChecked);
  }, [isChecked, onChange]);

  // 신고 체크박스 스타일
  return (
    <View>
      <BouncyCheckbox
        isChecked={isChecked}
        onPress={handleCheckboxChange}
        text={label}
        textStyle={{
          textDecorationLine: 'none',
          fontFamily: 'GowunDodum-Regular',
          fontSize: 20,
        }}
        className='mt-[10px] ml-[29px]'
      />
    </View>
  );
};

export default Checkbox;
