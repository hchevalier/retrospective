import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const CLASSES_FOR_STATUS = {
  wont_do: 'bg-red-200 text-red-700 border-red-700',
  done: 'bg-green-200 text-green-700 border-green-700',
  in_progress: 'bg-blue-200 text-blue-700 border-blue-700',
  on_hold: 'bg-white text-gray-700 border-gray-700',
  todo: 'bg-orange-200 text-orange-700 border-orange-700'
}

const Tag = ({ content, selectable, selected, onClick }) => (
  <div className={
    classNames(
      'text-xxs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full ml-2',
      CLASSES_FOR_STATUS[content],
      { 'cursor-pointer': selectable, 'border-2 font-extrabold': selected }
    )}
    onClick={onClick}>
    {content.replace(/_/g, ' ').replace(/wont/, "won't")}
  </div>
)

Tag.propTypes = {
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  selectable: PropTypes.bool,
  selected: PropTypes.bool
}

export default Tag
