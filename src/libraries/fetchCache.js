import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '../globals/GlobalConfig'

export default async (update, API, requestType = 'GET', useToken = false, storageId, post_data = null, params_data = null, debugMode = false) => {
    let token
    if (useToken) {
        AsyncStorage.getItem(StorageKey.UserToken, (err, res) => {
            token = JSON.parse(res)
            // console.log('token ' + token)
        })
    }

    // If the data cache is available, update with the cached data first
    AsyncStorage.getItem(storageId, (error, result) => {
        if (result) {
            result = JSON.parse(result)
            update(result ?
                {
                    "isCache": true,
                    "result": result
                } :
                {
                    "isCache": true,
                    "result": []
                }
            )
        }
    })

    // Request the latest data from the server, if successful, update the view and update the cache
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
            if (debugMode) {
                console.log(response.text())
                console.log(response.status)
            }
            const statusCode = response.status;
            const res = response.status == 200 ? response.json() : []
            return Promise.all([statusCode, res])
        })
        .then(([statusCode, result]) => {
            if (statusCode == 200) {
                update(
                    {
                        "status": statusCode,
                        "result": result,
                        "isCache": false
                    }
                )
                AsyncStorage.setItem(storageId, JSON.stringify(result))
            }
        })
        .catch(err => { throw err })

}