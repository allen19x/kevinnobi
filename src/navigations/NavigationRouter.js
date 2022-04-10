import React, { PureComponent } from 'react'
import {
    View,
    Image,
    TouchableNativeFeedback,
    Platform,
    StyleSheet,
    Easing,
    BackHandler
} from 'react-native'
import { Scene, Router, Stack, Actions, Tabs } from 'react-native-router-flux'

import { Icons, Colors, Metrics } from '../globals/GlobalConfig'
import GlobalStyle from '../globals/GlobalStyle'

import LoginScreen from '../containers/AuthScreen/LoginScreen'
import MiningTabScreen from '../containers/DashboardTabScreen/MiningTabScreen'
import DepositTabScreen from '../containers/DashboardTabScreen/DepositTabScreen'

const NavigationRouter = () => {
    const handleBack = () => {
        switch (Actions.currentScene) {
            case 'login':
                BackHandler.exitApp()
                break;
            default:
                Actions.pop()
                break;
        }

        return true;
    }
    const TabIcon = (props) => {
        const { screenKey, title, isFocused } = props

        let iconTab, titleTab = title
        let focusedColor = Colors.LightGrayColor
        let inactiveColor = Colors.GrayColor

        const navigate = () => {
            Actions.jump(screenKey)
        }

        switch (screenKey) {
            case 'miningList':
                iconTab = Icons.iconTabMining
                titleTab = 'Mining List'
                inactiveColor = inactiveColor
                break;
            case 'deposit':
                iconTab = Icons.iconTabDeposit
                titleTab = 'Deposit'
                inactiveColor = inactiveColor
                break;
            default:
                break;
        }

        return (
            <TouchableNativeFeedback
                onPress={navigate}
                background={Platform.Version >= 21 ?
                    TouchableNativeFeedback.Ripple(Colors.WhiteBluishColor, true) :
                    TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.tabIconContainer}>
                    <View style={styles.tabIcon}>
                        {titleTab == "Mining List" &&
                            <Image 
                            resizeMethod="resize" 
                            source={iconTab} 
                            style={[styles.iconTab, { tintColor: isFocused ? focusedColor : inactiveColor }]} />
                        }
                        {titleTab == "Deposit" &&
                            <Image 
                            resizeMethod="resize" 
                            source={isFocused ? Icons.iconTabDepositOn : iconTab} 
                            style={[styles.iconTab, !isFocused && { tintColor: inactiveColor }]} />
                        }
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }

    const MyTransitionSpec = ({
        duration: 250,
        easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99)
        // timing: Animated.timing,
    });

    const transitionConfig = () => ({
        transitionSpec: MyTransitionSpec,
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const { index } = scene;
            const width = layout.initWidth;

            // right to left by replacing bottom scene
            return {
                transform: [{
                    translateX: position.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [width, 0, -width],
                    }),
                }]
            };
        }
    });

    const customTabBar = (props) => {
        const { state } = props.navigation
        const { routes, index } = state
        const tabList = routes
        const activeTabIndex = index;

        return (
            <View style={[
                { ...GlobalStyle.cardShadow },
                styles.customTabBarContainer
            ]
            }>
                {
                    tabList.map((element, index) => (
                        <View style={{ flex: 1 }}>
                            <TabIcon screenKey={element.key} isFocused={activeTabIndex == index} />
                        </View>
                    ))
                }
            </View>
        );
    }


    return (
        <Router backAndroidHandler={handleBack}>
            <Stack key='root'
                navigationBarStyle={{ ...GlobalStyle.navigationBarShadow, height: Metrics.NAVBAR_HEIGHT }}
                transitionConfig={transitionConfig}
            >
                <Scene key='login'
                    initial
                    hideNavBar
                    type="reset"
                    component={LoginScreen}
                />
                <Tabs
                    key="tabBar"
                    tabs
                    showLabel={false}
                    tabBarStyle={{ borderTopWidth: 1, borderTopColor: Colors.GRAY, height: 70 }}
                    tabBarComponent={customTabBar}
                    hideNavBar
                >
                    <Scene key='miningList'
                        hideNavBar
                        onEnter={() => Actions.refresh({ lastUpdate: new Date })}
                        component={MiningTabScreen} />
                    <Scene key='deposit'
                        hideNavBar
                        onEnter={() => Actions.refresh({ lastUpdate: new Date })}
                        component={DepositTabScreen} />
                </Tabs>


            </Stack>
        </Router>
    )
}

const styles = StyleSheet.create({
    tabIconContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },
    customTabBarContainer: {
        position: 'absolute',
        bottom: -10,
        flexDirection: 'row',
        height: 80,
        width: Metrics.SCREEN_WIDTH,
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: Colors.BLACK,
        paddingBottom: 10,
        paddingHorizontal: Metrics.SAFE_AREA * 2
    },
    tabIcon: {
        height: 26,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconTab: {
        height: '100%',
        width: '100%',
        resizeMode: "contain"
    }

})

export default NavigationRouter