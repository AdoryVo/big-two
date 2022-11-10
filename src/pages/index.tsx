import { Button, Container, Heading } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Container p={5}>
        <Heading>Streetspot</Heading>
        <Link href="/reports" passHref>
          <Button colorScheme="blue" mt={5}>
          Reports
          </Button>
        </Link>
      </Container>
    </>
  )
}
