import fetch from "../utils/fetch";

export function genePaper() {
  return fetch.get('api/paper/genePaper')
}
