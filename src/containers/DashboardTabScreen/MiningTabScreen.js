import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux';

import { Colors, Fonts, Icons, Metrics } from '../../globals/GlobalConfig';
import GlobalStyle from '../../globals/GlobalStyle';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CustomToast from '../../components/CustomToast';
import LinearGradient from 'react-native-linear-gradient';
import { modelTransaction } from '../../models/Transaction';
import { TextInput } from 'react-native-gesture-handler';

const MiningTabScreen = () => {
    const [miningData, setMiningData] = useState([])
    const [miningDataFiltered, setMiningDataFiltered] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const searchRef = useRef(null);
    const toastRef = useRef(null);

    useEffect(() => {
        initialLoad()
    }, [])

    const initialLoad = () => {
        modelTransaction.miningList('', res => {
            const { status, result } = res
            switch (status) {
                case 200:
                    setMiningData(result.data)
                    setMiningDataFiltered(result.data)
                    break;
                case 500:
                    current.showToast('error', `${result.message}`)
                    break;
                default:
                    current.showToast('error', "Connection not available")
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
            colors={['#152A53', '#000000']}
            style={[GlobalStyle.container, { paddingHorizontal: Metrics.SAFE_AREA, paddingBottom: 60 }]}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
                    {/* <Image resizeMode='contain' source={Icons.iconBack} style={{ width: 24, height: 32 }} /> */}
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
            <FlatList style={{ flex: 1, marginTop:10 }}
                data={miningDataFiltered}
                renderItem={({ item, index }) =>
                    <>
                        <View style={{ height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image resizeMode='contain' source={{ uri: item.image }} style={{ width: 16, height: 16, marginRight: 16 }} />
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
        backgroundColor: '#223965',
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
        color: '#EAEAEA',
        letterSpacing: 0,
        fontSize: 22,
        opacity: 1
    },
})