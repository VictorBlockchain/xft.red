// Wallets.tsx
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import Layout from '../components/Layout'

const Admins = dynamic(() => import("../components/Admins"));

const Admin = () => {
  return (
    <Layout >
      <Admins  />
    </Layout>
  )
}

export default Admin;
