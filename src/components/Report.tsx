import {
  Button, Container, Heading, HStack, Text
} from '@chakra-ui/react'
import { Report as ReportType } from '@prisma/client'
import Link from 'next/link'
import { MdMap, MdThumbDown, MdThumbUp } from 'react-icons/md'

export default function Report({ report }: { report: ReportType }) {
  return (
    <Container bg="blackAlpha.200" borderRadius="md" p={5}>
      <Heading fontSize="3xl">{report.title}</Heading>
      {report.author && <Text>Posted by {report.author}</Text>}
      <Text>Submitted on {new Date(report.createdAt).toLocaleString()}</Text>
      <Text>Category: {report.category}</Text>

      <Text mt={5}>
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
        <Button leftIcon={<MdMap />} colorScheme="blue" mt={5}>
        View in map
        </Button>
      </Link>
    </Container>
  )
}
