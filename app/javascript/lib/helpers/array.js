export const uniq = (items) => items.filter((item, index, array) => array.indexOf(item) === index)

export const uniqBy = (items, attribute) => {
  return items.filter((item, index, array) => firstOccurence(array, attribute, item[attribute]) === index)
}

const firstOccurence = (items, attribute, value) => items.map(item => item[attribute]).indexOf(value)

export const compact = (items) => items.filter((item) => !!item)

export const reject = (items, fn) => items.filter((item) => !fn(item))

const dig = (path, item) => path.reduce((currentDepth, nexAttribute) => {
  return (currentDepth && currentDepth[nexAttribute]) ? currentDepth[nexAttribute] : null
}, item)

export const groupBy = (items, attribute) => {
  return items.reduce((result, item) => {
    const indexBy = dig(attribute.split('.'), item)
    result[indexBy] = result[indexBy] || []
    result[indexBy].push(item)
    return result
  }, {})
}

export const updateArray = (array, newItem, attribute) => {
  return array.map(item => item[attribute] === newItem[attribute] ? newItem : item)
}

export const upsertArray = (array, newItem, attribute) => {
  let arrayChanged = false
  const resultingArray = array.map(item => {
    if (dig(attribute.split('.'), item) === dig(attribute.split('.'), newItem)) {
      arrayChanged = true
      return newItem
    } else {
      return item
    }
  })

  if (arrayChanged) return resultingArray
  return [...resultingArray, newItem]
}
