import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from './GlobalConfig';
/**
 * Run the function after x ms
 * @param {milisec} ms 
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Check the formatting of string
 * @param {String} param 
 */
export function isEmail(param) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return reg.test(param)
}

/**
 * Check the formatting of password
 * @param {String} param 
 */
export function isStrongPassword(param) {
    let reg = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
    return reg.test(param)
}


/**
 * Return the user_data Local Storage :
 * token_type,
 * expires_in,
 * access_token,
 * refresh_token,
 * user_data
 * @param {milisec} ms 
 */
export function getUserToken() {
    return new Promise((resolve, reject) => {
        try {
            AsyncStorage.getItem(StorageKey.UserToken, (err, res) => {
                if (res) resolve(JSON.parse(res))
                else resolve(err)
            })
        } catch (e) {
            reject(e)
        }
    })
}