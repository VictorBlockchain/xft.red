import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import { GetServerSideProps } from 'next';
const Profile = dynamic(() => import("../../components/Profile"));
import Layout from '../../components/Layout';

const User = ({creator}:any) => {
    return (
        <Layout>
            <Profile  creator={creator}  />
        </Layout>
    )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query;
    const creator = Array.isArray(slug) ? slug[0] : null;
    return {
      props: {
        creator
      },
    };
  };
export default User;