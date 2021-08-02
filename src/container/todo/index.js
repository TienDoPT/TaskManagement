import React, { useState, useEffect,useLayoutEffect } from 'react'
import { View, Button, Text, TouchableOpacity } from 'react-native';
import { color, globalStyle } from '../../utility';
import { InputField, RoundCornerButton } from '../../component'
import DateTimePicker from '@react-native-community/datetimepicker';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { AddTodo } from '../../network';


const ToDo = ({ route, navigation }) => {
  const { params } = route;
  const { idGroup, idUser } = params;

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [todo, setTodo] = useState("")

  const onChange = (selectedDate) => {
    let newDate = new Date(selectedDate.nativeEvent.timestamp)
    const currentDate = newDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);

  };

  const handleOnChange = (text) => {
    setTodo(text);
  }

  const handleOnPress = () => {
    if (todo) {
      setTodo("");
      let status = false;
      AddTodo(idGroup, idUser, todo, date, status)
        .then(() => { alert('Thêm dữ liệu thành công!') })
        .catch((error) => alert(error));
    } else {
      alert("Vui lòng nhập công việc!")
    }

  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Thêm công việc'
    })
  })

  return (
    <View style={[globalStyle.flex1, { backgroundColor: "rgb(109,188,47)" }]}>
      <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
        <InputField
          placeholder="Nội dung công việc..."
          multiline={true}
          value={todo}
          onChangeText={(text) => handleOnChange(text)}
        />
        <TouchableOpacity style={{ padding: 15, alignSelf: "center", backgroundColor: "rgb(46, 46, 46)", color: "white", display: "flex", flexDirection: "row", width: "90%" }} onPress={showDatepicker}>
          <EvilIcons
            name="calendar"
            size={26}
            color={color.WHITE}
          />
          <Text style={{ color: "white" }}>
            {date.toISOString().slice(0, 10)} (Thời hạn)
          </Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <RoundCornerButton title="Xác nhận" onPress={() => handleOnPress()} />

      </View>


    </View>
  );
}
export default ToDo