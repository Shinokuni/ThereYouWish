import React from 'react';
import {TextInput, useTheme} from 'react-native-paper';
import style from './style';

type TYWTextInputProps = {
  value: string | undefined;
  onChangeText: (text: string) => void;
  placeholder: string;
  moreStyle?: any; // must be only StyleProp<TextStyle>
};

const TYWTextInput = ({
  value,
  onChangeText,
  placeholder,
  moreStyle,
}: TYWTextInputProps) => {
  const theme = useTheme();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[style.textInput, {...moreStyle}]}
      placeholder={placeholder}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      cursorColor={theme.colors.primary}
      numberOfLines={1}
    />
  );
};

export default TYWTextInput;
