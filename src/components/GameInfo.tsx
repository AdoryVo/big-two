import { Divider,
  Heading,
  ListItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from '@chakra-ui/react'

import EditLobby from './EditLobby'

import { describe, rulesToArray } from '@big-two/Rules'
import { type GameWithPlayers } from '@utils/prisma'

interface Props {
  game: GameWithPlayers
  gameInProgress: boolean
}

export default function GameInfo({ game, gameInProgress } : Props) {
  return (
    <>
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
      <EditLobby game={game} />
    </>
  )
}
