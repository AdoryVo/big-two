import {
  Button, Container, Heading, VStack
} from '@chakra-ui/react'
import { Report as ReportType } from '@prisma/client'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import Report from '../components/Report'
import prisma from '../lib/prisma'
import { makeSerializable } from '../lib/util'

interface ReportsProps {
  feed: ReportType[]
}

export default function Reports(props: ReportsProps) {
  return (
    <>
      <NextSeo
        title="Reports | Streetspot"
        description="Infrastructure reports from local citizens."
      />
      <Container p={5}>
        <Link href="/" passHref>
          <Button colorScheme="facebook" mb={4}>Home</Button>
        </Link>
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
