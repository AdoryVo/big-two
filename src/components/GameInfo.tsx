import { describe, rulesToArray } from '@big-two/Rules';
import {
  Divider,
  Heading,
  ListItem,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
} from '@chakra-ui/react';
import type { GameWithPlayers } from '@utils/prisma';
import { SOLO_GAME_ID } from 'pages/game/singleplayer';
import EditLobby from './EditLobby';

interface Props {
  game: GameWithPlayers;
  handleSingleplayerSubmit?: (body: object) => void;
}

export default function GameInfo({ game, handleSingleplayerSubmit }: Props) {
  return (
    <>
      <Heading size="lg">🏆 Scoreboard</Heading>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Name</Th>
              <Th isNumeric>
                <Tooltip label="* Including current game">Games *</Tooltip>
              </Th>
              <Th isNumeric>Score</Th>
            </Tr>
          </Thead>
          <Tbody>
            {game.players
              .sort((a, b) => b.points - a.points)
              .map((player) => (
                <Tr key={player.id}>
                  <Td>
                    {game.players.findIndex((p) => player.points === p.points) +
                      1}
                  </Td>
                  <Td>{player.name}</Td>
                  <Td isNumeric>{player.games}</Td>
                  <Td isNumeric>{player.points}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Divider my={5} />
      <Heading size="lg" mb={3}>
        📜 Lobby Rules
      </Heading>
      Rules:
      <br />
      <UnorderedList mb={2}>
        {rulesToArray(game.settings.rules).map((rule) => (
          <ListItem key={rule}>{describe(rule)}</ListItem>
        ))}
      </UnorderedList>
      <Tag colorScheme="cyan" me={2}>
        {game.settings.playerMax} Player Lobby
      </Tag>
      {game.settings.spectating ? (
        <Tag colorScheme="green" me={2}>
          Spectating Enabled
        </Tag>
      ) : (
        <Tag colorScheme="red" me={2}>
          Spectating Disabled
        </Tag>
      )}
      <Tag colorScheme="yellow" me={2}>
        {game.settings.deckCount} Deck(s)
      </Tag>
      <br />
      <EditLobby
        game={game}
        handleSubmit={
          game.id === SOLO_GAME_ID ? handleSingleplayerSubmit : undefined
        }
      />
    </>
  );
}
