import Layout from 'components/layout'
import 'styles/index.css'
import { AuthProvider } from 'client/firebase'
import { PropertyProvider } from 'client/data'

function MyApp({ Component, pageProps }) {
  return (
    // <AuthProvider>
    <PropertyProvider>
      {/* <Layout> */}
      <Component {...pageProps} />
      {/* </Layout> */}
    </PropertyProvider>
    // </AuthProvider>
  )
}

export default MyApp
