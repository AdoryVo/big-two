import {
  Alert, AlertDescription, AlertIcon, AlertTitle,
  Box,
  CloseButton,
} from '@chakra-ui/react'

interface Props {
  title: string
  children?: React.ReactNode,
  onClose: () => void
}

export default function HomeAnnouncement({ title, children, onClose }: Props) {
  return (
    <Alert status="success" variant="left-accent">
      <AlertIcon />
      <Box>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          {children}
        </AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  )
}
