import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { put } from 'lib/httpClient'
import constants from 'lib/utils/constants'
import './ColorPicker.scss'

const ColorPicker = ({ retrospectiveId }) => {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.profile)
  const currentColor = profile.color

  const handleColorPick = React.useCallback((event) => {
    const pickedColor = event.currentTarget.dataset.color
    put({
      url: `/retrospectives/${retrospectiveId}/participants/${profile.uuid}`,
      payload: { color: pickedColor }
    })
    .then(_data => console.log('color changed'))
    .catch(error => console.warn(error))
  }, [])

  return (
    <div id='colors-container'>
      {constants.allColors.map((color, index) => (
        <div
          key={index}
          className='color-square'
          data-color={color}
          style={{ backgroundColor: color }}
          onClick={handleColorPick} />
      ))}
    </div>
  )
}

export default ColorPicker
