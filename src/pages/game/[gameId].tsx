import {
  Button,
  Container,
  Heading,
  Link as ChakraLink,
  Text,
  useToast
} from '@chakra-ui/react'
import ky from 'ky'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import ActiveGame from '../../components/ActiveGame'
import WaitingLobby from '../../components/WaitingLobby'
import useGame from '../../lib/hooks/useGame'
import { usePusher } from '../../lib/hooks/usePusher'
import { GameWithPlayers } from '../../lib/prisma'
import { Event } from '../../lib/pusher'

export const enum Action {
  Ping = 'ping',
  Join = 'join',
  Start = 'start',
  End = 'end',
  Pass = 'pass',
  Play = 'play'
}

export interface ActionData {
  name?: string,
  comboToPlay?: string[],
  onClose?: () => void
}

function BasePage({ children }: { children?: React.ReactNode }) {
  return (
    <Container p={5}>
      <Link href="/" passHref>
        <Button colorScheme="facebook" mb={4} me={2}>Home</Button>
      </Link>

      {children}
    </Container>
  )
}

export default function Game() {
  const pusher = usePusher()
  const toast = useToast()

  // calling mutate tells the server to refetch the game state
  const {
    game, isLoading, error, mutate,
  } = useGame()
  const [gameInProgress, setGameInProgress] = useState(false)
  const [playerId, setPlayerId] = useState('')

  useEffect(() => {
    if (isLoading || !game) {
      return
    }

    setGameInProgress(Boolean(game.currentPlayer))

    const storedPlayerId = localStorage.getItem('playerId')
    if (storedPlayerId) {
      if (!game.players.find((player) => player.id === storedPlayerId)) {
        localStorage.removeItem('playerId')
      } else {
        setPlayerId(storedPlayerId)
      }
    }

    const channel = pusher.subscribe(game.id)
    channel.unbind()
    channel.bind(Event.LobbyUpdate, (game: GameWithPlayers) => {
      mutate(game, { revalidate: false })
    })

    channel.bind(Event.StartGame, (game: GameWithPlayers) => {
      setGameInProgress(true)
      mutate(game, { revalidate: false })
    })

    channel.bind(Event.EndGame, (game: GameWithPlayers) => {
      setGameInProgress(false)

      mutate(game, { revalidate: false })
    })

    channel.bind(Event.Pong, () => {
      toast({
        title: 'Pong!',
        status: 'success',
        duration: 1000,
        isClosable: true,
      })
    })
  }, [game, isLoading, pusher, mutate, toast])

  // Handles player actions by sending server requests
  function handleAction(action: Action, data: ActionData = {}) {
    if (!game) {
      return
    }

    const url = `/api/${game.id}/${action}`

    switch (action) {
      case Action.Ping:
        ky.get(url)
        break
      case Action.Join:
        const name = data.name
        if (!name) {
          toast({
            title: 'Error',
            description: 'Please enter a valid name!',
            status: 'error',
            duration: 1000,
          })
          return
        }
        const joinBody = { json: { name } }
        ky.post(url, joinBody).json<GameWithPlayers>().then((game) => {
          const player = game.players.at(-1)
          if (player) {
            localStorage.setItem('playerId', player.id)
            setPlayerId(player.id)
          }
        })
        break
      case Action.Play:
        const playBody = { json: { combo: data.comboToPlay } }
        ky.put(url, playBody).then((response) => {
          console.log(response)
          data.onClose?.()
        }).catch((err) => {
          console.log(err)
          toast({
            title: 'Invalid combination',
            description: 'Invalid with the current combo - try another combo!',
            status: 'error',
            duration: 1000,
          })
        })
        break
      case Action.Pass:
      case Action.Start:
      case Action.End:
        ky.patch(url).catch(() => {
          toast({
            title: 'Error',
            description: 'You cannot pass right now!',
            status: 'error',
            duration: 1000,
          })
        })
        break
    }
  }

  function getPageTitle() {
    if (gameInProgress && game) {
      return `⚔️ ${game.players.length} players`
    } else {
      return '🧍 Waiting for players...'
    }
  }

  function copyGameLink() {
    navigator.clipboard.writeText(window.location.toString())
    toast({
      title: 'Lobby link copied!',
      status: 'success',
      duration: 1500,
      isClosable: true,
    })
  }

  if (isLoading || !game || error) {
    return <>
      <NextSeo title="Lobby | Big Two" description="Join and play!" /><BasePage />
      {error && <Container><Heading>💀 Game could not load!</Heading></Container>}
    </>
  }

  return (
    <>
      <NextSeo
        title={`${getPageTitle()} | Big Two`}
      />
      <BasePage>
        <Heading>Game Lobby</Heading>
        <Text mb={5}>
          <ChakraLink
            onClick={copyGameLink}
            _focus={{ fontStyle: 'italic' }}
            tabIndex={1}
            title="Copy lobby link"
            color="teal.500"
            fontWeight="bold"
          >
            Lobby ID: {game.id} 🔗
          </ChakraLink>
        </Text>

        {gameInProgress ? (
          <ActiveGame game={game} playerId={playerId} handleAction={handleAction} />
        ) : (
          <WaitingLobby game={game} playerId={playerId} handleAction={handleAction} />
        )}
      </BasePage>
    </>
  )
}
