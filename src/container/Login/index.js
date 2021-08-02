import React, { useState, useContext } from 'react'
import { View, Text, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { color, globalStyle } from '../../utility'
import { Logo, InputField, RoundCornerButton } from '../../component'
import { LOADING_START, LOADING_STOP } from '../../context/actions/type'
import { Store } from '../../context/store';
import { LoginRequest } from '../../network';
import { setUniqueValue, keyboardVerticalOffset } from '../../utility/constants';
import { setAsyncStorage, keys } from '../../asyncStorage';
import firebase from "../../firebase/config";
const Login = ({ navigation }) => {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;

    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });
    const { email, password } = credentials;

    const onLoginPress = () => {
        if (!email) {
            alert('Yêu cầu nhập Email!');
        } else if (!password) {
            alert('Yêu cầu nhập mật khẩu!');
        } else {
            dispatchLoaderAction({
                type: LOADING_START,
            });
            LoginRequest(email, password)
                .then((res) => {
                    if (!res.additionalUserInfo) {
                        dispatchLoaderAction({
                            type: LOADING_STOP
                        });
                        alert(res);
                        return;
                    }
                    setAsyncStorage(keys.uuid, res.user.uid);
                    setUniqueValue(res.user.uid);
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                    navigation.replace('Home');
                })
                .catch((err) => {
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                    alert(err);
                })
        }
    };

    const handleOnChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value,
        })
    };
    return (

        <View style={[globalStyle.flex1, { backgroundColor: color.DARK_GREEN }]}>
            <View style={[globalStyle.containerCentered]}>
                <Logo />
            </View>
            <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
                <InputField
                    placeholder="Nhập email"
                    value={email}
                    onChangeText={(text) => handleOnChange('email', text)}
                />
                <InputField
                    placeholder="Nhập mật khẩu"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => handleOnChange('password', text)}

                />
                <RoundCornerButton title="Đăng nhập" onPress={() => onLoginPress()} />
                <Text style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                }}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    Đăng kí
                </Text>
            </View>
        </View>


    )
}

export default Login