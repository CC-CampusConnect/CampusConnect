// Report.tsx

import React, {useState} from 'react';
import {View, Button} from 'react-native';
import Checkbox from './Checkbox';

const Report: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (option: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedOptions(prevOptions => [...prevOptions, option]);
    } else {
      setSelectedOptions(prevOptions =>
        prevOptions.filter(selectedOption => selectedOption !== option),
      );
    }
  };

  const options = [
    '욕설/인신공격',
    '불법 활동 유도',
    '음란/선정성',
    '위협/협박',
    '기타',
  ];

  return (
    <>
      <View>
        {options.map(option => (
          <Checkbox
            key={option}
            label={option}
            isChecked={selectedOptions.includes(option)}
            onChange={isChecked => handleCheckboxChange(option, isChecked)} // onChange props에 콜백 함수 전달
          />
        ))}
        <Button
          title="Print Selected Options"
          onPress={() => console.log('Selected Options:', selectedOptions)}
        />
      </View>
    </>
  );
};

export default Report;
