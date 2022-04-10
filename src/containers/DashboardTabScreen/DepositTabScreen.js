import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native'
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, Fonts, Images, Metrics, StorageKey } from '../../globals/GlobalConfig';
import GlobalStyle from '../../globals/GlobalStyle';
import { getUserToken, wait } from '../../globals/GlobalFunction';
import { modelTransaction } from '../../models/Transaction';

import CustomButton from '../../components/CustomButton';
import CustomToast from '../../components/CustomToast';

const DepositTabScreen = () => {
    const [HourChange, setHourChange] = useState("")
    const [totalAsset, setTotalAsset] = useState("")
    const [isLoadingDeposit, setIsLoadingDeposit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const toastRef = useRef(null);

    useEffect(() => {
        initialLoad()
    }, [])

    const initialLoad = () => {
        setIsLoading(true)
        getUserToken()
            .then((res) => {
                var token = new URLSearchParams();
                token.append('token', res);
                modelTransaction.getDeposit(token, res => {
                    const { status, result } = res
                    switch (status) {
                        case 200:
                            setHourChange(result["24hourchange"])
                            setTotalAsset(result.total_asset)
                            setIsLoading(false)
                            break;
                        case 500:
                            current.showToast('error', `${result.message}`)
                            break;
                        default:
                            current.showToast('error', "Connection not available")
                            break;
                    }
                })
            })
            .catch(err => setIsToken(false))
    }

    const onClickLogout = () => {
        setIsLoading(true)
        wait(2000).then(() => {
            const keys = [
                StorageKey.UserToken,
            ]
            AsyncStorage.multiRemove(keys)
            Actions.login()
            setIsLoading(false)
        })
    }
    const onClickDeposit = () => {
        setIsLoadingDeposit(true)
        wait(5000).then(() => {
            setIsLoadingDeposit(false)
        })
    }

    return (
        <LinearGradient
            start={{ x: 0.1, y: -0.2 }}
            colors={[Colors.PrimaryColorDark, Colors.DarkColor]}
            style={[GlobalStyle.container, { alignItems: 'center', paddingHorizontal: Metrics.SAFE_AREA, paddingBottom: 60 }]}>
            {isLoading ?
                <View style={{
                    flex: 1,
                    justifyContent: "center"
                }}>
                    <ActivityIndicator color={Colors.WhiteColor} size='large' />
                </View>
                :
                <>
                    <Image style={styles.image} source={Images.BANNER_ADS}></Image>
                    <Text style={styles.labelChangeText}>24H Changes
                        <Text style={{ color: Colors.CyanColor, fontFamily:Fonts.CIRCULARSTD_BOOK_BOLD }}> + {HourChange}%</Text>
                    </Text>
                    <Text style={styles.labelAssetsText}>${totalAsset}</Text>
                    <View style={styles.buttonDepositStyle}>
                        <CustomButton
                            customColor={Colors.CyanColor}
                            onPress={() => onClickDeposit()}
                            isLoading={isLoadingDeposit}
                            label='Deposit'
                        />
                    </View>
                    <View style={styles.buttonLogoutStyle}>
                        <CustomButton
                            customColor={Colors.PrimaryColor}
                            onPress={() => onClickLogout()}
                            isLoading={isLoading}
                            label='Logout'
                        />
                    </View>
                </>
            }
            <CustomToast ref={toastRef} />
        </LinearGradient >
    )
}

export default DepositTabScreen

const styles = StyleSheet.create({
    buttonDepositStyle: {
        paddingHorizontal: Metrics.SAFE_AREA * 2,
        paddingTop: 15,
        paddingBottom: 20,
        flexDirection: "row",
    },
    buttonLogoutStyle: {
        paddingHorizontal: Metrics.SAFE_AREA * 2,
        paddingTop: 15,
        paddingBottom: 80,
        flexDirection: "row",
        position: 'absolute',
        bottom: 0
    },
    labelChangeText: {
        fontFamily: Fonts.CIRCULARSTD_BOOK,
        marginVertical: 20,
        color: Colors.MediumGrayColor,
        letterSpacing: 0,
        fontSize: 19,
        opacity: 1
    },
    labelAssetsText: {
        fontFamily: Fonts.CIRCULARSTD_BOOK_BOLD,
        marginBottom: 20,
        color: Colors.WhiteColor,
        letterSpacing: 0,
        fontSize: 56,
        opacity: 1
    },
})