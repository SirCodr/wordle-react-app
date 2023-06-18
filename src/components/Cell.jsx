/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import { useAppSelector } from '../hooks/useApp'
import useCell from '../hooks/useCell'

const Cell = ({
  columnIndex,
  rowIndex
}) => {
  const { match: { word : matchWord, board: { matrix, activeRow, activeColumn } } } = useAppSelector(state => state.game)
  const {
    isRowActive,
    isColumnActive,
    cell,
    changeActiveCell,
    handleKeyChange
  } = useCell({
    rowIndex, columnIndex, activeRow, activeColumn, matrix, matchWord
  })
  const buttonRef = useRef()

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
  }, [matrix, isRowActive, isColumnActive])

  return (
    <button
      className={`w-10 h-10 border focus:bg-blue-500 focus:text-white
      ${cell.wellLocated ? 'bg-green-600' : ''}
      ${cell.wellLocated === false ? 'bg-gray-500' : ''}
      ${cell.found === false ? 'bg-red-500' : ''}`}
      ref={buttonRef}
      disabled={!isRowActive}
    >
      {cell.value}
    </button>
  )
}
export default Cell
