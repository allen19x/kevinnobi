import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

import { Colors, Fonts, Icons, Metrics } from '../../globals/GlobalConfig';
import GlobalStyle from '../../globals/GlobalStyle';
import { modelTransaction } from '../../models/Transaction';

import CustomToast from '../../components/CustomToast';

const MiningTabScreen = () => {
    const [miningData, setMiningData] = useState([])
    const [miningDataFiltered, setMiningDataFiltered] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const searchRef = useRef(null);
    const toastRef = useRef(null);

    useEffect(() => {
        initialLoad()
    }, [])

    const initialLoad = () => {
        setIsLoading(true)
        modelTransaction.miningList('', res => {
            const { status, result } = res
            switch (status) {
                case 200:
                    setMiningData(result.data)
                    setMiningDataFiltered(result.data)
                    setIsLoading(false)
                    break;
                case 500:
                    current.showToast('error', `${result.message}`)
                    setIsLoading(false)
                    break;
                default:
                    current.showToast('error', "Connection not available")
                    setIsLoading(false)
                    break;
            }
        })
    }
    const onChangeSearch = (searchtext) => {
        setSearchValue(searchtext)
        let filteredList = []
        for (let i = 0; i < miningData.length; i++) {
            if (String(miningData[i].ticker).includes(String(searchtext).toUpperCase())) filteredList.push(miningData[i])
            if (i === miningData.length - 1) setMiningDataFiltered(filteredList)
        }
    }

    return (
        <LinearGradient
            start={{ x: 0.1, y: -0.2 }}
            colors={[Colors.PrimaryColorDark, Colors.DarkColor]}
            style={[GlobalStyle.container, { paddingHorizontal: Metrics.SAFE_AREA, paddingBottom: 60 }]}>
            {isLoading ?
                <>
                    <View style={{
                        flex: 1,
                        justifyContent: "center"
                    }}>
                        <ActivityIndicator color={Colors.WhiteColor} size='large' />
                    </View>
                </>
                :
                <>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                            <FontAwesome
                                size={24}
                                name={'angle-left'}
                                color={Colors.WhiteColor}
                            />
                        </TouchableOpacity>
                        <View style={styles.searchContainer}>
                            <Image resizeMethod='resize' source={Icons.iconSearch} style={{ width: 12, height: 12, marginHorizontal: 12, marginTop: 3 }} />
                            <TextInput
                                ref={searchRef}
                                style={styles.searchLabel}
                                placeholder={"Search"}
                                placeholderTextColor={Colors.GrayColor}
                                defaultValue={searchValue}
                                onChangeText={(text) => onChangeSearch(text)}
                            />

                        </View>
                    </View>
                    <FlatList style={{ flex: 1, marginTop: 10 }}
                        data={miningDataFiltered}
                        renderItem={({ item, index }) =>
                            <>
                                <View style={styles.listItemContainer}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image resizeMode='contain' source={{ uri: item.image }} style={styles.coinImage} />
                                        <Text style={styles.labelMiningText}>{item.ticker}</Text>
                                    </View>
                                    <Text style={styles.labelMiningText}>{(parseFloat(item.amount)).toFixed(8)}</Text>
                                </View>
                                <View style={{ borderBottomColor: Colors.WhiteColor, borderBottomWidth: 1, opacity: 0.15 }}></View>
                            </>
                        }
                        keyExtractor={item => item.ticker}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            }
            <CustomToast ref={toastRef} />
        </LinearGradient>
    )
}

export default MiningTabScreen

const styles = StyleSheet.create({
    searchContainer: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.PrimaryColorDark,
        borderRadius: 8
    },
    searchLabel: {
        marginTop: 1,
        flex: 1,
        padding: 0,
        fontSize: 16,
        fontFamily: Fonts.POPINS_MEDIUM,
        color: Colors.GrayColor,
        lineHeight: 24,
        letterSpacing: 0.1
    },
    labelMiningText: {
        fontFamily: Fonts.CIRCULARSTD_BOOK,
        fontWeight: 'bold',
        color: Colors.LightGrayColor,
        letterSpacing: 0,
        fontSize: 22,
        opacity: 1
    },
    listItemContainer: {
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    coinImage: {
        width: 16,
        height: 16,
        marginRight: 16
    }
})