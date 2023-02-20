import {
  Box, Button, Container, Heading, HStack, Skeleton,
  Text
} from '@chakra-ui/react'
import type { Report } from '@prisma/client'
import ky from 'ky'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { MdPlace, MdThumbDown, MdThumbUp } from 'react-icons/md'

import { useFormattedTimestamp } from '../lib/hooks/useFormattedTimestamp'

export default function Report({ report }: { report: Report }) {
  const [likes, setLikes] = useState(report.likes)
  const [dislikes, setDislikes] = useState(report.dislikes)

  function handleLike() {
    ky.post('api/report/like', { json: { id: report.id } })
      .json<Report>()
      .then((updatedReport) => {
        setLikes(updatedReport.likes)
      }).catch((response) => {
        console.log(response)
      })
  }

  function handleDislike() {
    ky.post('api/report/dislike', { json: { id: report.id } })
      .json<Report>()
      .then((updatedReport) => {
        setDislikes(updatedReport.dislikes)
      }).catch((response) => {
        console.log(response)
      })
  }

  return (
    <Container bg="blackAlpha.200" borderRadius="md" p={5}>
      <Heading fontSize="3xl">{report.title}</Heading>
      <Skeleton isLoaded={useFormattedTimestamp(report.createdAt) !== ''} fitContent={true}>
        <Text>Reported at {useFormattedTimestamp(report.createdAt)}</Text>
      </Skeleton>

      {report.image &&
      <Box position="relative" h="64" my={3}>
        <Image
          src={`https://streetspot.s3.amazonaws.com/${report.image}`}
          alt={report.title}
          fill
          sizes="33vw"
        />
      </Box>
      }

      <Text>Category: {report.category}</Text>
      <Text>
        Description:
        <br />
        {report.description}
      </Text>

      <HStack mt={5}>
        <Button leftIcon={<MdThumbUp />} colorScheme="green" onClick={handleLike}>
          {likes}
        </Button>
        <Button leftIcon={<MdThumbDown />} colorScheme="red" onClick={handleDislike}>
          {dislikes}
        </Button>
      </HStack>
      <Link href={`/map?lat=${report.lat}&lng=${report.lng}`} passHref>
        <Button leftIcon={<MdPlace />} colorScheme="blue" mt={5}>
          View in map
        </Button>
      </Link>
    </Container>
  )
}
