import Document, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends Document {
  render() {
    return (
      <Html className="no-js" lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/x-icon" href="/cup64.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Alkatra&family=Comfortaa:wght@300;400;500;600&family=Delicious+Handrawn&family=Josefin+Sans:ital,wght@0,300;0,500;0,600;1,500;1,600;1,700&family=Vina+Sans&display=swap"
            rel="stylesheet"
          />
          {/* <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="author" content="ThemeMarch"></meta> */}
          
          <script
            async
            src="/js/isotope.pkg.min.js"
          />
          <script
            async
            src="/js/jquery-3.6.0.min.js"
          />
          {/* <script
            async
            src="/js/main.js"
          /> */}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-5540048YH3"
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  
                  gtag('config', 'G-5540048YH3');
                `,
              }}
            ></script>
        </Head>
        <body>
        {/* <div className="cs-preloader cs-center">
          <div className="cs-preloader_in"></div>
          <span>Loading</span>
        </div> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
