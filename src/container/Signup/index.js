import React, { useState, useContext } from 'react'
import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard   } from 'react-native'
import { color, globalStyle } from '../../utility';
import { Logo, InputField, RoundCornerButton } from '../../component'
import { Store } from '../../context/store';
import { LOADING_START, LOADING_STOP } from '../../context/actions/type';
import { SignUpRequest, AddUser } from '../../network';
import { setAsyncStorage, keys } from '../../asyncStorage';
import { keyboardVerticalOffset, setUniqueValue } from '../../utility/constants';
import firebase from '../../firebase/config';

const SignUp = ({ navigation }) => {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;

    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const { name, email, password, confirmPassword } = credentials;
    const onSignUpPress = () => {
        if (!name) {
            alert('Yêu cầu nhập tên tài khoản!');
        } else if (!email) {
            alert('Yêu cầu nhập email!');
        } else if (!password) {
            alert('Yêu cầu nhập mật khẩu!');
        } else if (password !== confirmPassword) {
            alert('Nhập lại mật khẩu không chính xác');
        }
        else {
            dispatchLoaderAction({
                type: LOADING_START,
            })
            SignUpRequest(email, password)
                .then((res) => {
                    if (!res.additionalUserInfo) {
                        dispatchLoaderAction({
                            type: LOADING_STOP
                        });
                        alert(res);
                        return;
                    }
                    let uid = firebase.auth().currentUser.uid
                    let profileImg = '';
                    AddUser(name, email, uid, profileImg)
                        .then(() => {
                            setAsyncStorage(keys.uuid, uid);
                            setUniqueValue(uid);
                            dispatchLoaderAction({
                                type: LOADING_STOP,
                            });
                            navigation.replace('Dashboard');
                        })
                        .catch((err) => {
                            dispatchLoaderAction({
                                type: LOADING_STOP,
                            });
                            alert(err);
                        });
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
        <KeyboardAvoidingView style={{flex:1}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[globalStyle.flex1, { backgroundColor: color.DARK_GREEN }]} >
                    {/* <View style={[globalStyle.containerCentered]}>
                        <Logo />
                    </View>  */}
                    <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
                        <InputField
                            placeholder="Nhập tên tài khoản"
                            value={name}
                            onChangeText={(text) => handleOnChange('name', text)}
                        />
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
                        <InputField
                            placeholder="Nhập lại mật khẩu"
                            secureTextEntry={true}
                            value={confirmPassword}
                            onChangeText={(text) => handleOnChange('confirmPassword', text)}

                        />
                        <RoundCornerButton title="Đăng kí" onPress={() => onSignUpPress()} />
                        <Text style={{
                            fontSize: 28,
                            fontWeight: 'bold',
                        }}
                            onPress={() => navigation.navigate('Login')}
                        >
                            Đăng nhập
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default SignUp