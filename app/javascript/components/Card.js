import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Button from './Button'

const Card = ({ title, actionDisabled, actionLabel, onAction, actionLocation, vertical, wrap, center, children }) => {
  const footer = actionLabel && actionLocation !== 'header'

  return (
    <div className='w-full mb-6 px-4 flex flex-col'>
      <div className='flex-grow flex flex-col bg-white border-t border-b shadow'>
        {(title || actionLabel) && (
          <div className='border-b'>
            <div className='flex justify-between px-6 -mb-px'>
              <h3 className='text-blue-800 py-4 font-normal text-lg'>{title}</h3>
              {actionLabel && actionLocation === 'header' && (
                <div className='self-center'><Button primary contained disabled={actionDisabled} onClick={onAction}>{actionLabel}</Button></div>
              )}
            </div>
          </div>
        )}
        {children && (
          <div
            className={
              classNames(
                'flex-grow flex px-6 py-6 text-gray-800 items-center -mx-4',
                { 'flex-wrap': wrap, 'justify-center': center, 'justify-between': wrap, 'flex-col': vertical, 'border-b': footer }
              )
            }>
            {children}
          </div>
        )}
        {footer && (
          <div className='px-6 py-4'>
            <div className='text-center text-grey'>
              <Button primary contained disabled={actionDisabled} onClick={onAction}>{actionLabel}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

Card.propTypes = {
  center: PropTypes.bool,
  children: PropTypes.node.isRequired,
  actionDisabled: PropTypes.bool,
  actionLabel: PropTypes.string,
  actionLocation: PropTypes.string,
  onAction: PropTypes.func,
  title: PropTypes.string,
  vertical: PropTypes.bool,
  wrap: PropTypes.bool
}

export default Card
