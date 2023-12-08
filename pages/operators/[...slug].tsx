import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
const Operate = dynamic(() => import("../../components/Operate"));
import Layout from '../../components/Layout';

const Operators = ({ nftea, op}:any) => {
    // console.log(nftea, sellid, seller)
  return (
    <Layout >
      <Operate nftea={nftea} op={op}  />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query;
    const nftea = Array.isArray(slug) ? slug[0] : null;
    const op = Array.isArray(slug) ? slug[1] : null;
    return {
      props: {
        nftea,
        op
      },
    };
  };
  

export default Operators;
