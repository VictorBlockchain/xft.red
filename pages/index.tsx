import dynamic from 'next/dynamic'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Layout from '../components/Layout';
const Start = dynamic(() => import("../components/Start"));


const Home =() => {
  return (
    <Layout >
      <Start   />
    </Layout>
  )
}

export default Home;