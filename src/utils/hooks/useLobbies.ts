import useSWR from 'swr';

import type { GameWithPlayers } from '@utils/prisma';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useLobbies() {
  const { data, isLoading, error } = useSWR<GameWithPlayers[]>(
    '/api/lobbies',
    fetcher,
    { refreshInterval: 1000 },
  );

  return {
    lobbies: data,
    isLoading,
    error,
  };
}
