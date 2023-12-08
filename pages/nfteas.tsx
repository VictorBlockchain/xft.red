import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
const Nftea = dynamic(() => import("../components/Nftea"));
import Layout from '../components/Layout';

const Nfteas = () => {
    return (
        <Layout>
            <Nftea />
        </Layout>
    )
}
export default Nfteas;