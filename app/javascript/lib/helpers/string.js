export const humanize = (string) => {
  return string
    .replace(/^[\s_]+|[\s_]+$/g, '')
    .replace(/[_\s]+/g, ' ')
    .replace(/^[a-z]/, (char) => char.toUpperCase())
}
