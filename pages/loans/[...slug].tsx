import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import { GetServerSideProps } from 'next';
const Loan = dynamic(() => import("../../components/Loan"));
import Layout from '../../components/Layout';

const Loans = ({nftea}:any) => {
    return (
        <Layout>
            <Loan nftea={nftea} />
        </Layout>
    )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query;
    const nftea = Array.isArray(slug) ? slug[0] : null;
    return {
      props: {
        nftea
      },
    };
  };
export default Loans;