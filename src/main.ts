import van from 'vanjs-core'

import { InfiniteScroll } from './InfiniteScroll'

import { fetchPhotoList } from './api'

// データ取得を終了する限界値
const END = 50
// 一度に取得するデータ数
const LIMIT = 10

const App = () => {
  const { div, h1, img, p } = van.tags

  const PhotoListElement = div({ class: 'photo-list' })
  const start = van.state(0)

  // 無限スクロールで実行される関数
  // 写真のデータを取得して、PhotoListElementに追加する
  const next = async () => {
    const params = {
      _start: `${start.val}`,
      _limit: `${LIMIT}`,
    }

    try {
      // 写真のデータを取得
      const photoList = await fetchPhotoList(params)

      // 取得したデータで、要素の配列を作成
      const photoItems = photoList.map((photo) =>
        div(
          { class: 'photo-item' },
          img({ src: photo.thumbnailUrl, class: 'photo-img' }),
          div(p(photo.id), p(photo.title)),
        ),
      )

      // PhotoListElementに要素を追加してDOMに表示
      van.add(PhotoListElement, photoItems)

      // 次に取得するデータの開始位置を更新
      start.val += photoList.length

      // 取得数がEND未満なら、無限スクロールを続ける
      return start.val < END
    } catch (error) {
      console.error(error)

      // データ取得に失敗したら無限スクロールを終了
      return false
    }
  }

  return div(
    { class: 'container' },
    div(
      { class: 'header' },
      h1('VanJS Infinite Scroll'),
      p('Try scrolling down.'),
    ),
    PhotoListElement,
    // 無限スクロールのコンポーネント
    InfiniteScroll(
      { next, margin: 200 },
      div(
        { class: 'loading' },
        img({ src: 'loading.gif', class: 'loading-img' }),
      ),
    ),
    div({ class: 'footer' }, 'footer'),
  )
}

van.add(document.getElementById('app')!, App())
