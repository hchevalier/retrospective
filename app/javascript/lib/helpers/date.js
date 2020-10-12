export const formatDateWithoutYear = (date) => {
  return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
}
