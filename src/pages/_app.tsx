import 'styles/index.css'
import Head from 'next/head'
import { PropertyProvider } from 'client'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Waldon</title>
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
      <PropertyProvider>
        <Component {...pageProps} />
      </PropertyProvider>
    </>
  )
}

export default MyApp
