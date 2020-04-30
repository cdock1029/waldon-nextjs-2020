import Layout from 'components/layout'
import 'styles/index.css'
import { useAuth, AuthProvider } from 'data/firebase'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp
