
import request from "./request"

// 用户登录
export const login = data => request({
  url: 'login',
  method: 'post',
  data
})

// 左侧菜单权限
export const reqGetMenu = () => request({
  url: 'menus',
  method: 'get'
})

// 用户数据列表
export const reqGetUserList = params => request({
  url: 'users',
  method: 'get',
  params
})

// 修改用户状态
export const reqUpdateUserState = (uId, type) => request({
  url: `users/${uId}/state/${type}`,
  method: 'put'
})

// 根据 ID 查询用户
export const reqSearchById = id => request({
  url: `users/${id}`,
  method: 'get'
})

// 添加用户
export const reqAddUser = data => request({
  url: 'users',
  method: 'post',
  data
})

// 修改用户
export const reqEditUser = data => {
  const { id } = data
  return request({
    url: `users/${id}`,
    method: 'put',
    data
  })
}

// 删除单个用户
export const reqDeleteUser = id => request({
  url: `users/${id}`,
  method: 'delete'
})

// 所有权限列表
export const reqGetRightsList = type => request({
  url: `rights/${type}`,
  method: 'get'
})

// 角色列表
export const reqGetRolesList = () => request({
  url: 'roles',
  method: 'get'
})

// 删除角色指定权限
export const reqDeleteRightById = (roleId, rightId) => request({
  url: `roles/${roleId}/rights/${rightId}`,
  method: 'delete'
})

// 角色授权
export const reqRoleAuth = (roleId, rids) => request({
  url: `roles/${roleId}/rights`,
  method: 'post',
  data: {
    rids
  }
})

// 分配用户角色
export const reqSetUserRole = ({ userId, roleId }) => request({
  url: `users/${userId}/role`,
  method: 'put',
  data: {
    rid: roleId
  }
})