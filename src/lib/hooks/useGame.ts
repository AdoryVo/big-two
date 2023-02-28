import useSWR from 'swr'

import type { TempGame } from '../../pages/api/[gameId]/game'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function useGame(id: string) {
  const { data, isLoading, error } = useSWR<TempGame>(`/api/${id}/game`, fetcher)

  return {
    game: data,
    isLoading,
    error,
  }
}
