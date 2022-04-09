import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '../globals/GlobalConfig';

const isJSON = (str) => {
    try {
        const obj = JSON.parse(str);
        if (obj && typeof obj === `object`) {
            return true;
        }
    } catch (err) {
        return false;
    }
    return false;
}
export default async (update, API, requestType = 'GET', useToken = false, post_data = null, params_data = null) => {
    let token = ''
    if (useToken) {
        await AsyncStorage.getItem(StorageKey.UserToken, (err, res) => {
            const result = JSON.parse(res)
            token = result
            // console.log('token ' + token)
        })
    }
    return fetch(`${API}${params_data ? `?${params_data}` : ``}`, {
        method: requestType,
        headers:
        {
            'Accept': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: post_data.toString()
    })
        .then((response) => {
            const { status } = response
            // console.log('token ' + token)
            return Promise.all([status, response.text()])
        })
        .then(([status, result]) => {
            if (result.length > 0) {
                if (isJSON(result)) {
                    const response = {
                        FETCH_API: `${API}${params_data ? `?${params_data}` : ``}`,
                        status,
                        post_data,
                        result: JSON.parse(result)
                    }

                    if (status != 200) console.error('\nLOG', JSON.stringify(response, null, 4))

                    update(response)
                }
                else {
                    const response = {
                        FETCH_API: `${API}${params_data ? `?${params_data}` : ``}`,
                        status,
                        post_data: JSON.parse(post_data)
                    }
                    console.error('\nLOG', JSON.stringify(response, null, 4))
                    console.log('\nPHP ERR', `\n${result}`)
                    // console.log('\nPHP ERR', `\n${result}`.split('Ignition.start();')[1])

                    throw 'Return NOT JSON'
                }
            }
            else {
                throw 'Empty Result'
            }
        })
        .catch(err => {
            throw ({
                FETCH_API: `${API}${params_data ? `?${params_data}` : ``}aaaa`,
                type: err
            })
        })
}