import fetch from '../utils/fetch'

export function getAllSubject() {
  const obj = '';
  return fetch.get('api/user/subject',obj)
}

export function validateUser(obj) {
  return fetch.post('api/user/validateUser',obj)
}

export function register(obj) {
  return fetch.post('api/user/register',obj)
}

export function login(obj) {
  return fetch.post('api/user/login',obj)
}

export function changePa(obj) {
  return fetch.post('api/user/changePassword',obj)
}

export function getPermission(obj) {
  return fetch.post('api/user/getPermission',obj)
}

export function getAllUser(obj) {
  return fetch.post('api/user/getAllUser',obj)
}

export function updatePermission(obj) {
  return fetch.post('api/user/updatePermission',obj)
}

export function deleteUser(obj) {
  return fetch.post('api/user/deleteUser',obj)
}

export function getUserCount() {
  return fetch.get('api/user/userCount')
}
