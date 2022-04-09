const API_BASE_URL_TEST = 'http://backend.test.usenobi.com:8000/'

const APIListAuth = {
    APILogin: `${API_BASE_URL_TEST}login`,
}


const APITransaction = {
    APIMiningList: `${API_BASE_URL_TEST}list`,
    APIDeposit: `${API_BASE_URL_TEST}dashboard`,
}

export const APIList = {
    Auth: APIListAuth,
    Transaction: APITransaction,
}