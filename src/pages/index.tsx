import { Button, Container, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { MdMyLocation } from 'react-icons/md'

export default function Home() {
  const router = useRouter()

  /** Get the user's location and redirect them to the map. */
  function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        router.push({
          pathname: '/map',
          query: { lat: position.coords.latitude, lng: position.coords.longitude },
        })
      })
    }
  }

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

        <br />

        <Button leftIcon={<MdMyLocation />} colorScheme="facebook" mt={5} onClick={getCurrentLocation}>
          Use current location
        </Button>
      </Container>
    </>
  )
}
