import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './TooltipToggler.scss'

// Do not use `fixed` with Tooltips in scrollable elements
const TooltipToggler = ({ content, position = 'top', fixed }) => {
  const [visible, setVisible] = useState(false)
  const [inViewport, setInViewport] = useState(true)
  const [offsetTop, setOffsetTop] = useState(0)
  const [offsetLeft, setOffsetLeft] = useState(0)

  const questionMark = React.useRef(null)

  const handleMouseEnter = () => setVisible(true)
  const handleMouseLeave = () => setVisible(false)

  const positionalStyle = {}
  if (fixed) {
    positionalStyle.left = `calc(${offsetLeft}px - 8rem)`
  } else if (position === 'left' ) {
    positionalStyle.right = '-10px'
    positionalStyle.left = 'auto'
  }

  const currentQuestionMark = questionMark?.current

  const handleScroll = useCallback((event) => {
    if (!currentQuestionMark || !fixed) return

    const { top, left, bottom } = currentQuestionMark.getBoundingClientRect()
    setOffsetTop(top + (window.pageYOffset || window.scrollY))
    setOffsetLeft(left + (window.pageXOffset || window.scrollX))

    const realBottom = bottom + (window.pageYOffset || window.scrollY)
    let scrollableParent = event?.currentTarget
    const outOfScrollbleParentViewport = scrollableParent && realBottom <= scrollableParent.getBoundingClientRect().top
    if (outOfScrollbleParentViewport === inViewport) setInViewport(!inViewport)
  }, [inViewport, fixed, currentQuestionMark])

  React.useEffect(() => {
    if (fixed && currentQuestionMark) {
      let node = currentQuestionMark
      while (node && (node.scrollHeight <= node.clientHeight || node.clientHeight < 50)) node = node.parentNode
      node.addEventListener('scroll', handleScroll)
      return () => {
        node.removeEventListener('scroll', handleScroll)
      }
    }
  }, [currentQuestionMark, fixed, handleScroll])

  if (currentQuestionMark) {
    const { top, left } = currentQuestionMark.getBoundingClientRect()
    if (
      (top + (window.pageYOffset || window.scrollY)) !== offsetTop ||
      (left + (window.pageXOffset || window.scrollX)) !== offsetLeft
    ) handleScroll()
  }

  return (
    <>
      <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='text-center inline-flex flex-col justify-end'>
        <span className='inline-block relative w-16px h-18px flex'>
          <span ref={questionMark} className='inline-block w-4 rounded-full bg-gray-800 text-white text-xs'>?</span>
          {visible && inViewport && (
            <>
              <div className='tooltip-arrow border-8 border-solid border-transparent absolute' style={{ top: '10px' }}></div>
              <div className={classNames('my-2 mx-1 w-64 mt-0 z-20', { '-left-32 absolute': !fixed, 'fixed': fixed })} style={{ top: `${offsetTop + 24}px`, ...positionalStyle }}>
                <div className='bg-gray-800 text-white text-xs p-1 rounded-md' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  {content}
                </div>
              </div>
            </>
          )}
        </span>
      </span>
    </>
  )
}

TooltipToggler.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  position: PropTypes.string,
  fixed: PropTypes.bool
}

export default TooltipToggler
