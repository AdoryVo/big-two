import {
  Box, Button, Container, Heading, HStack, Text
} from '@chakra-ui/react'
import type { Report } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { MdPlace, MdThumbDown, MdThumbUp } from 'react-icons/md'

export default function Report({ report }: { report: Report }) {
  return (
    <Container bg="blackAlpha.200" borderRadius="md" p={5}>
      <Heading fontSize="3xl">{report.title}</Heading>
      <Text>Submitted on {new Date(report.createdAt).toLocaleString()}</Text>

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
        <Button leftIcon={<MdThumbUp />} colorScheme="green">
          {report.likes}
        </Button>
        <Button leftIcon={<MdThumbDown />} colorScheme="red">
          {report.dislikes}
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
