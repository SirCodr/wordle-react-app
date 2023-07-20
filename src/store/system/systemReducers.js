export const systemReducers = {
  showKeyboard: (state, action) => {
    state.config.isKeyboardVisible = action.payload ?? true
  }
}