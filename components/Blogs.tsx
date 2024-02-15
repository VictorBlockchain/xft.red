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
                        <li className="breadcrumb-item active" style={{fontFamily: 'Comfortaa'}}><a href="#">Blogs</a></li>
                        </ol>
                    </div>
                </div>
            </section>
            <div className="cs-height_100 cs-height_lg_70"></div>
            <div className="container">
                <div className="row">
                    {id==1 && (
                        <div className="col-lg-8 offset-lg-2">
                            <div className="cs-single_post">
                              
                            <h2 className="text-center" style={{fontFamily: 'Comfortaa'}}>Welcome To NFT 2.0</h2>
                            <p className="text-center" style={{fontFamily: 'Comfortaa'}}>Revolutionizing Digital Assets & <br/> Empowering the Global Economy</p>
                              <div className="text-center">
                                <Image
                                    src='/assets/images/nft2.jpeg'
                                    alt="NFT 2.p"
                                    className="cs-zoom_item"
                                    width='500'
                                    height='400'
                                    // onLoad={handleImageLoad}
                                  />
                                </div>
                                <p style={{lineHeight:'44px'}}>
                                In the blink of an eye, Non-Fungible Tokens (NFTs) stormed the tech landscape, catching the attention of artists, investors, and enthusiasts alike. The meteoric rise of NFTs, epitomized by Beeple's staggering $69 million art sale, spurred creatives worldwide to dive into this digital phenomenon, all envisioning a lucrative future for their artistic endeavors.
                                <br/><br/>

                                  <b className="pt-5">However</b>, the initial gold rush led to a saturated NFT market, leaving many tokens overlooked, unsold, and once-cherished collections devalued. It was akin to creating assets for a video game without having the game itself.<br/><br/>
                                  <h3 style={{fontFamily: 'Comfortaa'}}>Enter NFT 2.0 — </h3>

                                  A transformative layer that injects a new dimension into these digital assets. Think of it as breathing life into NFT 1.0, but with a twist. NFT 2.0 introduces the concept of Smart NFTs, also known as token-bound NFTs, soul-bound NFTs, or even the backpacks for your NFTs.<br/><br/>
                                  
                                  <b>Smart NFTs</b> not only resurrect the value of stagnant NFT 1.0 assets but also extend the realms of possibilities for NFT use cases. From gaming applications and social benefit distribution to storing passports and IDs, the potential applications of Smart NFTs seem boundless.<br/><br/>

                                  Imagine utilizing your NFT as a family vault — a digital time capsule. Lock away a Bitcoin in your Smart NFT, seal it for 25 years, and let it stand as a legacy for generations to come. Others may leverage Smart NFTs as collateral for loans, introducing a novel intersection of digital assets and financial instruments.<br/><br/>

                                  NFTea.app, our visionary marketplace, is at the forefront of this NFT 2.0 revolution. Tailored for Smart NFTs, it embodies our vision of how this format can empower the global economy. Beyond the realm of art, NFTea.app is a gateway to a new era where digital assets not only represent creative expression but also serve as dynamic tools shaping the future of finance and ownership.<br/><br/>
                                  
                                  As NFT 2.0 continues to unfold, we stand on the precipice of a digital renaissance, where the potential applications of Smart NFTs are yet to be fully explored. The journey is not just about owning a piece of art; it's about embracing a dynamic ecosystem that merges creativity, technology, and global finance into a powerful force for change. Join us as we navigate this frontier and redefine the narrative of digital ownership in the 21st century.
                              
                                </p>
                            </div>
                        </div>
                    )}
                    {id==2 && (
                        <div className="col-lg-8 offset-lg-2">
                            <div className="cs-single_post">
                              
                            <h2 className="text-center" style={{fontFamily: 'Comfortaa'}}>The Genuis Of Labels</h2>
                            <p className="text-center" style={{fontFamily: 'Comfortaa'}}>collections done better</p>
                              <div className="text-center">
                                <Image
                                    src='/img/general_27.jpeg'
                                    alt="NFT 2.p"
                                    className="cs-zoom_item"
                                    width='500'
                                    height='400'
                                    // onLoad={handleImageLoad}
                                  />
                                </div>
                                <p style={{lineHeight:'44px'}}>
                                  In the realm of innovation, the path to progress is often paved with reinvention. Tesla redefined the truck with a vision of the future, and similarly, our NFT marketplace has been crafted with the ethos of reinventing the very idea of collections. Imagine collections not as static entities but as dynamic, globally collaborative, and locally discoverable ecosystems.<br/><br/>
                                  
                                  Our ingenious solution to this paradigm shift is Labels — a groundbreaking concept that transforms how we perceive and interact with NFT collections. Think of Labels as ENS domains for your NFTs, granting you ownership and the power to dictate permissions and interactions.<br/><br/>

                                  When you possess the label "Brooklyn NFT," you wield exclusive rights to sell NFTs under that label. Take it a step further by offering licenses to artists globally or narrow it down to a local scale, allowing only Brooklyn-based artists to contribute to your curated collection.<br/><br/>

                                  Labels aren't just a tool for individual ownership; they're a dynamic team management solution. Issue operator licenses to team members, granting them the authority to mint or sell NFTs on behalf of your label, fostering collaboration seamlessly.<br/><br/>

                                  What sets Labels apart is their integration of smart contracts. All sales generated from NFTs under your label are securely stored in the smart contract wallet associated with your label. This ensures effortless distribution of earnings to your team members. Fine-tune permissions, specifying when and how often team members can withdraw funds from the label wallet.<br/><br/>

                                  But that's not all. Labels redefine the concept of royalties by directing them to buyers, not artists. Each NFT purchase from your label entitles the buyer to a share of perpetual sales. This unique approach to royalties transforms collectors into active stakeholders in the ecosystem, fostering a mutually beneficial relationship.<br/><br/>
                                  
                                  In the world of NFTs, where creativity knows no bounds, Labels emerge as a revolutionary force, challenging conventional notions of ownership, collaboration, and financial incentives. Step into a future where NFT collections are not just assets but living entities, dynamically shaping the landscape of global collaboration and artistic expression. Welcome to the era of Labels, where innovation meets imagination, and the possibilities are as limitless as human creativity itself.                              
                                </p>
                            </div>
                        </div>
                    )}
                    {id==3 && (
                        <div className="col-lg-8 offset-lg-2">
                            <div className="cs-single_post">
                              
                            <h2 className="text-center" style={{fontFamily: 'Comfortaa'}}>Show Love</h2>
                            <p className="text-center" style={{fontFamily: 'Comfortaa'}}>lets kill the like button</p>
                              <div className="text-center">
                                <Image
                                    src='/img/general_27.jpeg'
                                    alt="NFT 2.p"
                                    className="cs-zoom_item"
                                    width='500'
                                    height='400'
                                    // onLoad={handleImageLoad}
                                  />
                                </div>
                                <p style={{lineHeight:'44px'}}>
                                The advent of Web 2.0 brought us platforms like Facebook, where the value of creative expression was distilled into the simplicity of a "like" button. While users experienced a fleeting sense of affirmation, major platforms (Zuck) reaped massive financial gains. Web 3.0, or what we affectionately term "web us," ushers in a paradigm shift where creators are not only acknowledged but also rewarded for their contributions.<br/><br/>

In this new digital landscape, we've discarded the socially limiting "like" button in favor of a more profound expression — the "Show Love" button. When you extend appreciation to a piece of art, you're not just signaling approval; you're elevating the intrinsic value of the artwork, and here's how.<br/><br/>

Meet the Tea Pot, a unique community vault fueled by the NFTea token. Every time you hit the "Show Love" button, a small contribution is drawn from the Tea Pot and seamlessly integrated into the smart contract of the NFT you're appreciating. This isn't just a symbolic gesture; it's a tangible way to add substantial value to the creations you genuinely "love."<br/><br/>

The magic lies in the reciprocity of the act. As you express your admiration for an artwork, you're not merely a passive viewer; you become an active participant in fostering a culture of appreciation. This mechanism not only empowers creators by attributing tangible value to their work but also creates a decentralized ecosystem where users collectively contribute to the growth and sustainability of the artistic community.<br/><br/>

The "Show Love" feature isn't just a button; it's a conduit for genuine appreciation to flow through, fostering a symbiotic relationship between creators and their audience. No longer confined to the limitations of a singular gesture, your appreciation becomes an integral part of an evolving narrative, shaping the destiny of the digital art realm.<br/><br/>

In the era of Web 3.0, let's redefine the dynamics of digital interaction. It's not just about acknowledging creativity; it's about actively contributing to its growth and acknowledging the profound impact it has on our digital culture. Step into a world where the act of showing love isn't just a click; it's a transformative force shaping the future of digital appreciation. Join us as we celebrate the true essence of art, one "Show Love" at a time.                                </p>
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
            {id<1 && (
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
            )}
        </>
    )
}
export default Blogs;