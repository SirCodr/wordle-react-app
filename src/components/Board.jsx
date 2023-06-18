import { COLUMNS_NUMBER } from "../config"
import CellsRow from "./CellsRow"

const Board = () => {
  return [...Array(COLUMNS_NUMBER).keys()].map((_, index) => {
    return <CellsRow rowIndex={index} key={index} />
  })
}
export default Board
