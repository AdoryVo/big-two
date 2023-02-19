import {
  Button, Container, Heading,
  Modal,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import { MdMyLocation } from 'react-icons/md'

import ReportForm from '../components/ReportForm'
import { type Coords, parseCoords } from '../lib/util'

const SD_COORDS: Coords = { lat: 32.716, lng: -117.161 }
const WATCH_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
}

export default function Map() {
  const router = useRouter()
  const query = router.query

  const [lat, setLat] = useState(SD_COORDS.lat)
  const [lng, setLng] = useState(SD_COORDS.lng)
  const [watchID, setWatchID] = useState(0)

  // Controls report form modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  /** Retrieve the user's location through the browser. */
  function getCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
    } else {
      const id = navigator.geolocation.watchPosition((position) => {
        changeCoords(position.coords)
      }, null, WATCH_OPTIONS)
      setWatchID(id)
    }
  }

  /** Set the map's location to specific coordinates. */
  function changeCoords(coords: Coords | GeolocationCoordinates) {
    if (coords instanceof GeolocationCoordinates) {
      setLat(coords.latitude)
      setLng(coords.longitude)
    }
    else {
      setLat(coords.lat)
      setLng(coords.lng)
    }
  }

  useEffect(() => {
    // Init map to url query coordinates
    const coords = parseCoords(query.lat, query.lng)
    if (coords) {
      changeCoords(coords)
    }

    return () => {
      // Stop watching user's location when unmounting
      if (watchID) {
        navigator.geolocation.clearWatch(watchID)
      }
    }
  }, [query, watchID])

  return (
    <>
      <NextSeo
        title="Map | Streetspot"
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

        <Button colorScheme="facebook" mt={5} onClick={onOpen}>Create Report</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ReportForm onClose={onClose} lat={lat} lng={lng} />
        </Modal>

        <br />

        <Button leftIcon={<MdMyLocation />} colorScheme="purple" mt={5} onClick={getCurrentLocation}>
          Use current location
        </Button>

        <br />

        <Button colorScheme="blue" mt={5} onClick={() => changeCoords(SD_COORDS)}>
          Change coords back to SD
        </Button>
      </Container>
    </>
  )
}
