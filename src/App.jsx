import { COLUMNS_NUMBER } from './config'
import CellsRow from './components/CellsRow'
import { useState } from 'react'

function App() {
  const CATEGORY = 'BANCO'
  const WORD = 'FILA'
  const [activeRowIndex, setActiveRowIndex] = useState(0)
  const [activeColumnIndex, setActiveColumnIndex] = useState(0)
  const [matrixMap, setMatrixMap] = useState(() => {
    return [...Array(COLUMNS_NUMBER).keys()].map(() => {
      return [...Array(WORD.length).keys()].map(() => [])
    })
  })

  const setNextActiveRow = () => {
    setActiveRowIndex(activeRowIndex + 1)
  }

  const handleCellValueChange = (value) => {
    if (!value || value === '') return

    const matrixDrat = [...matrixMap]
    matrixDrat[activeRowIndex][activeColumnIndex].value = value
    setMatrixMap(matrixMap)
    setActiveColumnIndex(prevActiveColumnIndex => {
      const nextActiveIndex = prevActiveColumnIndex + 1
      const diff = (nextActiveIndex) - prevActiveColumnIndex
      if (diff === 1 && nextActiveIndex <= WORD.length - 1) {
        return prevActiveColumnIndex + 1
      }

      return prevActiveColumnIndex
    })
  }

  const changeActiveCell = (newCellIndex) => {
    if (newCellIndex <= WORD.length - 1) {
      setActiveColumnIndex(newCellIndex)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center w-screen h-screen gap-y-2'>
      <>
      <div>
        <h3 className='font-semibold'>{CATEGORY}</h3>
      </div>
      <div className='flex gap-x-3'>
        <h4>
          Row: <span>{activeRowIndex}</span>
        </h4>
        <h4>
          Column: <span>{activeColumnIndex}</span>
        </h4>
      </div>
        {[...Array(COLUMNS_NUMBER).keys()].map((column, index) => {
        return (
          <CellsRow
            word={WORD}
            matrix={matrixMap}
            setMatrixMap={setMatrixMap}
            wordLength={WORD.length}
            activeRowIndex={activeRowIndex}
            isRowActive={activeRowIndex === index}
            activeColumnIndex={activeColumnIndex}
            handleCellValueChange={handleCellValueChange}
            changeActiveCell={changeActiveCell}
            setNextActiveRow={setNextActiveRow}
            rowIndex={index}
            key={index}
          />
        )
      })}
      </>
    </div>
  )
}

export default App
