import { COLUMNS_NUMBER } from './config'
import CellsRow from './components/CellsRow'
import { useEffect, useState } from 'react'
import { fetchRandomWordByCategory } from './services/wordGenerator'
import { toast } from 'react-toastify'

function App() {
  const CATEGORY = 'BANCO'
  const [word, setWord] = useState('')
  const [activeRowIndex, setActiveRowIndex] = useState(0)
  const [activeColumnIndex, setActiveColumnIndex] = useState(0)
  const initialMatrixMap = [...Array(COLUMNS_NUMBER).keys()].map(() => {
    return [...Array(word.length).keys()].map(() => [
      {
        value: '',
        completed: null,
        missLocated: null,
        notFound: null
      }
    ])
  })
  const [matrixMap, setMatrixMap] = useState([])
  const [isLoading, setLoading] = useState(false)

  const setNextActiveRow = () => {
    setActiveRowIndex(activeRowIndex + 1)
  }

  const handleCellValueChange = (value) => {
    if (!value || value === '') return

    const matrixDrat = [...matrixMap]
    matrixDrat[activeRowIndex][activeColumnIndex].value = value
    setMatrixMap(matrixMap)
    setActiveColumnIndex((prevActiveColumnIndex) => {
      const nextActiveIndex = prevActiveColumnIndex + 1
      const diff = nextActiveIndex - prevActiveColumnIndex
      if (diff === 1 && nextActiveIndex <= word.length - 1) {
        return prevActiveColumnIndex + 1
      }

      return prevActiveColumnIndex
    })
  }

  const changeActiveCell = (newCellIndex) => {
    if (newCellIndex <= word.length - 1 && newCellIndex >= 0) {
      setActiveColumnIndex(newCellIndex)
    }
  }

  const resetMatrix = () => setMatrixMap(initialMatrixMap)

  useEffect(() => {
    if (word && word.length) {
      const newMatrix = [...Array(COLUMNS_NUMBER).keys()].map(() => {
        return [...Array(word.length).keys()].map(() => [{
          value: '',
          completed: null,
          missLocated: null,
          notFound: null
        }])
      })
      setMatrixMap(newMatrix)
    }
  }, [word])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const response = await fetchRandomWordByCategory()
        if (response) setWord(response.toUpperCase())
      } catch (error) {
        toast.error('Error on word load')
        console.error('Error on word load: ', error)
      } finally {
        setLoading(false)
      }
    }
    if (!isLoading) load()
  }, [])

  if (!word || !word.length || !matrixMap || !matrixMap.length) return 'Cargando...'

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
              word={word}
              matrix={matrixMap}
              setMatrixMap={setMatrixMap}
              wordLength={word.length}
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
        <div>
          <button
            type='button'
            className='text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'
            onClick={resetMatrix}
          >
            Reset
          </button>
        </div>
      </>
    </div>
  )
}

export default App
