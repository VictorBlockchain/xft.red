import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
const PrivacyPolicy = dynamic(() => import("../components/PrivacyPolicy"));
import Layout from '../components/Layout';

const Privacy = () => {
    return (
        <Layout >
            <PrivacyPolicy />
        </Layout>
    )
}
export default Privacy;