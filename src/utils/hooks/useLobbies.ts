import type { GameWithPlayers, GameWithPlayersResponse } from '@utils/prisma';
import { deserializeGameWithPlayers } from '@utils/prisma';
import useSWR from 'swr';

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json() as Promise<GameWithPlayersResponse[]>)
    .then((games) => games.map(deserializeGameWithPlayers));

export default function useLobbies() {
  const { data, isLoading, error, mutate } = useSWR<GameWithPlayers[]>(
    '/api/lobbies',
    fetcher,
  );

  return {
    lobbies: data,
    isLoading,
    error,
    mutate,
  };
}
