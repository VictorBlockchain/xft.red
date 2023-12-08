import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import 'jquery';
import '../styles/line.css';
import '../styles/icons.css';
import '../styles/fontawesome.min.css';
import '../styles/bootstrap.min.css';
import '../styles/style.css';
import '../styles/globals.css';
import { UserProvider } from '../components/UserContext';
import { MetaMaskProvider } from '@metamask/sdk-react';
import { useSDK } from '@metamask/sdk-react';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const ConnectedComponent = React.memo(Component);
  const [isClient, setIsClient] = useState(false);
  const { sdk, connected, connecting, provider, chainId }:any = useSDK();  
  
  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);
  
  if (!isClient) {
    return null;
  }
  
  return (
    <MetaMaskProvider debug={true} sdkOptions={{
      checkInstallationImmediately: false,
      dappMetadata: {
        name: "African Hyena Pets",
        url: 'http://'+router.asPath,
      }
    }}><UserProvider>
        <ConnectedComponent {...pageProps}/>
      </UserProvider>
    </MetaMaskProvider>
  )

}
export async function getServerSideProps() {
  return {
    props: {},
  };
}
export default MyApp
