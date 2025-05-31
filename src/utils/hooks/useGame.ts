import { useRouter } from 'next/router';
import useSWR from 'swr';

import type { GameWithPlayers } from '@utils/prisma';

const getFetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useGame() {
  const router = useRouter();
  const gameId = router.query.gameId;

  const url = gameId ? `/api/${gameId}/game` : null;
  const fetcher = gameId ? getFetcher : null;

  const { data, isLoading, error, mutate } = useSWR<GameWithPlayers>(
    url,
    fetcher,
  );

  return {
    game: data,
    isLoading,
    error,
    mutate,
  };
}
