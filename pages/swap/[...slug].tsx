import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import { GetServerSideProps } from 'next';
const Swaper = dynamic(() => import("../../components/Swap"));
import Layout from '../../components/Layout';

const Swap = ({tokenin, tokenout}:any) => {
    return (
        <Layout >
            <Swaper  tokenin={tokenin} toikenout={tokenout}/>
        </Layout>
    )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query;
    const tokenin = Array.isArray(slug) ? slug[0] : null;
    const tokenout = Array.isArray(slug) ? slug[1] : null;
    return {
      props: {
        tokenin,
        tokenout
      },
    };
  };
export default Swap;