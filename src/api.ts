import axios from 'axios'

import type { Photo } from './types'

const URL = 'https://jsonplaceholder.typicode.com/photos'

type Params = {
  _start: string
  _limit: string
}

// APIで写真のJSONデータを取得
export const fetchPhotoList = async (params: Params) => {
  // ローディングが分かりやすいように、１秒待つ
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const searchParams = new URLSearchParams(params)

  const endpoint = `${URL}?${searchParams}`

  const response = await axios.get<Photo[]>(endpoint)

  const photoList = response.data

  return photoList
}
