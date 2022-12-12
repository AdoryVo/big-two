import { Button, Container, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

const SD_LAT = 32.716
const SD_LNG = -117.161

function parseCoords(
  lat: string | string[] | undefined,
  lng: string | string[] | undefined
): [number, number] | undefined {
  // Coordinates should be strings
  if (typeof lat !== 'string' || typeof lng !== 'string') {
    return undefined
  }

  const coords: [number, number] = [parseFloat(lat), parseFloat(lng)]

  // Coordinates must be valid numbers
  if (!coords.every(isFinite)) return undefined

  // Lat must be in [-90, 90], lng must be in [-180, 180)
  if (coords[0] < -90 || coords[0] > 90) return undefined
  if (coords[1] < -180 || coords[1] >= 180) return undefined

  return coords
}

export default function Map() {
  const router = useRouter()
  const query = router.query

  // Init to San Diego coordinates
  const [lat, setLat] = useState(SD_LAT)
  const [lng, setLng] = useState(SD_LNG)

  useEffect(() => {
    // Init to url query coordinates
    const coords = parseCoords(query.lat, query.lng)
    if (coords) {
      setLat(coords[0])
      setLng(coords[1])
    }
  }, [query])

  function changeCoords() {
    const [newLat, newLng] = [SD_LAT, SD_LNG]

    setLat(newLat)
    setLng(newLng)
  }

  return (
    <>
      <NextSeo
        title="Map - Streetspot"
        description="Report local infrastructure issues to raise awareness and improve your city."
      />
      <Container p={5}>
        <Link href="/" passHref>
          <Button colorScheme="facebook" mb={4} me={2}>Home</Button>
        </Link>

        <Link href="/reports" passHref>
          <Button colorScheme="blue" mb={4}>
          Reports
          </Button>
        </Link>
        <Heading>Map</Heading>
        <p>
          Coords: ({lat}, {lng})
        </p>
        <Button colorScheme="blue" mt={5} onClick={changeCoords}>
          Change coords back to SD
        </Button>
      </Container>
    </>
  )
}
