import 'styles/index.css'
import 'material-components-web/dist/material-components-web.min.css'
import '@rmwc/select/select.css'
import Head from 'next/head'
import { ThemeProvider } from 'rmwc'
import { PropertyProvider } from 'client'
import { Layout } from 'components'

export default function WaldonApp({ Component, pageProps }) {
  const isLogin = Component && Component.name && Component.name === 'Login'
  return (
    <>
      <Head>
        <title>Waldon</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        ></link>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            
            function getCookie(cname) {
              var name = cname + "=";
              var decodedCookie = decodeURIComponent(document.cookie);
              var ca = decodedCookie.split(';');
              for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                  c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                  return c.substring(name.length, c.length);
                }
              }
              return "";
            } 
            
            if (!getCookie('wpmauth')) {
              if (location.pathname !== '/login')
                window.location.href = '/login'
              }`,
          }}
        />
      </Head>
      <ThemeProvider
        className="mdc-theme--background mdc-typography theme-provider h-screen max-h-screen overflow-hidden"
        options={{
          primary: 'blue',
          secondary: 'red',
          background: '#90A4AE',
          surface: '#ECEFF1',
        }}
      >
        <PropertyProvider>
          {isLogin ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </PropertyProvider>
      </ThemeProvider>
    </>
  )
}
