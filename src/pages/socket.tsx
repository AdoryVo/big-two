import { Button, Container, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

let socket: Socket

export default function Reports() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    return () => {
      if (!socket) return

      socket.off('connect')
    }
  }, [])

  function handleStartGame() {
    if (!isConnected) {
      setIsConnected(true)

      // Request /api/socket to initialize the socket.io server
      fetch('/api/socket').then(() => {
        socket = io() // Connect to the server

        socket.on('connect', () => {
          console.log(socket.id)
        })
      })
    }
  }

  return (
    <>
      <NextSeo
        title="Socket Testing | Big Two"
      />
      <Container p={5}>
        <Link href="/" passHref>
          <Button colorScheme="facebook" mb={4} me={2}>Home</Button>
        </Link>

        <Heading mb={5}>Socket Testing</Heading>
        <Button onClick={handleStartGame} colorScheme="green" mb={4}>
          Start Game
        </Button>
      </Container>
    </>
  )
}
