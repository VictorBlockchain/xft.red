import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
const About = dynamic(() => import("../components/About"));
import Layout from '../components/Layout';

const AboutUs = () => {
    return (
        <Layout >
            <About />
        </Layout>
    )
}
export default AboutUs;