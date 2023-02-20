import {
  Button, Container, Heading, VStack
} from '@chakra-ui/react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import Report from '../components/Report'
import useReports from '../lib/hooks/useReports'

export default function Reports() {
  const { reports, error } = useReports()

  if (error) return <div>Failed to load the page...</div>

  return (
    <>
      <NextSeo
        title="Reports | Streetspot"
        description="Infrastructure reports from local citizens."
      />
      <Container p={5}>
        <Link href="/" passHref>
          <Button colorScheme="facebook" mb={4} me={2}>Home</Button>
        </Link>
        <Link href="/map" passHref>
          <Button colorScheme="blue" mb={4}>
            Map
          </Button>
        </Link>
        <Heading mb={5}>Reports</Heading>
        <VStack spacing={5}>
          {reports && reports.map((report) => (
            <Report key={report.id + new Date().toISOString()} report={report} />
          ))}
        </VStack>
      </Container>
    </>
  )
}
