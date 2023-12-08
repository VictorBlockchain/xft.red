import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import { GetServerSideProps } from 'next';
const Label = dynamic(() => import("../../components/Label"));
import Layout from '../../components/Layout';

const Search = ({label}:any) => {
    return (
        <Layout >
            <Label  label={label}/>
        </Layout>
    )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query;
    const label = Array.isArray(slug) ? slug[0] : null;
    return {
      props: {
        label
      },
    };
  };
export default Search;