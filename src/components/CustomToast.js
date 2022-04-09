import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
	Animated,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableNativeFeedback,
	View, StatusBar
} from 'react-native';

import { Fonts, Colors, Metrics, PropertyColors } from '../globals/GlobalConfig';

const MESSAGE_FONT = Fonts.MONSERRAT_REGULER
const MESSAGE_ACTION_FONT = Fonts.MONSERRAT_BOLD

const PRIMARY_BUTTON_COLOR = Colors.PrimaryColorDark
const PRIMARY_BUTTON_RIPPLE_COLOR = Colors.GrayColor
const TOAST_DEFAULT_BACKGROUND_COLOR = Colors.DarkColor
const TOAST_ERROR_BACKGROUND_COLOR = PropertyColors.ERROR_COLOR
const TOAST_WARNING_BACKGROUND_COLOR = PropertyColors.WARNING_COLOR
const TOAST_SUCCESS_BACKGROUND_COLOR = PropertyColors.SUCCESS_COLOR

const SCREEN_WIDTH = Metrics.SCREEN_WIDTH
const STATUSBAR_HEIGHT = StatusBar.currentHeight
const NAVBAR_HEIGHT = Metrics.NAVBAR_HEIGHT

/**
 * add noStatusBar props if no status bar / translucent
 * add noHeader props if no header
 */
export default forwardRef((props, ref) => {
	const [isToastVisible, setIsToastVisible] = useState(false)
	const [toastDataList, setToastDataList] = useState([])
	const [toastMessage, setToastMessage] = useState('')
	const [toastMessageType, setToastMessageType] = useState('')
	const [toastDuration, setToastDuration] = useState(4000)
	const [toastActionText, setToastActionText] = useState('')
	const [toastActionFunction, setToastActionFunction] = useState(null)
	const [animatedToastValue] = useState(new Animated.Value(0))
	let timer = null

	useImperativeHandle(ref, () => ({
		showToast
	}));

	useEffect(() => {
		if (isToastVisible) {
			Animated.timing(
				animatedToastValue,
				{
					toValue: 1,
					duration: 500,
					useNativeDriver: true
				}
			).start(() => {
				hideToast(toastDuration)
			})
		}
		else {
			if (toastDataList.length > 0) {
				let tempToastDataList = toastDataList
				// console.log('before shift', tempToastDataList.length)
				const {
					message,
					messageType,
					duration,
					actionText,
					actionFunction
				} = toastDataList[0]
				showToast(
					messageType,
					message,
					duration,
					actionText,
					actionFunction
				)
				tempToastDataList.shift()
				// console.log('after shift', tempToastDataList.length)
				setToastDataList(tempToastDataList)
			}
		}
	}, [isToastVisible])

	/**
	 * Display toast
	 * @param {string} message Message of the toast
	 * @param {number} duration duration of the toast (On Parameter can be set to '' / null to use default ones)
	 * @param {string} actionText Text of the toast touchable
	 * @param {function} actionFunction Function of the toast touchable
	 */
	const showToast = (messageType = '', message = '', duration = 4000, actionText = '', actionFunction = null) => {
		if (!isToastVisible) {
			setToastMessage(message)
			setToastMessageType(messageType)
			if (duration) setToastDuration(parseInt(duration))
			else setToastDuration(4000)
			setToastActionText(actionText)
			setToastActionFunction(() => actionFunction)

			setIsToastVisible(true)
		}
		else {
			setToastDataList([
				...toastDataList,
				{
					messageType,
					message,
					duration,
					actionText,
					actionFunction
				}])
		}
	}

	const hideToast = (duration) => {
		timer = setTimeout(() => {
			Animated.timing(
				animatedToastValue,
				{
					toValue: 0,
					duration: 300,
					useNativeDriver: true
				}
			).start(() => {
				setIsToastVisible(false)
				clearTimeout(timer);
			})
		}, duration);
	}

	const handleActionPressed = () => {
		toastActionFunction()
		clearTimeout(timer);
		Animated.timing(
			animatedToastValue,
			{
				toValue: 0,
				duration: 300,
				useNativeDriver: true
			}
		).start(() => {
			setIsToastVisible(false)
		})
	}

	const animatedTop = animatedToastValue.interpolate({
		inputRange: [0, 1],
		outputRange: [-NAVBAR_HEIGHT, 0]
	});

	const animatedOpacity = animatedToastValue.interpolate({
		inputRange: [0, 0.7, 1],
		outputRange: [0, 0, 1]
	});

	let toastActionView = (
		<TouchableOpacity
			onPress={handleActionPressed}
			disabled={!isToastVisible}
			style={{ height: '100%', justifyContent: 'center', paddingHorizontal: 8 }}>
			<Text style={styles.toastActionText}>{String(toastActionText).toUpperCase()}</Text>
		</TouchableOpacity>
	)

	if (Platform.OS == 'android') {
		toastActionView = (
			<TouchableNativeFeedback
				onPress={handleActionPressed}
				disabled={!isToastVisible}
				background={Platform.Version >= 21 ?
					TouchableNativeFeedback.Ripple(PRIMARY_BUTTON_RIPPLE_COLOR, toastActionText.length > 10 ? false : true) :
					TouchableNativeFeedback.SelectableBackground()}>
				<View style={{ height: '100%', justifyContent: 'center', paddingHorizontal: 8 }}>
					<Text style={styles.toastActionText}>{String(toastActionText).toUpperCase()}</Text>
				</View>
			</TouchableNativeFeedback>
		)
	}

	let toastBackground = TOAST_DEFAULT_BACKGROUND_COLOR

	switch (toastMessageType) {
		case 'success':
			toastBackground = TOAST_SUCCESS_BACKGROUND_COLOR
			break;
		case 'warning':
			toastBackground = TOAST_WARNING_BACKGROUND_COLOR
			break;
		case 'error':
			toastBackground = TOAST_ERROR_BACKGROUND_COLOR
			break;
		default:
			break;
	}

	let messageArray = toastMessage.split('*')

	const messageContentView = (
		<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
			<Text
				style={[
					styles.toastMessageText,
					toastMessageType == 'warning' && { color: TOAST_DEFAULT_BACKGROUND_COLOR }
				]}>
				{messageArray.map((item, index) => {
					if (index % 2 != 0) return <Text key={String(index)} style={{ fontFamily: MESSAGE_ACTION_FONT, fontWeight: 'bold' }}>{item}</Text>
					return item
				})}
			</Text>
		</View>
	)

	let toastContentView = (
		<View style={[styles.toastBoxShadow, { backgroundColor: toastBackground }]}>
			<View style={styles.toastBox}>
				<View style={[
					{ flex: 1, justifyContent: 'center', paddingLeft: 8 },
					toastActionText == '' && { paddingRight: 8 }
				]}>
					{messageContentView}
				</View>
				{toastActionText != '' && toastActionView}
			</View>
		</View>
	)

	if (toastActionText.length > 10) {
		toastContentView = (
			<View style={[styles.toastBoxShadow, { backgroundColor: toastBackground }]}>
				<View style={styles.toastBoxLongAction}>
					<View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 8, marginBottom: 5 }}>
						{messageContentView}
					</View>
					<View style={{ height: 36, justifyContent: 'center', alignSelf: 'flex-end' }}>
						{toastActionView}
					</View>
				</View>
			</View>
		)
	}

	if (isToastVisible) {
		let ACCUMULATE_HEIGHT = 0
		if (props.noStatusBar) ACCUMULATE_HEIGHT += STATUSBAR_HEIGHT
		if (props.noHeader) ACCUMULATE_HEIGHT += NAVBAR_HEIGHT
		if (props.customTop) ACCUMULATE_HEIGHT += props.customTop

		return (
			<Animated.View
				style={[
					styles.toastContainer,
					{ top: ACCUMULATE_HEIGHT },
					{
						opacity: animatedOpacity,
						paddingTop: 10,
						transform: [{
							translateY: animatedTop
						}]
					}
				]}>
				{toastContentView}
			</Animated.View>
		);
	}
	return null;
})

const styles = StyleSheet.create({
	toastContainer: {
		width: '100%',
		zIndex: 9999,
		position: 'absolute',
		alignSelf: 'center',
		paddingHorizontal: 10,
		elevation: 10
	},
	toastBox: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 12
	},
	toastBoxLongAction: {
		width: '100%',
		paddingHorizontal: 8,
		paddingVertical: 10
	},
	toastBoxShadow: {
		width: '100%',
		borderRadius: 4,
		overflow: 'hidden',
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3
	},
	toastMessageText: {
		fontSize: SCREEN_WIDTH > 380 ? 16 : 15,
		fontFamily: MESSAGE_FONT,
		color: Colors.WhiteColor,
		letterSpacing: 0.2
	},
	toastActionText: {
		fontSize: SCREEN_WIDTH > 380 ? 16 : 15,
		fontFamily: MESSAGE_ACTION_FONT,
		color: PRIMARY_BUTTON_COLOR,
		letterSpacing: 0.4
	},
});