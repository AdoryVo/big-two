import {
  Box, Button, Container, Heading, Input, Link as ChakraLink,
  ListItem, OrderedList,
  Text, useToast
} from '@chakra-ui/react'
import ky from 'ky'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useCallback, useEffect, useState } from 'react'

import useGame from '../../lib/hooks/useGame'
import { usePusher } from '../../lib/hooks/usePusher'
import type { Player } from '../api/[gameId]/join'

export default function Game() {
  const router = useRouter()
  const pusher = usePusher()
  const toast = useToast()

  /** mutate: tells server to refetch the game state */
  const { game, isLoading, mutate } = useGame(String(router.query.gameId))
  const [gameId, setGameId] = useState('') // UUID
  const [gameInProgress, setGameInProgress] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])

  const [name, setName] = useState('')
  const [playerId, setPlayerId] = useState(-1)

  const joinLobby = useCallback(joinLobbyCallback, [pusher, players, toast, mutate])

  useEffect(() => {
    // Do not act until game id in query is loaded
    if (!router.query.gameId) {
      return
    }

    const gameInProgress = Boolean(game && game.players && game.players.length > 0)
    setGameInProgress(gameInProgress)

    const storedPlayerId = localStorage.getItem('playerId')
    if (storedPlayerId && gameInProgress) {
      setPlayerId(parseInt(storedPlayerId))
    }

    joinLobby(String(router.query.gameId))
  }, [game, router.query.gameId, joinLobby])

  function joinLobbyCallback(gameId: string) {
    setGameId(gameId)

    const channel = pusher.subscribe(gameId)
    channel.bind('new-player', (data: { player: Player }) => {
      setPlayers([...players, data.player])
    })

    channel.bind('start-game', (data: { players: object[] }) => {
      setGameInProgress(true)
      mutate(data)
    })

    channel.bind('end-game', () => {
      setPlayerId(-1)
      localStorage.removeItem('playerId')

      mutate()
    })

    channel.bind('pong', (data: { message: string }) => {
      console.log(data)
      toast({
        title: 'Pong!',
        status: 'success',
        duration: 1000,
        isClosable: true,
      })
    })
  }

  function handleStartGame() {
    ky.post(`/api/${gameId}/start`, { json: { players } })
  }

  function handleEndGame() {
    ky.get(`/api/${gameId}/end`)
  }

  function handleJoinLobby() {
    // Set player id and send it to the server to store
    setPlayerId(players.length)
    localStorage.setItem('playerId', players.length.toString())

    ky.post(`/api/${gameId}/join`, { json: { name } })
  }

  function handlePingGame() {
    ky.get(`/api/${gameId}/ping`)
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
  }

  return (
    <>
      <NextSeo
        title={`${getPageTitle()} | Big Two`}
      />
      <Container maxW="container.sm" p={5}>
        <Link href="/" passHref>
          <Button colorScheme="facebook" mb={4} me={2}>Home</Button>
        </Link>

        <Heading>Game Lobby</Heading>
        <Text mb={5}>
          <ChakraLink color="teal.500" fontWeight="bold" onClick={copyGameLink} title="Copy lobby link">
            📋 Lobby ID: {gameId}
          </ChakraLink>
        </Text>

        {
          (gameInProgress && game) && (
            <>
              {/* Game Container */}
              {!isLoading && game.players[playerId] &&
              <Box my={5} py={2}>
                {JSON.stringify(game.players[playerId])}
              </Box>
              }
              {(playerId < 0 || playerId >= game.players.length) &&
                <Box my={5} py={2}>
                  <Heading size="md">Spectating...</Heading>
                  {game.players.map((player, index) => (
                    <Box key={index} mb={5}>
                      <Heading size="sm">Hand {index}</Heading>
                      {JSON.stringify(player)}
                    </Box>
                  ))}
                </Box>
              }
              <Button onClick={handleEndGame} colorScheme="red" mb={4} me={2}>
                End Game
              </Button>
            </>
          )
        }
        {
          (game && game.players && game.players.length === 0) && (
            <>
              {/* Game Lobby Controls */}
              <Button onClick={handleStartGame} colorScheme="green" mb={4} me={2}>
                Start Game
              </Button>
              <Button onClick={handlePingGame} colorScheme="purple" mb={4}>
                Ping game channel
              </Button>

              <Heading size="lg">Current players</Heading>
              {!players.length && 'No players currently, join in!'}
              <OrderedList mb={5}>
                {
                  players.map((player, index) => (
                    <ListItem key={index} fontWeight={index === playerId ? 'bold' : ''}>{player.name}</ListItem>
                  ))
                }
              </OrderedList>
              {
                playerId === -1 && (
                  <>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" w="75%" me={2} />
                    <Button onClick={handleJoinLobby} colorScheme="blue" mt={2}>
                      Join Next Game
                    </Button>
                  </>
                )
              }
            </>
          )
        }
      </Container>
    </>
  )
}
