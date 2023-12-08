// Wallets.tsx
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import Layout from '../components/Layout'

const Wallets = dynamic(() => import("../components/Wallets"));

const Wallet = () => {
  return (
    <Layout >
      <Wallets  />
    </Layout>
  )
}

export default Wallet
