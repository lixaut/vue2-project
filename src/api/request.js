
import axios from 'axios'

const _axios = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 2000
})

// 请求拦截器
_axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

export default _axios