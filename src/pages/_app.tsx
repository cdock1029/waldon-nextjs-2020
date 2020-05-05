import 'styles/index.css'
import { PropertyProvider } from 'client'

function MyApp({ Component, pageProps }) {
  return (
    <PropertyProvider>
      <Component {...pageProps} />
    </PropertyProvider>
  )
}

export default MyApp
