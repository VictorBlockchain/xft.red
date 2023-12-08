import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
const Grabbit = dynamic(() => import("../../components/Grabbit"));
import Layout from '../../components/Layout';

const View = ({ nftea, sellid, seller }:any) => {
    // console.log(nftea, sellid, seller)
  return (
    <Layout>
      <Grabbit nftea={nftea} sellid={sellid} seller={seller} />
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
