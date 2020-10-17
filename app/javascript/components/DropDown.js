import React from 'react'
import PropTypes from 'prop-types'

const DropDown = ({ allowNew, name, options, onItemSelected, onItemAdded, ...rest }) => {
  const [value, setValue] = React.useState('')
  const [optionsDisplayed, setOptionsDisplayed] = React.useState(false)
  const [selection, setSelection] = React.useState({ value: null, isNewValue: false })

  const inputRef = React.useRef(null)

  const handleInputChange = (event) => {
    setValue(event.target.value)
  }

  const handleFocus = () => {
    setOptionsDisplayed(true)
  }

  const preventBlur = (event) => {
    event.preventDefault()
  }

  const handleBlur = () => {
    setOptionsDisplayed(false)

    if (selection.value) {
      setValue(options.find((option) => option.value === selection.value)?.label || '')
    } else if (!selection.isNewValue) {
      setValue('')
    }
  }

  React.useEffect(() => {
    inputRef.current?.blur()
  }, [selection.value])

  const handleOptionClicked = (event) => {
    const choice = event.currentTarget
    setValue(choice.dataset.label)
    setSelection({ value: choice.dataset.value, isNewValue: false })
    setOptionsDisplayed(false)

    onItemSelected && onItemSelected(choice.dataset.value)
  }

  const handleNewItemAdded = (event) => {
    const choice = event.currentTarget
    setValue(choice.dataset.label)
    setSelection({ value: null, isNewValue: true })
    setOptionsDisplayed(false)

    onItemAdded && onItemAdded(choice.dataset.label)
  }

  const currentFilter = RegExp(value, 'i')
  let exactMatch = false

  return (
    <div className='flex flex-col w-64 relative'>
      <input ref={inputRef} className="border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" {...rest} name={name} value={value} onChange={handleInputChange} onFocus={handleFocus} onBlur={handleBlur}/>
      {optionsDisplayed && (
        <div className='absolute bg-white bg-opacity-100 border mt-8 w-64 z-1 p-2' name={`${name}_dropdown`}>
          {options.filter((option) => option.label.match(currentFilter)).map((option) => {
            if (option.label === value) {
              exactMatch = true
            }
            return <div key={option.value} data-label={option.label} data-value={option.value} onMouseDown={preventBlur} onClick={handleOptionClicked} className='hover:bg-blue-500 cursor-pointer'>{option.label}</div>
          })}
          {allowNew && !exactMatch && value.length > 0 && <div data-label={value} data-value={'new'} onMouseDown={preventBlur} onClick={handleNewItemAdded} className='hover:bg-blue-500 cursor-pointer'>Create group &quot;{value}&quot;</div>}
        </div>
      )}
    </div>
  )
}

DropDown.propTypes = {
  allowNew: PropTypes.bool,
  name: PropTypes.string,
  onItemAdded: PropTypes.func,
  onItemSelected: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
}

export default DropDown
