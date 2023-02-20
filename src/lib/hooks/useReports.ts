import { type Report } from '@prisma/client'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function useReports() {
  const { data, isLoading, error } = useSWR<Report[]>('/api/reports', fetcher, { refreshInterval: 1000 })

  return {
    reports: data,
    isLoading,
    error,
  }
}
