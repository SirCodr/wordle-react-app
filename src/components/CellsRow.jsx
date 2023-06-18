/* eslint-disable react/prop-types */
import { useRef } from 'react'
import Cell from './Cell'
import { useAppSelector } from '../hooks/useApp'

const CellsRow = ({
  rowIndex
}) => {
  const { match: { word } } = useAppSelector(state => state.game)
  const rowContainerRef = useRef()

  return (
    <div className='flex gap-x-2' ref={rowContainerRef}>
      {[...Array(word.length).keys()].map((item, index) => (
        <Cell
          key={index}
          columnIndex={index}
          rowIndex={rowIndex}
        />
      ))}
    </div>
  )
}
export default CellsRow
