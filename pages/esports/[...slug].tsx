import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Layout from '../../components/Layout';

// Loading component
const LoadingComponent = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Image src="/img/loading.gif" alt="Loading..." width={100} height={100} />
    </div>
  );
};

// Dynamically import the Grabbit component with the loading component
const Esports = dynamic(() => import('../../components/Esports'), {
  loading: LoadingComponent
});

const View = ({ challenge }:any) => {
  return (
    <Layout>
      <Esports challenge={challenge}/>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  const challenge = Array.isArray(slug) ? slug[0] : null;
  return {
    props: {
      challenge,
    },
  };
};

export default View;
