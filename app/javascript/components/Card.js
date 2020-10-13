import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Button from './Button'

const Card = ({ title, actionLabel, onAction, actionLocation, vertical, wrap, children }) => {
  return (
    <div className='w-full mb-6 px-4 flex flex-col'>
      <div className='flex-grow flex flex-col bg-white border-t border-b shadow'>
        <div className='border-b'>
          <div className='flex justify-between px-6 -mb-px'>
            <h3 className='text-blue-800 py-4 font-normal text-lg'>{title}</h3>
            {actionLabel && actionLocation === 'header' && (
              <div className='self-center'><Button primary contained onClick={onAction}>{actionLabel}</Button></div>
            )}
          </div>
        </div>
        {children && (
          <div className={classNames('flex-grow flex px-6 py-6 text-gray-800 items-center border-b -mx-4', { 'flex-wrap': wrap, 'justify-between': wrap, 'flex-col': vertical  })}>
            {children}
          </div>
        )}
        {actionLabel && actionLocation !== 'header' && (
          <div className='px-6 py-4'>
            <div className='text-center text-grey'>
              <Button primary contained onClick={onAction}>{actionLabel}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  actionLabel: PropTypes.string,
  actionLocation: PropTypes.string,
  onAction: PropTypes.func,
  title: PropTypes.string.isRequired,
  vertical: PropTypes.bool,
  wrap: PropTypes.bool
}

export default Card
