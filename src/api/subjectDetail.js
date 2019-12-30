import fetch from "../utils/fetch";

export function addKnowPoint(obj) {
  return fetch.post('api/subjectDetail/addKnowPoint',obj)
}

export function getKPointList(obj) {
  return fetch.post('api/subjectDetail/getKPointList',obj)
}

export function getAllKPoint(obj) {
  return fetch.post('api/subjectDetail/getAllKPoint',obj)
}

export function getTotal(obj) {
  return fetch.post('api/subjectDetail/getTotal',obj)
}

export function deleteOneKPoint(obj) {
  return fetch.post('api/subjectDetail/deleteOneKPoint',obj)
}

export function updateOneKPoint(obj) {
  return fetch.post('api/subjectDetail/updateOneKPoint',obj)
}
