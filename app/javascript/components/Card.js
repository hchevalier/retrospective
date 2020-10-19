import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Button from './Button'

const Card = ({ title, actionDisabled, actionLabel, className, containerClassName, wrapperClassName, onAction, actionLocation, vertical, wrap, center, scrollable, children }) => {
  const footer = actionLabel && actionLocation !== 'header'

  return (
    <div className={
      classNames(
        'px-4 flex flex-col w-full',
        containerClassName
      )}>
      <div className={classNames('flex-grow flex flex-col bg-white border-t border-b shadow', wrapperClassName, { 'overflow-auto': scrollable })}>
        {(title || actionLabel) && (
          <div className='border-b'>
            <div className='flex justify-between px-6 -mb-px flex-no-wrap'>
              <h3 className='text-blue-800 py-4 font-normal text-lg flex'>
                {title}
              </h3>
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
                'flex px-6 py-6 text-gray-800 items-center -mx-4',
                className,
                {
                  'flex-wrap': wrap, 'justify-center': center, 'justify-between': wrap, 'flex-col': vertical, 'border-b': footer,
                  'overflow-y-scroll': vertical
                }
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
  children: PropTypes.node,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  actionDisabled: PropTypes.bool,
  actionLabel: PropTypes.string,
  actionLocation: PropTypes.string,
  onAction: PropTypes.func,
  scrollable: PropTypes.bool,
  title: PropTypes.string,
  vertical: PropTypes.bool,
  wrap: PropTypes.bool
}

export default Card
