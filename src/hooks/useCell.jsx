import { useMemo } from 'react'
import { useAppDispatch } from './useApp'
import { gameActions } from '../store/game/gameSlice'
import { toast } from 'react-toastify'

const useCell = ({
  rowIndex,
  columnIndex,
  activeRow,
  activeColumn,
  matrix,
  matchWord
}) => {
  const isRowActive = useMemo(
    () => rowIndex === activeRow,
    [activeRow, rowIndex]
  )
  const isColumnActive = useMemo(
    () => columnIndex === activeColumn,
    [activeColumn, columnIndex]
  )

  const cell = useMemo(
    () => matrix && matrix.length ? matrix[rowIndex][columnIndex] : null,
    [matrix, rowIndex, columnIndex]
  )

  const dispatch = useAppDispatch()

  const handleWordValidation = () => {
    const allLettersSetted = matrix[activeRow].every(item => item.value.trim() !== '')
    
    if (!allLettersSetted) return toast.warn('Complete all letters')

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
        handleCellValueChange('')
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

  const handleKeyChange = (keyValue) => {
    if (!keyValue) return

    const keyValueUpperCase = keyValue?.toUpperCase()
    if (keyValueUpperCase.length > 1 || !keyValueUpperCase?.match(/[A-Z]/))
      return handleSpecialKey(keyValue)

    handleCellValueChange(keyValueUpperCase)
  }

  const handleCellValueChange = (value) => {
    dispatch(
      gameActions.setPlayInMatrixCell({
        row: rowIndex,
        column: columnIndex,
        value
      })
    )
    if (!value || value === '') return false

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

  return {
    isRowActive,
    isColumnActive,
    cell,
    handleWordValidation,
    changeActiveCell,
    handleSpecialKey,
    handleKeyChange,
    handleCellValueChange
  }
}
export default useCell
