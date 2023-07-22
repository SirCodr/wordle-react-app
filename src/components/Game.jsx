import { useEffect } from 'react'
import { fetchRandomCategory, fetchRandomWordByCategory } from '../services/wordGenerator'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../hooks/useApp'
import { gameActions } from '../store/game/gameSlice'
import Board from './Board'
import useLocalStorage from '../hooks/useLocalStorage'
import { useQuery } from 'react-query'
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import useCell from '../hooks/useCell'

const layout = {
  default: [
    'q w e r t y u i o p Backspace',
    'a s d f g h j k l ñ',
    'Enter z x c v b n m'
  ] }

function Game() {
  const game = useAppSelector(state => state.game)
  const { match: { category: matchCategory, word: matchWord, board: { matrix, activeRow, activeColumn } }, isLoading } = game
  const { config: { isKeyboardVisible } } = useAppSelector(state => state.system)
  const { LOCAL_ITEMS, getLocalItem, setLocalItem } = useLocalStorage()
  const dispatch = useAppDispatch()
  const {  handleKeyChange } = useCell({
    rowIndex: activeRow, columnIndex: activeColumn, activeRow, activeColumn, matrix, matchWord
  })

  const loadMatchCategory = async () => {
    try {
        dispatch(gameActions.setGameLoading(true))
        const response = await fetchRandomCategory()
        if (response) {
          const categoryInResponse = response.data?.choices[0]?.message?.content?.toUpperCase()
          dispatch(gameActions.setCategoryMatch(categoryInResponse))
        } else {
          toast.error('Error on word load')
          console.error('Error on word load')
        }
      } catch (error) {
        toast.error('Error on category load')
        console.error('Error on category load: ', error)
      } finally {
        dispatch(gameActions.setGameLoading(false))
      }
  }

  const hasPrevGameFinished = () => {
    const prevGame = getLocalItem(LOCAL_ITEMS.GAME, true)

    return prevGame?.isFinished ?? true
  }

  const { isLoading: isMatchCategoryLoading, error: matchCategoryError, data: matchCategoryData } = useQuery({
    queryKey: ['matchCategory'],
    queryFn: loadMatchCategory,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: hasPrevGameFinished()
  })

  const resetMatrix = () => {
    dispatch(gameActions.initMatrixBoard())
    dispatch(gameActions.setActiveRow(0))
    dispatch(gameActions.setActiveColumn(0))
  }

  const nextWord = async () => {
    resetMatrix()
    loadMatchWord()
  }

  const loadMatchWord = async () => {
    try {
        dispatch(gameActions.setGameLoading(true))
        const response = await fetchRandomWordByCategory(matchCategory)
        if (response) {
          const wordInResponse = response.data?.choices[0]?.message?.content?.toUpperCase()
          dispatch(gameActions.setWord(wordInResponse))
        } else {
          toast.error('Error on word load')
          console.error('Error on word load')
        }
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
      await loadMatchCategory()
    }
  }

  useEffect(() => {
    if (!hasPrevGameFinished()) {
      const gameFromLocalStorage = getLocalItem('game', true)
      dispatch(gameActions.setGameMatch(gameFromLocalStorage.match))
    }
  }, [])

  useEffect(() => {
    if (matchCategory && matchCategory.length) setLocalItem(LOCAL_ITEMS.GAME, JSON.stringify(game))
  }, [matrix])

  useEffect(() => {
    if (matchCategory && hasPrevGameFinished()) {
      loadMatchWord()
    }
  }, [matchCategory])

  useEffect(() => {
    if (matchWord && matchWord.length && hasPrevGameFinished()) {
      dispatch(gameActions.initMatrixBoard())
    }
  }, [matchWord])

  if (!matrix) return 'Cargando...'

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
            onClick={nextWord}
          >
            Next question
          </button>
        </div>
        {isKeyboardVisible && <Keyboard
        onKeyPress={handleKeyChange}
        layout={layout}
        display={{
          'Backspace': 'Borrar'
        }}
      />}
      </>
    </div>
  )
}

export default Game
