import fetch from "../utils/fetch";

export function getQuestionType() {
  return fetch.get('api/question/getQuestionType')
}

export function addChoiceQuestion(obj) {
  return fetch.post('api/question/addChoiceQuestion',obj)
}

export function addOtherQuestion(obj) {
  return fetch.post('api/question/addOtherQuestion',obj)
}

export function getChoiceList(obj) {
  return fetch.post('api/question/getChoiceList',obj)
}

export function getOtherList(obj) {
  return fetch.post('api/question/getOtherList',obj)
}

export function updateChoiceQuestion(obj) {
  return fetch.post('api/question/updateChoiceQuestion',obj)
}

export function updateOtherQuestion(obj) {
  return fetch.post('api/question/updateOtherQuestion',obj)
}

export function deleteOneQuestion(obj) {
  return fetch.post('api/question/deleteOneQuestion',obj)
}

export function getTotal(obj) {
  return fetch.post('api/question/getTotal',obj)
}
