import Rules, {
  ALL_RULE_SETS,
  ALL_RULES,
  describe,
  rulesToArray,
} from '@big-two/Rules';
import { SUIT_RANKING_ORDERS } from '@big-two/Util';
import {
  Badge,
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
import type { GameWithPlayers } from '@utils/prisma';
import { useFormik } from 'formik';
import { sum } from 'lodash';
import { useState } from 'react';

interface Props {
  game?: GameWithPlayers;
  submitForm: (body: object) => void;
}

const SUIT_ORDER_BITS = sum(
  // Note: Don't directly pass in parseInt as the map() function
  // to prevent passing in `index` to the `radix` argument.
  Object.keys(SUIT_RANKING_ORDERS).map((bitAsStr) => Number.parseInt(bitAsStr)),
);

export default function LobbyForm({ game, submitForm }: Props) {
  const defaults = game?.settings ?? {
    // In this form, suit order is tracked separately than other rules.
    rules: Rules.DEFAULT & ~SUIT_ORDER_BITS,
    public: false,
    spectating: true,
    playerMax: 4,
    deckCount: 1,
  };

  const [ruleSetKey, setRuleSetKey] = useState(Object.keys(ALL_RULE_SETS)[0]);
  // Capture existing suit order or default to alpha.
  const [suitOrder, setSuitOrder] = useState(
    `${defaults.rules & SUIT_ORDER_BITS || Rules.SUIT_ORDER_ALPHA}`,
  );
  // In this form, suit order is tracked separately than other rules.
  const [rules, setRules] = useState<number[]>(
    rulesToArray(defaults.rules & ~SUIT_ORDER_BITS),
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
        rules: sum(rules) + Number.parseInt(suitOrder),
      };
      submitForm(body);
    },
  });

  function handleRuleSetKeyChange(ruleSetKey: string) {
    const ruleSet = ALL_RULE_SETS[ruleSetKey];

    setSuitOrder(`${ruleSet.rules & SUIT_ORDER_BITS}`);
    // The rules variable should not have suit order bits, as suitOrder tracks this.
    setRules(rulesToArray(ruleSet.rules & ~SUIT_ORDER_BITS));
    setRuleSetKey(ruleSetKey);
  }

  return (
    // biome-ignore lint/nursery/useUniqueElementIds: exact id needed for submit button in parent element
    <form id="lobbyForm" onSubmit={formik.handleSubmit}>
      <FormControl mb={3}>
        <FormLabel fontWeight="bold" fontSize="lg">
          Rules
        </FormLabel>

        <FormLabel>
          Rule sets
          <Badge variant="solid" bgColor="blue.300" ms={2} rounded="md">
            🎉 New 🎉
          </Badge>
        </FormLabel>

        <RadioGroup
          onChange={handleRuleSetKeyChange}
          value={ruleSetKey}
          colorScheme="blue"
        >
          <VStack alignItems="start">
            {Object.keys(ALL_RULE_SETS).map((ruleSetKey) => (
              <Radio key={ruleSetKey} value={ruleSetKey}>
                {ALL_RULE_SETS[ruleSetKey].name}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>

        <Divider my={2} />

        <FormLabel>Suit orders</FormLabel>

        <RadioGroup
          onChange={setSuitOrder}
          value={suitOrder}
          colorScheme="purple"
        >
          <VStack alignItems="start">
            {ALL_RULES.slice(0, Object.keys(SUIT_RANKING_ORDERS).length).map(
              (suit_order) => (
                <Radio key={suit_order} value={`${suit_order}`}>
                  {describe(suit_order)}
                </Radio>
              ),
            )}
          </VStack>
        </RadioGroup>

        <Divider my={2} />

        <FormLabel>Custom rules</FormLabel>

        <CheckboxGroup
          onChange={(values) => setRules(values.map(Number))}
          value={rules}
          colorScheme="green"
        >
          <VStack alignItems="start">
            {ALL_RULES.slice(Object.keys(SUIT_RANKING_ORDERS).length).map(
              (rule) => (
                <Checkbox key={rule} value={rule}>
                  {describe(rule)}
                  {[
                    Rules.POKER_HAND_COMBOS,
                    Rules.NO_BOMBS,
                    Rules.FLUSH_RANK_BY_SUIT,
                  ].includes(rule) && (
                    <Badge
                      variant="solid"
                      bgColor="blue.300"
                      ms={2}
                      rounded="md"
                    >
                      🎉 New 🎉
                    </Badge>
                  )}
                </Checkbox>
              ),
            )}
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
            onChange={(v) =>
              formik.setFieldValue('playerMax', Number.parseInt(v))
            }
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
            onChange={(v) =>
              formik.setFieldValue('deckCount', Number.parseInt(v))
            }
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
