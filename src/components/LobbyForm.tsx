import {
  Checkbox, CheckboxGroup,
  FormControl, FormLabel,
  NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  VStack,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { sum } from 'lodash'
import { useState } from 'react'

import Rules, { ALL_RULES, describe, rulesToArray } from '@big-two/Rules'
import type { GameWithPlayers } from '@utils/prisma'

interface Props {
  game?: GameWithPlayers
  submitForm: (body: object) => void
}

export default function LobbyForm({ game, submitForm }: Props) {
  const defaults = game?.settings ?? {
    rules: Rules.DEFAULT,
    public: false,
    spectating: true,
    playerMax: 4,
  }

  const [rules, setRules] = useState<number[]>(rulesToArray(defaults.rules))

  const formik = useFormik({
    initialValues: {
      public: defaults.public,
      spectating: defaults.spectating,
      playerMax: defaults.playerMax,
    },
    onSubmit: (values) => {
      const body = {
        ...values,
        rules: sum(rules),
      }
      submitForm(body)
    },
  })

  return (
    <form id="lobbyForm" onSubmit={formik.handleSubmit}>
      <FormControl mb={3}>
        <FormLabel fontWeight="bold">Rules</FormLabel>
        <CheckboxGroup
          onChange={(values) => setRules(values.map(Number))}
          value={rules}
          colorScheme="green"
        >
          <VStack alignItems="start">
            {ALL_RULES.map((rule) =>
              <Checkbox key={rule} value={rule} isDisabled={rule === Rules.SUIT_ORDER_ALPHA}>
                {describe(rule)}
              </Checkbox>
            )}
          </VStack>
        </CheckboxGroup>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel fontWeight="bold">Max players</FormLabel>
        <NumberInput
          name="playerMax"
          defaultValue={formik.values.playerMax}
          onChange={(v) => formik.values.playerMax = parseInt(v)}
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
  )
}
