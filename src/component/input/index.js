import React from "react";
import { TextInput, Text } from "react-native";
import styles from "./styles";
import { color } from "../../utility";


export default ({
  placeholder,
  inputStyle,
  placeholderTextColor,
  secureTextEntry,
  onChangeText,
  value,
  onSubmitEditing,
  onBlur,
  onFocus,
  numberOfLines,
  multiline,
}) => (
  <TextInput
    style={[styles.input, inputStyle]}
    value={value}
    numberOfLines={numberOfLines}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    placeholder={placeholder}
    placeholderTextColor={
      placeholderTextColor ? placeholderTextColor : color.WHITE
    }
    multiline={multiline}

    onSubmitEditing={onSubmitEditing}
    onBlur={onBlur}
    onFocus={onFocus}
  />
);
