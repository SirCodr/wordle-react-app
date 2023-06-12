/* eslint-disable react/prop-types */
import { useRef, useState } from 'react'
import Cell from './Cell'

const CellsRow = ({
  word,
  matrix,
  setMatrixMap,
  wordLength,
  activeRowIndex,
  isRowActive,
  activeColumnIndex,
  changeActiveCell,
  handleCellValueChange,
  setNextActiveRow,
  rowIndex
}) => {
  const rowContainerRef = useRef()

  const handleWordValidation = () => {
    const matrixDraft = [...matrix]
    matrixDraft[activeRowIndex] = matrixDraft[activeRowIndex].map((cell, index) => {
      const isMissLocated = cell.value !== word[index]
      const isNotFound = !word.includes(cell.value)

      return {
        ...cell,
        completed: true,
        missLocated: isMissLocated,
        notFound: isNotFound
      }
    })
    setMatrixMap(matrixDraft)
    setNextActiveRow()
    changeActiveCell(0)
  }

  return (
    <div className='flex gap-x-2' ref={rowContainerRef}>
      {[...Array(wordLength).keys()].map((item, index) => (
        <Cell
          key={index}
          cellIndex={index}
          isRowActive={isRowActive}
          isCellActive={activeColumnIndex === index}
          onValidation={handleWordValidation}
          onChange={handleCellValueChange}
          changeActiveCell={changeActiveCell}
          completed={matrix[rowIndex][index]?.completed}
          missLocated={matrix[rowIndex][index]?.missLocated}
          notFound={matrix[rowIndex][index]?.notFound}
        />
      ))}
    </div>
  )
}
export default CellsRow
