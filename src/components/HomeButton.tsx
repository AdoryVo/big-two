import { Button, type ButtonProps } from '@chakra-ui/react'
import Link from 'next/link'

export default function HomeButton(props: ButtonProps) {
  return (
    <Link href="/" passHref>
      <Button colorScheme="facebook" shadow="1px 1px black" mb={4} me={2} {...props}>Home</Button>
    </Link>
  )
}
