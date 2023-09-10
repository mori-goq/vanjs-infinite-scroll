import van from 'vanjs-core'

type Options = {
  // ローディングの位置が画面内に表示されたら実行される関数
  next: () => Promise<Boolean>
  // ローディングが画面下からどれだけ上がったら、画面内に表示されたと判断するかの数値
  margin: number
}

// 無限スクロールのコンポーネント
export const InfiniteScroll = (
  { next, margin = 0 }: Options,
  children: Element,
) => {
  const completed = van.state(false)

  // 対象の要素が画面内に表示されたか監視するAPI
  const observer = new IntersectionObserver(
    async (entries) => {
      // childrenが画面内に表示されているかどうか
      const isVisible = entries[0].isIntersecting

      // 画面外の場合、リターン
      if (!isVisible) {
        observer.observe(children)
        return
      }

      // 監視を終了
      observer.unobserve(children)

      // データを取得して、続けて取得するかどうかの返り値を取得
      const hasMore = await next()

      // 続けて取得する場合は、監視を起動
      if (hasMore) {
        observer.observe(children)
        return
      }

      // InfiniteScrollの返り値をnullにして、無限スクロールをDOMから削除する
      completed.val = true
    },
    { rootMargin: `0px 0px ${margin * -1}px 0px` },
  )

  // childrenが画面内に表示されたか監視する
  observer.observe(children)

  return () => (completed.val ? null : children)
}
