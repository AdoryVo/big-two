import { Button, Container, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Streetspot"
        description="A platform for citizens to report local infrastructure issues and improve their city."
      />
      <Container p={5}>
        <Heading>Streetspot</Heading>
        <Link href="/reports" passHref>
          <Button colorScheme="blue" mt={5} me={2}>
          Reports
          </Button>
        </Link>
        <Link href="/map" passHref>
          <Button colorScheme="blue" mt={5}>
          Map
          </Button>
        </Link>
      </Container>
    </>
  )
}
