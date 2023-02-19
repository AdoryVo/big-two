import {
  Box, Button, Container, Heading, HStack, Text
} from '@chakra-ui/react'
import type { Report } from '@prisma/client'
import ky from 'ky'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { MdPlace, MdThumbDown, MdThumbUp } from 'react-icons/md'

export default function Report({ report }: { report: Report }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  function handleLike() {
    setIsLiked(!isLiked)
    ky.post('api/report/like', { json: { id: report.id, isLiked: !isLiked } }).json().then((response) => {
      console.log(response)
    })
  }

  function handleDislike() {
    setIsDisliked(!isDisliked)
    ky.post('api/report/dislike', { json: { id: report.id, isDisliked: !isDisliked } })
  }

  return (
    <Container bg="blackAlpha.200" borderRadius="md" p={5}>
      <Heading fontSize="3xl">{report.title}</Heading>
      {/* <Text>Submitted on {new Date(report.createdAt).toLocaleString()}</Text> */}

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
          {report.likes + ((isLiked) ? 1 : 0)}
        </Button>
        <Button leftIcon={<MdThumbDown />} colorScheme="red" onClick={handleDislike}>
          {report.dislikes + ((isDisliked) ? 1 : 0)}
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
