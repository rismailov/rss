import Axios, { AxiosResponse } from 'axios'

const axios = Axios.create({
    baseURL: import.meta.env.API_URL || 'http://localhost:4000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

axios.interceptors.response.use(
    async (response: AxiosResponse) => response.data,
)

export default axios
