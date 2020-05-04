import axios from 'axios'

const csrfToken = document.querySelector('[name=csrf-token]').content
const httpClient = axios.create({
  headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken },
})

export const post = async ({ url, payload = {}, headers = {} }) => {
  const response = await httpClient.post(url, payload, headers)
  return response.data
}

export const put = async ({ url, payload = {}, headers = {} }) => {
  const response = await httpClient.put(url, payload, headers)
  return response.data
}

export const destroy = async ({ url, payload = {}, headers = {} }) => {
  const response = await httpClient.delete(url, payload, headers)
  return response.data
}
