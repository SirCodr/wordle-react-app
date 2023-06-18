const useLocalStorage = () => {
  const LOCAL_ITEMS = {
    GAME: 'game'
  }
  const getLocalItem = (item, isObject = false) => {
    const itemFound = localStorage.getItem(item)

    return isObject ? JSON.parse(itemFound) : itemFound
  }

  const setLocalItem = (item, value) => {
    localStorage.setItem(item, value)
  }

  return {
    LOCAL_ITEMS,
    getLocalItem,
    setLocalItem
  }
}
export default useLocalStorage
