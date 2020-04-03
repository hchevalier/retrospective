export const uniq = (items) => items.filter((item, index, array) => array.indexOf(item) === index)

export const uniqBy = (items, attribute) => {
  return items.filter((item, index, array) => firstOccurence(array, attribute, item[attribute]) === index)
}

const firstOccurence = (items, attribute, value) => items.map(item => item[attribute]).indexOf(value)

export const compact = (items) => items.filter((item) => !!item)

export const reject = (items, fn) => items.filter((item) => !fn(item))
