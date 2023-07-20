import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './game/gameSlice'
import systemReducer from './system/systemSlice'

export const store = configureStore({
  reducer: {
    game: gameReducer,
    system: systemReducer
  },
})
