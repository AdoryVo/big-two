import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <DefaultSeo
        themeColor="#C6F6D5"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://bigtwo.vercel.app/',
          siteName: 'Big Two',
        }}
        twitter={{
          handle: '@AdoryVo',
          site: '@AdoryVo',
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
