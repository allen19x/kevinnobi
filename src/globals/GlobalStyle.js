import {
    Dimensions,
    StyleSheet
} from 'react-native';
const { width } = Dimensions.get('window')
import { Fonts, Colors, Metrics } from './GlobalConfig';

const GlobalStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical:Metrics.SAFE_AREA
    },
    containerCenter: {
        flex: 1,
        backgroundColor: Colors.WhiteColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default GlobalStyle;