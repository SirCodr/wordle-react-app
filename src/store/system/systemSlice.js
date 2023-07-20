import { createSlice } from "@reduxjs/toolkit"
import { systemReducers } from "./systemReducers"

const initialState = {
  config: {
    isKeyboardVisible: false
  }
}


export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: systemReducers
})

export const systemActions = systemSlice.actions

export default systemSlice.reducer