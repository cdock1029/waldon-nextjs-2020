import 'styles/index.css'
import Head from 'next/head'
import { PropertyProvider } from 'client'
import { Layout } from 'components'

const isLogin = (Comp) => Comp.displayName && Comp.displayName === 'Login'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Waldon</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `function getCookie(o){for(var n=o+"=",t=decodeURIComponent(document.cookie).split(";"),e=0;e<t.length;e++){for(var i=t[e];" "==i.charAt(0);)i=i.substring(1);if(0==i.indexOf(n))return i.substring(n.length,i.length)}return""}getCookie("wpmauth")||"/login"!==location.pathname&&(window.location.href="/login");`,
          }}
        />
      </Head>
      {isLogin(Component) ? (
        <Component {...pageProps} />
      ) : (
        <PropertyProvider>
          <Layout properties={pageProps.properties}>
            <Component {...pageProps} />
          </Layout>
        </PropertyProvider>
      )}
    </>
  )
}

export default MyApp
