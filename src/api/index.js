
import request from "./request"

export const login = data => request({
  url: 'login',
  method: 'post',
  data
})

export const reqGetMenu = () => request({
  url: 'menus',
  method: 'get'
})