
import request from "./request"

export const login = data => request({
  url: 'login',
  method: 'post',
  data
})