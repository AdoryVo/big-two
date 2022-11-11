import {
  Button, Container, Heading, HStack, Text
} from '@chakra-ui/react'
import { Report as ReportType } from '@prisma/client'
import { MdThumbDown, MdThumbUp } from 'react-icons/md'

export default function Report({ report }: { report: ReportType }) {
  return (
    <Container bg="background" borderRadius="md" p={5}>
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
    </Container>
  )
}