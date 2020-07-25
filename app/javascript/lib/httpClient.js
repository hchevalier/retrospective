import axios from 'axios'

const csrfToken = document.querySelector('[name=csrf-token]').content
const httpClient = axios.create({
  headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrfToken, 'Accept': 'application/json' },
})

export const get = async ({ url, payload = {}, headers = {} }) => {
  const response = await httpClient.get(url, payload, headers)
  handleErrors(response.data)

  return response.data
}

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

const handleErrors = (data) => {
  if (['unauthorized', 'not_found', 'forbidden', 'unprocessable_entity'].includes(data?.status))
    throw new Error(data.status)
}
