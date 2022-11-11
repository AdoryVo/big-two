import { Container, Heading, VStack } from '@chakra-ui/react'
import { Report as ReportType } from '@prisma/client'
import { GetStaticProps } from 'next'

import Report from '../components/Report'
import prisma from '../lib/prisma'
import { makeSerializable } from '../lib/util'


interface Props {
  feed: ReportType[]
}

export default function Reports(props: Props) {
  console.log(props.feed)

  return (
    <>
      <Container p={5}>
        <Heading mb={5}>Reports</Heading>
        <VStack spacing={5}>
          {props.feed.map((report) => (
            <Report key={report.id} report={report} />
          ))}
        </VStack>
      </Container>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.report.findMany()
  return {
    props: { feed: makeSerializable(feed) },
    revalidate: 10,
  }
}