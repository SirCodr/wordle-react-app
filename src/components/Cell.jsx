/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'

const Cell = ({
  cellIndex,
  isRowActive,
  isCellActive,
  changeActiveCell,
  completed,
  missLocated,
  notFound,
  onValidation = () => {},
  onChange = () => {}
}) => {
  const [value, setValue] = useState('')
  const buttonRef = useRef()

  const handleSpecialKey = (key) => {
    const SPECIAL_KEYS_ALLOWED = {
      BACKSPACE: 'Backspace',
      ENTER: 'Enter',
      TAB: 'Tab'
    }

    switch (key) {
      case SPECIAL_KEYS_ALLOWED.BACKSPACE:
        setValue('')
        break

      case SPECIAL_KEYS_ALLOWED.ENTER:
        onValidation()
        break

      case SPECIAL_KEYS_ALLOWED.TAB:
        changeActiveCell(cellIndex + 1)
        break
    }
  }

  const handleKeyChange = (event) => {
    const keyValue = event.key?.toUpperCase()

    if (!keyValue) return

    if (keyValue.length > 1 || !keyValue?.match(/[A-Z]/))
      return handleSpecialKey(event.key)

    setValue(keyValue)
    onChange(keyValue)
  }

  useEffect(() => {
    if (isRowActive && isCellActive) {
      buttonRef.current.focus()
    } else {
      buttonRef.current.onkeyup = null
      buttonRef.current.onclick = null
    }

    buttonRef.current.onkeyup = handleKeyChange
    buttonRef.current.onclick = () => {
      changeActiveCell(cellIndex)
    }

    return () => {
      buttonRef.current.onkeyup = null
      buttonRef.current.onclick = null
    }
  }, [isRowActive, isCellActive])

  return (
    <button
      className={`w-10 h-10 border focus:bg-blue-500 focus:text-white
      ${completed && !missLocated && !notFound ? 'bg-green-600' : ''}
      ${completed && missLocated ? 'bg-gray-500' : ''}
      ${completed && notFound ? 'bg-red-500' : ''}`}
      ref={buttonRef}
      disabled={!isRowActive}
    >
      {value}
    </button>
  )
}
export default Cell
