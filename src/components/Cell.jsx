/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/useApp'
import { gameActions } from '../store/game/gameSlice'

const Cell = ({
  columnIndex,
  rowIndex
}) => {
  const { match: { word : matchWord, board: { matrix, activeRow, activeColumn } } } = useAppSelector(state => state.game)
  const isRowActive = useMemo(() => rowIndex === activeRow, [activeRow, rowIndex])
  const isColumnActive = useMemo(() => columnIndex === activeColumn, [activeColumn, columnIndex])
  const cell = useMemo(() => matrix[rowIndex][columnIndex], [matrix, rowIndex, columnIndex])
  const dispatch = useAppDispatch()
  const [value, setValue] = useState('')
  const buttonRef = useRef()

  const handleWordValidation = () => {
    dispatch(gameActions.validateWord())
  }

  const changeActiveCell = (newCellIndex) => {
    if (newCellIndex <= matchWord.length - 1 && newCellIndex >= 0) {
      dispatch(gameActions.setActiveColumn(newCellIndex))
    }
  }

  const handleSpecialKey = (key) => {
    const SPECIAL_KEYS_ALLOWED = {
      SPACE: ' ',
      BACKSPACE: 'Backspace',
      ENTER: 'Enter'
    }

    switch (key) {
      case SPECIAL_KEYS_ALLOWED.BACKSPACE:
        setValue('')
        changeActiveCell(columnIndex - 1)  
        break

      case SPECIAL_KEYS_ALLOWED.ENTER:
        handleWordValidation()
        break

      case SPECIAL_KEYS_ALLOWED.SPACE:
        changeActiveCell(columnIndex + 1)
        break
    }
  }

  const handleKeyChange = (event) => {
    const keyValue = event.key?.toUpperCase()

    if (!keyValue) return

    if (keyValue.length > 1 || !keyValue?.match(/[A-Z]/))
      return handleSpecialKey(event.key)

    setValue(keyValue)
  }

  const handleCellValueChange = (value) => {
    if (!value || value === '') return

    dispatch(
      gameActions.setPlayInMatrixCell({
        row: activeRow,
        column: activeColumn,
        value
      })
    )
    const newColumnIndex = () => {
      const nextActiveIndex = activeColumn + 1
      const diff = nextActiveIndex - activeColumn
      if (diff === 1 && nextActiveIndex <= matchWord.length - 1) {
        return activeColumn + 1
      }

      return activeColumn
    }
    dispatch(gameActions.setActiveColumn(newColumnIndex()))
  }

  useEffect(() => {
    if (isRowActive && isColumnActive) {
      buttonRef.current.focus()
    } else {
      buttonRef.current.onkeyup = null
      buttonRef.current.onclick = null
    }

    buttonRef.current.onkeyup = handleKeyChange
    buttonRef.current.onclick = () => {
      changeActiveCell(columnIndex)
    }

    return () => {
      buttonRef.current.onkeyup = null
      buttonRef.current.onclick = null
    }
  }, [isRowActive, isColumnActive])

  useEffect(() => {
    handleCellValueChange(value)
  }, [value])

  return (
    <button
      className={`w-10 h-10 border focus:bg-blue-500 focus:text-white
      ${cell.wellLocated ? 'bg-green-600' : ''}
      ${cell.wellLocated === false ? 'bg-gray-500' : ''}
      ${cell.found === false ? 'bg-red-500' : ''}`}
      ref={buttonRef}
      disabled={!isRowActive}
    >
      {value}
    </button>
  )
}
export default Cell
