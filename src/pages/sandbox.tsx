import {
  Button, Container, Heading, Input, Text
} from '@chakra-ui/react'
import React from 'react'
import { useEffect, useState } from 'react'

import Game from '../lib/game/Game'
import Rules from '../lib/game/Rules'

export default function Sandbox() {
  const [game, setGame] = useState<Game>()

  const [action, setAction] = useState('')
  const [args, setArgs] = useState('')

  useEffect(() => {
    setGame(new Game(4, Rules.SUIT_ORDER_ALPHA | Rules.STRAIGHTS_WRAP_AROUND | Rules.MUST_PLAY_LOWEST_CARD))
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
        break
      case 'reset':
        game?.reset()
        refreshGame()
      default:
        if (args) console.log('Args:', args)
        break
    }

    console.groupEnd()
  }

  if (!game) return <>Loading...</>

  return (
    <Container maxW="container.lg">
      <Heading>Sandbox</Heading>
      <Text mb={3}>
        Current player: {game.current_player}
        <br />
        Combo: {game.combo && game.util.cards_to_strings(game.combo.cards)}
      </Text>

      Hands:
      {game.players.map((player, index) =>
        <Text key={index} mb={3}>
          Player #{index}
          <br />
          {game.util.cards_to_strings(player.hand).join(', ')}
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
