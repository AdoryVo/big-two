import { useMediaQuery } from '@chakra-ui/react'

export default function useIsDesktop(): boolean {
  const desktopParams = useMediaQuery(['(min-width: 72em)', '(min-height: 64em)'])

  return desktopParams.every(param => param)
}
