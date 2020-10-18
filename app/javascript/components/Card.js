import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Button from './Button'
import ArrowIcon from 'images/arrow-icon-black.svg'

const Card = ({ title, actionDisabled, actionLabel, className, containerClassName, onAction, actionLocation, vertical, wrap, center, scrollable, collapsible, onToggleCollapse, children }) => {
  const [colapsed, setColapsed] = useState(false)

  const toggleColapsed = () => {
    setColapsed(!colapsed)
    onToggleCollapse()
  }

  const footer = actionLabel && actionLocation !== 'header'
  return (
    <div className={classNames('w-full px-4 flex flex-col', containerClassName)}>
      <div className={classNames('flex-grow flex flex-col bg-white border-t border-b shadow', { 'overflow-scroll': scrollable })}>
        {(title || actionLabel) && (
          <div className='border-b'>
            <div className='flex justify-between px-6 -mb-px'>
              <h3 className='text-blue-800 py-4 font-normal text-lg flex' onClick={toggleColapsed}>
                {collapsible && (
                  <img
                    className={
                      classNames(
                        'cursor-pointer duration-200 ease-in-out transition-transform transform rotate-0 mr-1',
                        { '-rotate-180': colapsed }
                      )
                    }
                    src={ArrowIcon}
                    onClick={onToggleCollapse}
                    width="12" />
                )}
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
                'flex px-6 text-gray-800 items-center -mx-4',
                className,
                {
                  'flex-wrap': wrap, 'justify-center': center, 'justify-between': wrap, 'flex-col': vertical, 'border-b': footer,
                  'transition-height transition-flex duration-500 ease-in-out flex-none flex-grow-0 h-0 overflow-y-scroll py-0': collapsible,
                  'py-6 flex-grow': !collapsible,
                  'flex-1 flex-grow expanded': (collapsible && !colapsed)
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
  collapsible: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  actionDisabled: PropTypes.bool,
  actionLabel: PropTypes.string,
  actionLocation: PropTypes.string,
  onAction: PropTypes.func,
  onToggleCollapse: PropTypes.func,
  scrollable: PropTypes.bool,
  title: PropTypes.string,
  vertical: PropTypes.bool,
  wrap: PropTypes.bool
}

export default Card
