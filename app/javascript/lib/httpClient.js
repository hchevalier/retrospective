import axios from 'axios'

const defaultHeaders = {
  'Content-Type': 'application/json'
}

export const post = ({ url, payload = {}, headers = {}}) => {
  const csrfToken = document.querySelector('[name=csrf-token]').content
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken

  return axios.post(url, payload, { ...defaultHeaders, ...headers })
    .then(response => response.data)
    .catch(error => error)
}
