import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const CLASSES_FOR_STATUS = {
  wont_do: 'bg-red-200 text-red-700',
  done: 'bg-green-200 text-green-700',
  in_progress: 'bg-blue-200 text-blue-700',
  stuck: 'bg-white text-gray-700',
  todo: 'bg-orange-200 text-orange-700'
}

const Tag = ({ content }) => (
  <div className={classNames('text-xxs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 rounded-full', CLASSES_FOR_STATUS[content])}>
    {content}
  </div>
)

Tag.propTypes = {
  content: PropTypes.string.isRequired
}

export default Tag
