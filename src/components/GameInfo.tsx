import { describe, rulesToArray } from '@big-two/Rules';
import {
  Box,
  Button,
  Divider,
  Heading,
  ListItem,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
} from '@chakra-ui/react';
import { Action, type ActionData } from '@utils/actions';
import type { GameWithPlayers } from '@utils/prisma';
import { SOLO_GAME_ID } from 'pages/game/singleplayer';
import EditLobby from './EditLobby';

interface Props {
  game: GameWithPlayers;
  handleSingleplayerSubmit?: (body: object) => void;
  handleAction?: (action: Action, data?: ActionData) => void;
  playerId?: string;
}

export default function GameInfo({
  game,
  handleSingleplayerSubmit,
  handleAction,
  playerId,
}: Props) {
  const thisPlayer = game.players.find((p) => playerId && p.id === playerId);
  const isUnfinished = thisPlayer && thisPlayer.finishedRank === 0;
  const hasVoted = thisPlayer && game.earlyEndVotes.includes(thisPlayer.index);
  const remainingPlayers = game.players.filter((p) => p.finishedRank === 0);
  const votesNeeded = Math.floor(remainingPlayers.length / 2) + 1;
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
      {handleAction && game.id !== SOLO_GAME_ID && game.currentPlayer && (
        <Box mt={4}>
          <Divider mb={4} />
          <Text fontSize="sm" mb={2}>
            Vote to end the current game early. Unfinished players will be
            ranked by remaining cards.
          </Text>
          <Button
            colorScheme="pink"
            size="sm"
            isDisabled={!isUnfinished || hasVoted}
            onClick={() => handleAction(Action.VoteEnd)}
          >
            {hasVoted
              ? 'Already voted'
              : !isUnfinished
                ? 'Only active players can vote'
                : '🏳️ Vote to end early'}
          </Button>
          {game.earlyEndVotes.length > 0 && (
            <Text fontSize="sm" mt={2} color="gray.600">
              {game.earlyEndVotes.length}/{votesNeeded} votes to end early
            </Text>
          )}
        </Box>
      )}
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
