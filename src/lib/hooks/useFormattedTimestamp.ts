import { useEffect, useState } from 'react'

export function useFormattedTimestamp(date: string | Date) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(
    () => setFormattedDate(new Date(date).toLocaleString()),
    [date]
  )

  return formattedDate
}
