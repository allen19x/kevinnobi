import React from 'react'
import { StatusBar, View } from 'react-native'

import { Colors } from '../globals/GlobalConfig';
import NavigationRouter from '../navigations/NavigationRouter';
import { enableFreeze } from 'react-native-screens';
enableFreeze(true);

const App = () => {
	return (
		<View style={{ flex: 1, backgroundColor: Colors.WhiteColor }}>
			<StatusBar backgroundColor={Colors.GREEN_DARK} barStyle='light-content'/>
			<NavigationRouter />
		</View>
	)
}

export default App