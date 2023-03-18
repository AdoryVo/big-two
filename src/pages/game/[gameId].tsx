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
  useMediaQuery,
  useToast,
} from '@chakra-ui/react'
import ky from 'ky'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import { describe, rulesToArray } from '@big-two/Rules'
import ActiveGame from '@components/ActiveGame'
import EditLobby from '@components/EditLobby'
import GameInfo from '@components/GameInfo'
import GameInfoModal from '@components/GameInfoModal'
import HomeButton from '@components/HomeButton'
import Preferences from '@components/Preferences'
import WaitingLobby from '@components/WaitingLobby'
import { Action, type ActionData } from '@utils/actions'
import useGame from '@utils/hooks/useGame'
import { usePusher } from '@utils/hooks/usePusher'
import { useTheme } from '@utils/hooks/useTheme'
import { Event } from '@utils/pusher'
import { Theme, getStyles } from '@utils/theme'

interface BaseProps {
  children?: React.ReactNode,
  theme: Theme,
  updateTheme: (update: Theme) => void,
}

function BasePage({ children, theme, updateTheme }: BaseProps) {
  return (
    <Container
      p={5}
      backgroundColor="white"
      borderRadius="lg"
      shadow="md"
      maxW="container.md"
      mt={{ md: '13em' }}
    >
      <HomeButton
        position={{ md: 'absolute' }}
        top={{ md: '1em' }}
        left={{ md: '1em' }}
      />
      <Preferences
        props={{
          position: { md: 'absolute' },
          top: { md: '1em' },
          right: { md: '1em' },
        }}
        theme={theme}
        updateTheme={updateTheme}
      />
      {children}
    </Container>
  )
}

export default function Game() {
  const [isDesktop] = useMediaQuery('(min-width: 48em)')
  const pusher = usePusher()
  const toast = useToast()

  // calling mutate tells the server to refetch the game state
  const {
    game, isLoading, error, mutate,
  } = useGame()
  const [gameInProgress, setGameInProgress] = useState(false)
  const [playerId, setPlayerId] = useState('')

  const [theme, updateTheme] = useTheme()
  const styles = getStyles(theme)

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
      <BasePage theme={theme} updateTheme={updateTheme}>
        {error && <Container><Heading>💀 Game could not load!</Heading></Container>}
      </BasePage>
    </>
  }

  return (
    <Box {...styles.bg} minH="100vh" p={5}>
      <NextSeo
        title={`${getPageTitle()} | Big Two`}
      />
      <BasePage theme={theme} updateTheme={updateTheme}>
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

        {isDesktop ? (
          <GameInfoModal game={game} gameInProgress={gameInProgress} />
        ) : (
          <>
            <Divider my={5} />
            <GameInfo game={game} gameInProgress={gameInProgress} />
          </>
        )}
      </BasePage>
    </Box>
  )
}
