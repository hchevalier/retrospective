import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const DropDown = ({ allowNew, inline, disableAutocomplete, name, options, initialValue, onItemSelected, onItemAdded, small, ...rest }) => {
  const [inputValue, setInputValue] = React.useState('')
  const [optionsDisplayed, setOptionsDisplayed] = React.useState(false)
  const [selection, setSelection] = React.useState({ value: null, isNewValue: false })

  const inputRef = React.useRef(null)

  const handleInputChange = (event) => {
    if (disableAutocomplete) return
    setInputValue(event.target.value)
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
      setInputValue(options.find((option) => option.value === selection.value)?.label || '')
    } else if (!selection.isNewValue) {
      setInputValue('')
    }
  }

  React.useEffect(() => {
    const label = options.find((option) => option.value === initialValue)?.label || ''
    setInputValue(label)
    setSelection({ value: initialValue, isNewValue: false })
  }, [initialValue, options])

  React.useEffect(() => {
    inputRef.current?.blur()
  }, [selection.value])

  const handleOptionClicked = (event) => {
    const choice = event.currentTarget
    setInputValue(choice.dataset.label)
    setSelection({ value: choice.dataset.value, isNewValue: false })
    setOptionsDisplayed(false)

    onItemSelected && onItemSelected(choice.dataset.value)
  }

  const handleNewItemAdded = (event) => {
    const choice = event.currentTarget
    setInputValue(choice.dataset.label)
    setSelection({ value: null, isNewValue: true })
    setOptionsDisplayed(false)

    onItemAdded && onItemAdded(choice.dataset.label)
  }

  const currentFilter = RegExp(inputValue, 'i')
  let exactMatch = false

  return (
    <div className={classNames('flex-col relative', { flex: !inline, 'inline-flex': inline, 'w-64': !small, 'w-24': small })}>
      <input
        ref={inputRef}
        className={
          classNames(
            'border rounded w-full px-3 leading-tight focus:outline-none focus:shadow-outline',
            { 'py-2': !small, 'py-1': small }
          )
        }
        {...rest}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}/>
      {optionsDisplayed && (
        <div className={classNames('absolute bg-white bg-opacity-100 border mt-8 z-1 p-2', { 'w-64': !small, 'w-24': small })} name={`${name}_dropdown`}>
          {options.filter((option) => disableAutocomplete || option.label.match(currentFilter)).map((option) => {
            if (option.label === inputValue) {
              exactMatch = true
            }
            return <div key={option.value} data-label={option.label} data-value={option.value} onMouseDown={preventBlur} onClick={handleOptionClicked} className='hover:bg-blue-500 cursor-pointer'>{option.label}</div>
          })}
          {allowNew && !exactMatch && inputValue.length > 0 && <div data-label={inputValue} data-value={'new'} onMouseDown={preventBlur} onClick={handleNewItemAdded} className='hover:bg-blue-500 cursor-pointer'>Create group &quot;{inputValue}&quot;</div>}
        </div>
      )}
    </div>
  )
}

DropDown.propTypes = {
  allowNew: PropTypes.bool,
  disableAutocomplete: PropTypes.bool,
  initialValue: PropTypes.string,
  inline: PropTypes.bool,
  name: PropTypes.string,
  onItemAdded: PropTypes.func,
  onItemSelected: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  small: PropTypes.bool
}

export default DropDown
