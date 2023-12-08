import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
const UserAgreement = dynamic(() => import("../components/UserAgreement"));
import Layout from '../components/Layout';

const Agreement = () => {
    return (
        <Layout >
            <UserAgreement />
        </Layout>
    )
}
export default Agreement;