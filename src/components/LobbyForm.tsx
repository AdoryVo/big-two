import {
  Box,
  Checkbox,
  CheckboxGroup,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  VStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { sum } from 'lodash';
import { useState } from 'react';

import Rules, { ALL_RULES, describe, rulesToArray } from '@big-two/Rules';
import type { GameWithPlayers } from '@utils/prisma';

interface Props {
  game?: GameWithPlayers;
  submitForm: (body: object) => void;
}

export default function LobbyForm({ game, submitForm }: Props) {
  const defaults = game?.settings ?? {
    rules: Rules.DEFAULT,
    public: false,
    spectating: true,
    playerMax: 4,
    deckCount: 1,
  };

  const [suitOrder, setSuitOrder] = useState(
    `${defaults.rules & Rules.SUIT_ORDER_ALPHA}`,
  );
  const [rules, setRules] = useState<number[]>(
    rulesToArray(defaults.rules & ~Rules.SUIT_ORDER_ALPHA),
  );

  const formik = useFormik({
    initialValues: {
      public: defaults.public,
      spectating: defaults.spectating,
      playerMax: defaults.playerMax,
      deckCount: 1,
    },
    onSubmit: (values) => {
      const body = {
        ...values,
        rules: sum(rules) + parseInt(suitOrder),
      };
      submitForm(body);
    },
  });

  return (
    <form id="lobbyForm" onSubmit={formik.handleSubmit}>
      <FormControl mb={3}>
        <FormLabel fontWeight="bold">Rules</FormLabel>
        <RadioGroup
          onChange={setSuitOrder}
          value={suitOrder}
          colorScheme="purple"
        >
          <VStack alignItems="start">
            {ALL_RULES.slice(0, 2).map((suit_order) => (
              <Radio key={suit_order} value={`${suit_order}`}>
                {describe(suit_order)}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>

        <Divider my={2} />

        <CheckboxGroup
          onChange={(values) => setRules(values.map(Number))}
          value={rules}
          colorScheme="green"
        >
          <VStack alignItems="start">
            {ALL_RULES.slice(2).map((rule) => (
              <Checkbox key={rule} value={rule}>
                {describe(rule)}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </FormControl>

      <Flex gap={8}>
        <FormControl width="auto" mb={4}>
          <FormLabel fontWeight="bold" whiteSpace="nowrap">
            Max players
          </FormLabel>
          <NumberInput
            name="playerMax"
            defaultValue={formik.values.playerMax}
            onChange={(v) => formik.setFieldValue('playerMax', parseInt(v))}
            min={2}
            maxW={20}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl flexGrow={1} mb={4}>
          <FormLabel fontWeight="bold">Number of decks</FormLabel>
          <NumberInput
            name="deckCount"
            defaultValue={formik.values.deckCount}
            onChange={(v) => formik.setFieldValue('deckCount', parseInt(v))}
            min={1}
            maxW={20}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Box fontSize="sm">
            <b>
              Note: For multiple decks, with the "Must play lowest card" rule,
            </b>{' '}
            all lowest cards must be played in the round's first combos.
          </Box>
        </FormControl>
      </Flex>

      <b>Permissions</b>
      <FormControl mb={2}>
        <Checkbox
          name="spectating"
          onChange={formik.handleChange}
          isChecked={formik.values.spectating}
          colorScheme="blue"
        >
          Allow spectating
        </Checkbox>
      </FormControl>

      <FormControl>
        <Checkbox
          name="public"
          onChange={formik.handleChange}
          isChecked={formik.values.public}
          colorScheme="blue"
        >
          Public lobby
        </Checkbox>
      </FormControl>
    </form>
  );
}
