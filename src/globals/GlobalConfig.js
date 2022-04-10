import { Dimensions } from "react-native"

export const Fonts = {
    CIRCULARSTD_BOOK: 'CircularStd-Book',
    CIRCULARSTD_BOOK_ITALIC: 'CircularStd-BookItalic',
}

export const Metrics = Object.freeze({
    SAFE_AREA: 16,
    SCREEN_WIDTH: Dimensions.get('screen').width,
    SCREEN_HEIGHT: Dimensions.get('screen').height,
    NAVBAR_HEIGHT: 56
})

export const StorageKey = {
    UserToken: 'user_token',
}

export const Icons = Object.freeze({
    iconTabMining: require("../assets/icons/ic_mining_list_on.png"),
    iconTabDeposit: require("../assets/icons/ic_deposit.png"),
    iconTabDepositOn: require("../assets/icons/ic_logo.png"),
    iconSearch: require("../assets/icons/ic_search.png"),
    iconBack: require("../assets/icons/ic_back.png"),
    iconDownload: require("../assets/icons/ic_download.png"),
})

export const Images = {
    LOGO: require("../assets/images/nobi_logo.png"),
    BANNER_ADS: require("../assets/images/img_banner_ads.png"),
}
export const Colors = {
    PrimaryColorDark: "#11203C",
    PrimaryColor: '#2457b5',
    GreenColor: '#8dc63f',
    CyanColor: '#05BE90',
    DarkColor: '#000000',
    GrayColor: '#4f4f4f',
    MediumGrayColor: '#9D9FA0',
    LightGrayColor: '#EAEAEA',
    WhiteColor: '#ffffff',
    WhiteBluishColor: '#e6f8fc',
    RedColor: '#EE2020',
    YellowColor: '#F6BC45',
}

export const PropertyColors = {
    LOADING: Colors.DarkColor,
    ERROR_COLOR : '#EF6950',
    WARNING_COLOR : '#FBC100',
    SUCCESS_COLOR : '#40C5AF'
}