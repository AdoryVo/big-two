import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { Alegreya, Montserrat } from 'next/font/google'
import { DefaultSeo } from 'next-seo'

const alegreya = Alegreya({ subsets: ['latin'] })
const montserrat = Montserrat({ subsets: ['latin'] })

const theme = extendTheme({
  fonts: {
    heading: alegreya.style.fontFamily,
    body: montserrat.style.fontFamily,
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
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
