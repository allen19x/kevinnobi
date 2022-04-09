import fetchNoCache from "../libraries/fetchNoCache"
import { APIList } from "../globals/APIConfig"

export const modelAuth = {
    login: (post_data, update) => {
        return fetchNoCache(update, APIList.Auth.APILogin, 'POST', false, post_data)
    },
}