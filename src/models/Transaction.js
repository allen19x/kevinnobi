import fetchNoCache from "../libraries/fetchNoCache"
import { APIList } from "../globals/APIConfig"

export const modelTransaction = {
    //Stock Opname Suggestion
    miningList: (params_data, update) => {
        return fetchNoCache(update, APIList.Transaction.APIMiningList, 'GET', true, '', params_data)
    },
    getDeposit: (post_data, update) => {
        return fetchNoCache(update, APIList.Transaction.APIDeposit, 'POST', true, post_data)
    },
}