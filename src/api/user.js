import fetch from '../utils/fetch'

export function getAllSubject() {
  const TMPURL = '';
  const obj = '';
  return fetch.get(TMPURL+'api/user/subject',obj)
}

export function validateUser(obj) {
  const TMPURL = '';
  return fetch.post(TMPURL+'api/user/validateUser',obj)
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
