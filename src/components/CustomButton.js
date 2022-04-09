
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableNativeFeedback,
    ActivityIndicator,
    Platform,
    Image
} from 'react-native';
import { Fonts, Colors, Icons } from '../globals/GlobalConfig';

const PRIMARY_BUTTON_COLOR = Colors.DarkColor
const DISABLED_BUTTON_COLOR = Colors.WhiteColor
const DISABLED_BUTTON_COLOR_2 = Colors.GrayColor
const RIPPLE_COLOR = Colors.LightGrayColor
const WHITE_COLOR = Colors.WhiteColor

const BUTTON_FONT = Fonts.CIRCULARSTD_BOOK

export default (props) => {
    const {
        label,
        onPress,
        customColor,
        outline,
        style,
        isLoading,
        disabled
    } = props;

    const buttonStyle = {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        flex: 1,
        borderRadius: 6
    }
    const buttonShadowStyle = {
        backgroundColor: customColor ? customColor : outline ? WHITE_COLOR : PRIMARY_BUTTON_COLOR,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3
    }
    const buttonDisabledShadowStyle = {
        backgroundColor: customColor == WHITE_COLOR ? DISABLED_BUTTON_COLOR : DISABLED_BUTTON_COLOR_2,
    }
    const buttonText = {
        color: (outline || customColor == WHITE_COLOR) && !disabled ? PRIMARY_BUTTON_COLOR : WHITE_COLOR,
        fontFamily: BUTTON_FONT,
        letterSpacing: 0.5
    }

    if (Platform.OS == 'android') {
        return (
            <TouchableNativeFeedback
                {...props}
                disabled={isLoading || disabled}
                onPress={onPress}
                background={Platform.Version >= 21 ?
                    TouchableNativeFeedback.Ripple(RIPPLE_COLOR) :
                    TouchableNativeFeedback.SelectableBackground()}>
                <View style={[
                    buttonStyle,
                    outline && { borderWidth: 1, borderColor: PRIMARY_BUTTON_COLOR },
                    disabled || isLoading ? buttonDisabledShadowStyle : buttonShadowStyle,
                    style
                ]}>
                    {isLoading ?
                        <ActivityIndicator color={customColor == WHITE_COLOR ? PRIMARY_BUTTON_COLOR : WHITE_COLOR} size='small' />
                        :
                        <>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                {label == "Deposit" &&
                                    <Image resizeMode='contain'
                                        style={{ height: 20, width: 20, tintColor: Colors.WhiteColor, marginRight: 8 }}
                                        source={Icons.iconDownload} />
                                }
                                <Text style={[label == "Deposit" && { fontSize: 18 }, buttonText]}>{label}</Text>
                            </View>
                        </>
                    }
                </View>
            </TouchableNativeFeedback>
        )
    }

    return (
        <TouchableOpacity
            {...props}
            style={[
                buttonStyle,
                disabled || isLoading ? buttonDisabledShadowStyle : buttonShadowStyle,
                style
            ]} disabled={isLoading || disabled} onPress={onPress}>
            {isLoading ?
                <ActivityIndicator color={customColor == WHITE_COLOR ? PRIMARY_BUTTON_COLOR : WHITE_COLOR} size='small' />
                : <Text style={buttonText}>{label}</Text>}
        </TouchableOpacity>
    )
}