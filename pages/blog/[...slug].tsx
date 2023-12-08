import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import { GetServerSideProps } from 'next';
const Blogs = dynamic(() => import("../../components/Blogs"));
import Layout from '../../components/Layout';

const Blog = ({id}:any) => {
    return (
        <Layout>
            <Blogs id={id} />
        </Layout>
    )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query;
    const id = Array.isArray(slug) ? slug[0] : null;
    return {
      props: {
        id
      },
    };
  };
export default Blog;