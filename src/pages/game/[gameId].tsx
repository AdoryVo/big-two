import {
  Box,
  Link as ChakraLink,
  Container,
  Divider,
  Heading,
  ListItem,
  Table, TableContainer, Tbody, Td,
  Text,
  Th, Thead, Tr,
  UnorderedList,
  useToast,
} from '@chakra-ui/react'
import ky from 'ky'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import { describe, rulesToArray } from '@big-two/Rules'
import ActiveGame from '@components/ActiveGame'
import EditLobby from '@components/EditLobby'
import HomeButton from '@components/HomeButton'
import Preferences from '@components/Preferences'
import WaitingLobby from '@components/WaitingLobby'
import { Action, type ActionData } from '@utils/actions'
import useGame from '@utils/hooks/useGame'
import { usePusher } from '@utils/hooks/usePusher'
import { Event } from '@utils/pusher'

function BasePage({ children }: { children?: React.ReactNode }) {
  return (
    <Container p={5} backgroundColor="white" borderRadius="lg" maxW="container.md">
      <HomeButton />
      <Preferences />
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

    // If the game refresh is from web socket or spectating, ignore player id logic
    if (!(game.players.every((player) => player.id === '') ||
      game.players.every((player) => player.id !== ''))
    ) {
      // If we are retrieving a player ID, join back in
      const player = game.players.find((player) => player.id)
      if (player) {
        localStorage.setItem('playerId', player.id)
        setPlayerId(player.id)
      }

      const storedPlayerId = localStorage.getItem('playerId')
      if (storedPlayerId) {
        if (!game.players.find((player) => player.id === storedPlayerId)) {
          localStorage.removeItem('playerId')
        } else {
          setPlayerId(storedPlayerId)
        }
      }
    }

    const channel = pusher.subscribe(game.id)
    channel.unbind()
    channel.bind(Event.LobbyUpdate, () => {
      mutate()
    })

    channel.bind(Event.Play, (play: string) => {
      toast({
        title: 'Next turn!',
        description: play,
        status: 'info',
        position: 'top',
        duration: 2500,
        isClosable: true,
      })
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
      if (!name ||
          game.players.find((player) => player.name.toLowerCase() === name.trim().toLowerCase())) {
        toast({
          title: 'Error',
          description: 'Please enter a valid & unique name!',
          status: 'error',
          duration: 1000,
        })
        return
      }
      const joinBody = { json: { name: name.trim() } }
      ky.post(url, joinBody).json<string>().then((playerId) => {
        localStorage.setItem('playerId', playerId)
        setPlayerId(playerId)
      })
      break
    case Action.Leave:
      localStorage.removeItem('playerId')
      setPlayerId('')
      ky.patch(url)
      break
    case Action.Play:
      const playBody = { json: { combo: data.comboToPlay } }
      ky.put(url, playBody).catch(() => {
        toast({
          title: 'Invalid combination',
          description: 'Invalid with the current combo - try another combo!',
          status: 'error',
          position: 'top',
          duration: 2000,
        })
      })
      break
    case Action.Pass:
      ky.patch(url).catch(() => {
        toast({
          title: 'Invalid action',
          description: 'You cannot pass right now!',
          status: 'error',
          duration: 1000,
        })
      })
      break
    case Action.Start:
    case Action.End:
      ky.patch(url)
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
      <NextSeo title="Lobby | Big Two" description="Join and play!" />
      <BasePage>
        {error && <Container><Heading>💀 Game could not load!</Heading></Container>}
      </BasePage>
    </>
  }

  return (
    <Box backgroundColor="green.100" minH="100vh" p={5}>
      <NextSeo
        title={`${getPageTitle()} | Big Two`}
      />
      <BasePage>
        <Heading>Game Lobby</Heading>
        <Text mb={5}>
          <ChakraLink
            onClick={copyGameLink}
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

        <Divider my={5} />

        <Heading size="lg">🏆 Scoreboard</Heading>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Rank</Th>
                <Th>Name</Th>
                <Th isNumeric>Games</Th>
                <Th isNumeric>Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              {game.players.sort((a, b) => b.points - a.points).map((player, index) =>
                <Tr key={index}>
                  <Td>{game.players.findIndex((p) => player.points === p.points) + 1}</Td>
                  <Td>{player.name}</Td>
                  <Td isNumeric>#</Td>
                  <Td isNumeric>{player.points}</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>

        <Divider my={5} />

        <Heading size="lg" mb={3}>📜 Lobby Rules</Heading>
        Max players: {game.settings.playerMax}
        <br />
        Spectating: {game.settings.spectating ? 'On' : 'Off'}
        <br />
        Rules:
        <br />
        <UnorderedList>
          {rulesToArray(game.settings.rules).map((rule) =>
            <ListItem key={rule}>{describe(rule)}</ListItem>
          )}
        </UnorderedList>
        {!gameInProgress &&
          <EditLobby game={game} />
        }
      </BasePage>
    </Box>
  )
}
