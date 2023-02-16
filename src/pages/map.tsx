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

import ReportForm from '../components/ReportForm'
import { parseCoords } from '../lib/util'

const SD_LAT = 32.716
const SD_LNG = -117.161

export default function Map() {
  const router = useRouter()
  const query = router.query

  // Init to San Diego coordinates
  const [lat, setLat] = useState(SD_LAT)
  const [lng, setLng] = useState(SD_LNG)

  // Controls report form modal
  const { isOpen, onOpen, onClose } = useDisclosure()

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

        <Button colorScheme="blue" mt={5} onClick={changeCoords}>
          Change coords back to SD
        </Button>
      </Container>
    </>
  )
}
