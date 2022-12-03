
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const _axios = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 2000
})

// 请求拦截器
_axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  // 进度条开始
  NProgress.start()
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
_axios.interceptors.response.use(response => {
  // 进度条结束
  NProgress.done()
  return response
}, error => {
  return Promise.reject(error)
})

export default _axios