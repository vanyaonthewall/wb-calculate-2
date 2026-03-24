// Шина событий для координации попапов.
// Гарантирует что одновременно открыт только один попап.
type CloseHandler = () => void
const handlers = new Set<CloseHandler>()

/** Зарегистрировать обработчик закрытия. Возвращает функцию отмены регистрации. */
export function registerPopup(close: CloseHandler): () => void {
  handlers.add(close)
  return () => handlers.delete(close)
}

/** Закрыть все попапы кроме переданного. */
export function closeOtherPopups(except: CloseHandler): void {
  handlers.forEach(h => { if (h !== except) h() })
}
