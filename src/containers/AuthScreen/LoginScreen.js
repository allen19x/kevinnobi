import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import { TextInput } from 'react-native-gesture-handler';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors, Fonts, Images, Metrics, StorageKey } from '../../globals/GlobalConfig';
import GlobalStyle from '../../globals/GlobalStyle';
import { getUserToken, isEmail, wait } from '../../globals/GlobalFunction';
import { modelAuth } from '../../models/Auth'

import CustomButton from '../../components/CustomButton';
import CustomToast from '../../components/CustomToast';

const LoginScreen = () => {

    const [isToken, setIsToken] = useState(true)
    const [isFocused, setIsFocused] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isInvalidEmail, setIsInvalidEmail] = useState(false)
    const [isInvalidPassword, setIsInvalidPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const toastRef = useRef(null);

    useEffect(() => {
        wait(2000)
            .then(() => {
                getUserToken()
                    .then((res) => {
                        console.log(res)
                        if (res) Actions.miningList()
                        else setIsToken(false)
                    })
                    .catch(err => setIsToken(false))
                setIsLoading(false)
            })
    }, [])

    const onLoginClick = () => {
        const { current } = toastRef
        if (!isEmail(email)) {
            setIsInvalidEmail(true)
        }
        setIsLoading(true)
        wait(2000).then(() => {
            var dataAuth = new URLSearchParams();
            dataAuth.append('email', email);
            dataAuth.append('password', password);
            modelAuth.login(dataAuth, res => {
                const { status, result } = res
                switch (status) {
                    case 200:
                        AsyncStorage.setItem(StorageKey.UserToken, JSON.stringify(result.token))
                        // console.log(result.token)
                        Actions.miningList()
                        break;
                    case 500:
                        current.showToast('error', `${result.message}`)
                        setIsInvalidPassword(true)
                        setIsInvalidEmail(true)
                        break;
                    default:
                        current.showToast('error', "Connection not available")
                        break;
                }
            })
            setIsLoading(false)
        })
    }
    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)
    return (
        <LinearGradient
            colors={['#152A53', '#000000']}
            style={GlobalStyle.container}>
            <View style={{ marginHorizontal: Metrics.SAFE_AREA + 2, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={Images.LOGO} />
            </View>
            {isToken ?
                <View style={{
                    flex: 1,
                    justifyContent: "center"
                }}>
                    <ActivityIndicator color={Colors.WhiteColor} size='large' />
                </View>
                :
                <>
                    <View style={{ paddingTop: 48, marginHorizontal: Metrics.SAFE_AREA + 2, marginBottom: 10, }}>
                        <Text style={styles.labelText}>
                            E-mail Address
                        </Text>
                        <View style={{ height: 40 }}>
                            <TextInput
                                placeholder={"Enter E-mail Address"}
                                placeholderTextColor={Colors.GrayColor}
                                selectionColor={Colors.PrimaryColor}
                                style={styles.inputBoxStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChangeText={(text) => setEmail(text)}
                            />
                        </View>
                        <Text style={styles.warningText}>
                            {isInvalidEmail &&
                                <>
                                    Invalid E-mail Address
                                </>
                            }
                        </Text>
                    </View>
                    <View style={{ paddingTop: 12, marginHorizontal: Metrics.SAFE_AREA + 2, marginBottom: 10, }}>
                        <Text style={styles.labelText}>
                            Password
                        </Text>
                        <View style={{ height: 40, width: '100%' }}>
                            <TextInput
                                secureTextEntry={!isShowPassword}
                                placeholder={"Enter Password"}
                                placeholderTextColor={Colors.GrayColor}
                                selectionColor={Colors.PrimaryColor}
                                style={styles.inputBoxStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChangeText={(text) => setPassword(text)}
                            />
                            <TouchableOpacity
                                onPress={() => setIsShowPassword(!isShowPassword)}
                                style={{ width: 45, height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 3, position: 'absolute', right: 0, bottom: 2 }}>
                                <FontAwesome
                                    size={20}
                                    name={isShowPassword ? 'eye' : 'eye-slash'}
                                    color={isShowPassword ? Colors.GrayColor : Colors.GrayColor}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.warningText}>
                            {isInvalidPassword &&
                                <>
                                    Invalid Password
                                </>
                            }
                        </Text>
                    </View>
                    <View style={styles.buttonStyle}>
                        <CustomButton
                            customColor={"#2457b5"}
                            onPress={() => onLoginClick()}
                            isLoading={isLoading}
                            label='Login'
                        />
                    </View>
                </>
            }
            <CustomToast ref={toastRef} />
        </LinearGradient>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    inputBoxStyle: {
        flex: 1,
        fontSize: 19,
        color: '#EAEAEA',
        paddingHorizontal: 14,
        backgroundColor: '#11203C',
        textAlign: 'center',
        borderRadius: 8
    },
    buttonStyle: {
        paddingHorizontal: Metrics.SAFE_AREA * 2,
        paddingTop: 15,
        paddingBottom: 20,
        flexDirection: "row",
        position: 'absolute',
        bottom: 0
    },
    labelText: {
        fontFamily: Fonts.CIRCULARSTD_BOOK,
        marginBottom: 12,
        color: '#9D9FA0',
        letterSpacing: 0,
        fontSize: 19,
        opacity: 1
    },
    warningText: {
        fontFamily: Fonts.CIRCULARSTD_BOOK_ITALIC,
        marginTop: 8,
        color: '#F6BC45',
        letterSpacing: 0,
        fontSize: 16,
        opacity: 1
    }
})