import { createSlice } from '@reduxjs/toolkit'
import { gameReducers } from './gameReducers'

const initialState = {
 match: {
  category: null,
  word: null,
  board: {
    matrix: null,
    activeRow: 0,
    activeColumn: 0
  }
 },
 isLoading: false,
 isFinished: false,
 isSuccessfullyCompleted: false
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: gameReducers,
})

export const gameActions = gameSlice.actions

export default gameSlice.reducer