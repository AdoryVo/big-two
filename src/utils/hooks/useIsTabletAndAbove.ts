import { useMediaQuery } from '@chakra-ui/react'

export default function useIsTabletAndAbove(): boolean {
  const mediaParams = useMediaQuery(['(min-width: 768px)'])

  return mediaParams.every(param => param)
}
