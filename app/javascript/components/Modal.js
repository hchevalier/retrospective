import React from 'react'
import PropTypes from 'prop-types'

const Modal = ({ open, onClose, children }) => {
  if (!open) return null

  const onBackDropClick = () => {
    onClose()
  }
  return (
    <div className="fixed flex items-center h-screen left-0 top-0 w-full z-1">
      <div
        className="bg-black absolute h-screen left-0 opacity-25 top-0 w-full"
        onClick={onBackDropClick} />
      <div className="w-1/2 bg-white mx-auto p-4 rounded z-2 max-h-3/4 overflow-y-auto flex flex-col">{children}</div>
    </div>
  )
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
}

export default Modal
