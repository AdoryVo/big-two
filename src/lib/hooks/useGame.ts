import useSWR from 'swr'

interface TempGame {
  players: object[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function useGame(id: string) {
  const {
    data, isLoading, error, mutate,
  } = useSWR<TempGame>(`/api/${id}/game`, fetcher)

  return {
    game: data,
    isLoading,
    error,
    mutate,
  }
}
