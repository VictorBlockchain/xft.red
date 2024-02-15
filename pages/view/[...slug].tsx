import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';

// Loading component
const LoadingComponent = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {/* Update the src with your loading GIF path */}      
      <img src="/img/loading.gif" alt="Loading..." width={100} height={100} />
    </div>
  );
};

// Dynamically import the Display component with the loading component
const Display = dynamic(() => import('../../components/Display'), {
  loading: LoadingComponent
});

const View = ({ nftea, sellid, seller }: any) => {
    // console.log(nftea, sellid, seller)
    return (
        <Layout>
            <Display nftea={nftea} sellid={sellid} seller={seller} />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query;
    const nftea = Array.isArray(slug) ? slug[0] : null;
    const sellid = Array.isArray(slug) ? slug[1] : null;
    const seller = Array.isArray(slug) ? slug[2] : null;
    return {
        props: {
            nftea,
            sellid,
            seller
        },
    };
};

export default View;
