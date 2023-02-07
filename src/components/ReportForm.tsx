import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@chakra-ui/react'

export default function ReportForm() {
  return (
    <ModalContent>
      <ModalHeader>Report an Issue</ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        <FormControl>
          <FormLabel>input</FormLabel>
          <Input  />
          <FormHelperText>helper text</FormHelperText>
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue">Submit</Button>
      </ModalFooter>
    </ModalContent>
  )
}
