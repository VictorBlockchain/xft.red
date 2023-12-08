import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import {create as ipfsHttpClient}  from "ipfs-http-client";
import moment from 'moment';
import axios from "axios";
import { BigNumber } from 'bignumber.js';
import { setWalletProvider, servActivate,servActivatePrice,servPrice,servMint,servOperator,servLabel,servFlames,servNFT2Label, servNFT,servBag,servContract2Label,servWrap,servURI,servApproveWrapper,servWrapApproveCheck,servRenew, servApproveToken,servCheckOperator } from '../services/web3Service';
import { servSetProfile } from '../services/profile';
import loadinggif from '../assets/images/loading1.gif'
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
import Modal from './Modal';
import {useRouter} from 'next/router'
import dynamic from 'next/dynamic';
import BlogEditor from './BlogEditor';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // import styles

import dotenv from 'dotenv';
dotenv.config();

const BLANK = '0x0000000000000000000000000000000000000000';
  
const Blogs = ({id}:any) => {
    const router = useRouter();
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [_showEditor, setShowEditor]:any = useState()
    const [_showTextEditor, setShowTextEditor]:any = useState()
    const [_blog, setBlog]:any = useState('');
    const [_blogs, setBlogs]:any = useState('');
    
    useEffect(() => {
        if (connected && account) {
            // console.log(walletProvider.provider)
            setWalletProvider(provider);
            // handleStart(account)
        
        }
      }, [account, connected]);
    
      useEffect(() => {
        const fetchData = async () => {
            if(id>0){
            
                // Fetch the current blog
                let data = await axios.get(`/api/getBlog?id=${id}`);
                if (data.data) {
                    setBlog(data.data.blog);
                    // Fetch the last 3 blogs by the same user
                    let data2 = await axios.get(`/api/getBlog?account=${data.data.account}`);
                    if (data2.data) {
                    setBlogs(data2.data);
                    }
                }

            }else{

                let data2 = await axios.get(`/api/getBlog?account=${account}`);
                if (data2.data) {
                    console.log(data2.data)
                    setBlogs(data2.data);
                }
                setShowEditor(true)
            }
        };
    
        fetchData();
      }, [id]);
    

  const renderBlogPreview = (blog: any) => {
    const firstImage = blog.content.match(/<img.*?src=["'](.*?)["']/)?.[1] || '';

    return (
      <div className="col-lg-4" key={blog.id}>
        <div className="cs-post cs-style1">
          <a href={`/blog/${blog.id}`} className="cs-post_thumb">
            <div
              className="cs-post_thumb_in cs-bg"
              style={{ backgroundImage: `url(${firstImage})` }}
            ></div>
          </a>
          <div className="cs-post_info">
            <h2 className="cs-post_title">
              <a href={`/blog/${blog.id}`}>{blog.title}</a>
            </h2>
            <div className="cs-post_subtitle">{/* ... your subtitle logic */}</div>
            <div className="cs-height_20 cs-height_lg_20"></div>
          </div>
        </div>
        <div className="cs-height_30 cs-height_lg_30"></div>
      </div>
    );
  };

    //   useEffect(() => {
    //     if(_showEditor){
    //         setShowTextEditor(true)
    //     }else{
    //         setShowTextEditor(false)
    //     }
    //   }, [_showEditor]);
      
      const handleSave = async ({ userId, content, date }:any) => {
        // Assuming you have an API route for saving the blog content
        const response = await fetch('/api/setBlog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, content, date }),
        });
    
        if (response.ok) {
          // Handle successful save
          alert("saved")
        } else {
          // Handle error
          alert("not saved")
        }
      };
      
      async function handleWrite(){
        if(!_showEditor){
            setShowEditor(true)
        }else{
            setShowEditor(false)
        }
      }
      
    //   async function handleStart(user_:any){
    //     if(id>0){
            
    //         let data = await axios.get(`/api/getBlog?id=${id}`)
    //         if(data.data){
    //             setBlog(data.data.blog)
    //             ///get users blogs
    //             let data2 = await axios.get(`/api/getBlog?account=${data.data.account}`)
    //             if(data2.data){
    //                 setBlogs(data2.data)
    //             } 
    //         }
 
    //     }else{
    //         setShowEditor(true)
    //     }
    //   }

        return(
        <>
            <div className="cs-height_90 cs-height_lg_80"></div>
            <section className="cs-page_head cs-bg" style={{backgroundImage: "url(/img/page_head_bg.svg)"}}>
                <div className="container">
                    <div className="text-center">
                        <h1 className="cs-page_title" style={{fontFamily: 'Comfortaa'}}>Blogs</h1>
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item" style={{fontFamily: 'Comfortaa'}}><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" style={{fontFamily: 'Comfortaa'}}><a href="#" onClick={handleWrite}>Blogs</a></li>
                        </ol>
                    </div>
                </div>
            </section>
            <div className="cs-height_100 cs-height_lg_70"></div>
            <div className="container">
                <div className="row">
                    {!_showEditor && (
                        <div className="col-lg-8 offset-lg-2">
                            <div className="cs-single_post">
                                {_blog}
                            </div>
                        </div>
                    )}
                    {_showEditor && (
                        <div className="col-lg-8 offset-lg-2">
                            <div className="cs-single_post">
                                <h4 className="text-center p-2" style={{fontFamily: 'Comfortaa'}}>write blog</h4>
                                <BlogEditor onSave={handleSave} account={account} />
                            </div>
                        </div>
                    
                    )}
                </div>
            </div>
            <div className="cs-height_100 cs-height_lg_70"></div>
            <div className="container">
                <h2 className="cs-section_heading cs-style1 text-center">Your Blogs</h2>
                <div className="cs-height_45 cs-height_lg_45">
                    {_blogs.length>0 && (
                        <div className="row">{_blogs.map((blog: any) => renderBlogPreview(blog))}</div>
                    )}
                    {_blogs.length<1 && (
                        <div className="row">
                            <div className="col-lg-12">
                                <p className="text-center">you have no other blogs</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default Blogs;