import { useMediaQuery } from '@chakra-ui/react'

export default function useIsDesktop(): boolean {
  const desktopParams = useMediaQuery(['(min-width: 1024px)', '(min-height: 768px)'])

  return desktopParams.every(param => param)
}
