import 'styles/index.css'
import Head from 'next/head'
import { PropertyProvider } from 'client'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Waldon</title>
      </Head>
      <PropertyProvider>
        <Component {...pageProps} />
      </PropertyProvider>
    </>
  )
}

export default MyApp
