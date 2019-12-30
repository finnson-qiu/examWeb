import fetch from "../utils/fetch";

export function getAllSubject() {
  return fetch.get('api/subject/getSubject')
}

export function getSubjectList(obj) {
  return fetch.post('api/subject/getSubList',obj)
}

export function getSubjectCount() {
  return fetch.get('api/subject/getSubjectCount')
}

export function addSubject(obj) {
  return fetch.post('api/subject/addSubject',obj)
}

export function updateSubject(obj) {
  return fetch.post('api/subject/updateSubject',obj)
}

export function deleteSubject(obj) {
  return fetch.post('api/subject/deleteSubject',obj)
}
