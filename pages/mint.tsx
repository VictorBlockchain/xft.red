import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
const Create = dynamic(() => import("../components/Create"));
import Layout from '../components/Layout';

const Mint = () => {
    return (
        <Layout >
            <Create  />
        </Layout>
    )
}
export default Mint;