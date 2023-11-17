// Checkbox.tsx

import React, {useCallback} from 'react';
import {View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({label, isChecked, onChange}) => {
  // 꼭 콜백함수로 작성해야할까?
  const handleCheckboxChange = useCallback(() => {
    onChange(!isChecked);
  }, [isChecked, onChange]);

  return (
    <View>
      <BouncyCheckbox
        isChecked={isChecked}
        onPress={handleCheckboxChange}
        text={label}
        textStyle={{
          textDecorationLine: 'none',
        }}
      />
    </View>
  );
};

export default Checkbox;
