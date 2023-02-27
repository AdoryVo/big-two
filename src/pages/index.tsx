import { Button, Container, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Big Two"
        description="card game"
      />
      <Container p={5}>
        <Link href="/socket" passHref>
          <Button colorScheme="blue" mb={4} me={2}>
            Socket Testing
          </Button>
        </Link>
        <Heading>Big Two</Heading>
      </Container>
    </>
  )
}
