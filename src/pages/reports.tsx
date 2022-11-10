import { GetStaticProps } from 'next'

import prisma from '../lib/prisma'
import { makeSerializable } from '../lib/util'


interface Props {
  feed: Report[]
}

interface Report {
  id: string
}

export default function Reports(props: Props) {
  console.log(props.feed)

  return (
    <>
      {props.feed.map((report) => (
        <div key={report.id}>
          {report.id}
        </div>
      ))}
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