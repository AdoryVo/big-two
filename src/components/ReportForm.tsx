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
  ModalHeader,
  Select,
  Textarea
} from '@chakra-ui/react'

export default function ReportForm({ onClose }: { onClose: () => void }) {
  return (
    <ModalContent>
      <ModalHeader>Report an Issue</ModalHeader>
      <ModalCloseButton />

      {/* Modal Body */}
      <ModalBody>
        <FormControl mt={-5} mb={5}>
          <FormHelperText>What&apos;s Wrong?</FormHelperText>
        </FormControl>

        {/* Title input */}
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input placeholder="Ex: Pothole Near Highway 55" />
        </FormControl>

        {/* Description input */}
        <FormControl>
          <FormLabel mt={5}>
            Description
          </FormLabel>
          <Textarea placeholder="Ex: Around 10 cm in diameter..." />
        </FormControl>

        {/* File Input */}
        <FormControl mt={5}>
          <FormLabel>
            Take a Picture
          </FormLabel>

          <input type="file" accept="image/*" />
        </FormControl>

        {/* Category Selection */}
        <FormControl>
          <FormLabel mt={5}>
            Category
          </FormLabel>
          <Select placeholder="Select option">
            <option value="option1">Road</option>
            <option value="option2">Sidewalk</option>
            <option value="option3">Off-Road</option>
          </Select>
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="blue" onClick={onClose}>Submit</Button>
      </ModalFooter>
    </ModalContent>
  )
}
