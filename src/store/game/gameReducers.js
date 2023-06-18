import { COLUMNS_NUMBER } from '../../config'

export const gameReducers = {
  setCategoryMatch: (state, action) => {
    state.match.category = action.payload
  },
  setWord: (state, action) => {
    state.match.word = action.payload
  },
  initMatrixBoard: (state) => {
    if (state.match.word) {
      state.match.board.matrix = [...Array(COLUMNS_NUMBER).keys()].map(() => {
        return [...Array(state.match.word.length).keys()].map(() => (
          {
            value: '',
            wellLocated: null,
            found: null
          }
        ))
      })
    }
  },
  setPlayInMatrixCell: (state, action) => {
    const { row, column, value } = action.payload
    if (row !== null && column !== null) {
      state.match.board.matrix[row][column].value = value
    }
  },
  setActiveRow: (state, action) => {
    state.match.board.activeRow = action.payload
  },
  setActiveColumn: (state, action) => {
    state.match.board.activeColumn = action.payload
  },
  setGameLoading: (state, action) => {
    state.isLoading = action.payload
  },
  validateWord: (state) => {
    const {
      word,
      board: { matrix, activeRow }
    } = state.match
    let lettersSuccessfullyFound = 0
    state.match.board.matrix[activeRow] = matrix[activeRow].map(
      (cell, index) => {
        const isWellLocated = cell.value === word[index]
        const found = word.includes(cell.value)

        if (found) lettersSuccessfullyFound++

        return {
          ...cell,
          wellLocated: isWellLocated,
          found
        }
      }
    )
    if (lettersSuccessfullyFound === word.length) {
      state.isFinished = true
      state.isSuccessfullyCompleted = true
    }

    if (activeRow + 1 <= word.length - 1) {
      state.match.board.activeRow = activeRow + 1
      state.match.board.activeColumn = 0
    }

    if (lettersSuccessfullyFound !== word.length && activeRow + 1 >= word.length - 1) {
      state.isFinished = true
      state.isSuccessfullyCompleted = false
    }
  }
}
