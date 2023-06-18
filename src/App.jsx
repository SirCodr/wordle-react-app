import { useEffect } from 'react'
import { fetchRandomWordByCategory } from './services/wordGenerator'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from './hooks/useApp'
import { gameActions } from './store/game/gameSlice'
import Board from './components/Board'
import useLocalStorage from './hooks/useLocalStorage'

function App() {
  const game = useAppSelector(state => state.game)
  const { match: { category: matchCategory, word: matchWord, board: { matrix, activeRow, activeColumn } }, isLoading } = game
  const { LOCAL_ITEMS, getLocalItem, setLocalItem } = useLocalStorage()
  const dispatch = useAppDispatch()

  const resetMatrix = () => {
    dispatch(gameActions.initMatrixBoard())
    dispatch(gameActions.setActiveRow(0))
    dispatch(gameActions.setActiveColumn(0))
  }

  const loadMatchCategory = () => {
    try {
        dispatch(gameActions.setGameLoading(true))
        dispatch(gameActions.setCategoryMatch('Colegio'))
      } catch (error) {
        toast.error('Error on category load')
        console.error('Error on category load: ', error)
      } finally {
        dispatch(gameActions.setGameLoading(false))
      }
  }

  const loadMatchWord = async () => {
    try {
        dispatch(gameActions.setGameLoading(true))
        // const response = await fetchRandomWordByCategory(matchCategory)
        // if (response) dispatch(gameActions.setWord(response.toUpperCase()))
        dispatch(gameActions.setWord('TABLA'))
      } catch (error) {
        toast.error('Error on word load')
        console.error('Error on word load: ', error)
      } finally {
        dispatch(gameActions.setGameLoading(false))
      }
  }

  const initGame = async () => {
    const gameInLocalStorage = getLocalItem(LOCAL_ITEMS.GAME, true)

    if (gameInLocalStorage && gameInLocalStorage.match.word) {
      dispatch(gameActions.setWord(gameInLocalStorage.match.word))
    } else {
      loadMatchCategory()
      await loadMatchWord()
    }
  }

  // useEffect(() => {
  //   if (game.match.word) {
  //     setLocalItem(LOCAL_ITEMS.GAME, JSON.stringify(game))
  //   }
  // }, [game])

  useEffect(() => {
    if (matchWord && matchWord.length) {
      dispatch(gameActions.initMatrixBoard())
    }
  }, [matchWord])

  useEffect(() => {
    if (!isLoading) initGame()
  }, [])

  if (!matchWord || !matchWord.length || !matrix || !matrix.length) return 'Cargando...'

  return (
    <div className='flex flex-col justify-center items-center w-screen h-screen gap-y-2'>
      <>
        <div>
          <h3 className='font-semibold'>{matchCategory}</h3>
        </div>
        <div className='flex gap-x-3'>
          <h4>
            Row: <span>{activeRow}</span>
          </h4>
          <h4>
            Column: <span>{activeColumn}</span>
          </h4>
        </div>
        <Board />
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
