import {
  Button, Container, Heading, Input, Text, useToast,
} from '@chakra-ui/react'
import ky from 'ky'
import React from 'react'
import { useEffect, useState } from 'react'

import Game from '@big-two/Game'
import Rules from '@big-two/Rules'
import HomeButton from '@components/HomeButton'

export default function Sandbox() {
  const toast = useToast()

  const [game, setGame] = useState<Game>()

  const [action, setAction] = useState('')
  const [args, setArgs] = useState('')

  useEffect(() => {
    setGame(new Game(2, Rules.SUIT_ORDER_ALPHA | Rules.STRAIGHTS_WRAP_AROUND | Rules.MUST_PLAY_LOWEST_CARD))
  }, [])

  /**
   * Tell React to re-render `game` values - needed because it cannot
   * sense changes from Game methods like reset()
   */
  function refreshGame() {
    if (game) {
      setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game))
    }
  }

  function handleAction() {
    console.group(action)

    switch (action) {
      case 'play':
        game?.play(args ? args.split(' ') : [])
        refreshGame()
        break
      case 'reset':
        game?.reset()
        refreshGame()
        break
      case 'pass':
        game?.pass()
        refreshGame()
        break
      case 'clear-lobbies':
        ky.delete('/api/lobbies').then(() => {
          toast({
            title: 'Expired lobbies cleared!',
            status: 'success',
            duration: 2000,
          })
        }).catch((err) => {
          toast({
            title: 'Error!',
            description: `${err.response.statusText}`,
            status: 'error',
            duration: 2000,
          })
        })
      default:
        if (args) console.log('Args:', args)
        break
    }

    console.groupEnd()
  }

  if (!game) return <>Loading...</>

  return (
    <Container maxW="container.lg">
      <HomeButton mt={2} />

      <Heading>Sandbox</Heading>
      <Text mb={3}>
        Current player: {game.current_player}
        <br />
        Remaining players: {game.remaining_players.join(' ')}
        <br />
        Last playmaker: {game.last_playmaker}
        <br />
        Backup: {game.backup_next}
        <br />
        Combo: {game.combo && game.util.cards_to_strings(game.combo.cards).join(' ')}
      </Text>

      Hands:
      {game.players.map((player, index) =>
        <Text key={index} mb={3}>
          Player #{index}
          <br />
          {game.util.cards_to_strings(player.hand).join(' ')}
        </Text>
      )}

      <hr />
      <Input
        placeholder="Action"
        onChange={(e) => setAction(e.target.value)}
        mt={5}
      />
      <Input
        placeholder="Args"
        onChange={(e) => setArgs(e.target.value)}
        my={5}
      />
      <Button onClick={handleAction}>
        Perform action
      </Button>
    </Container>
  )
}
