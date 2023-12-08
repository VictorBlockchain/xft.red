'use client';
import React, { Component } from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import axios from "axios";
import { BigNumber } from 'bignumber.js';
import { servDisplays,servLove,servBalances,servNFT,setWalletProvider } from '../services/web3Service';
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
import Modal from './Modal';

const BLANK = '0x0000000000000000000000000000000000000000';

const Start = () => {
  
const router:any = useRouter()
const { sdk, connected, connecting, provider, chainId } = useSDK();  
const { account, setAccount } = useUser();
const [_showDisplay, setShowDisplay]:any = React.useState(false)
let [_display, setDisplay]:any = React.useState([])
const [_loveModalOpen, setLoveModal]:any = React.useState(false)
const [_teaPot, setTeaPot]:any = React.useState(false)
const [_isLoading, setLoading]:any = React.useState(false)
const [isNFTModalOpen, setIsNFTModalOpen]:any = React.useState(false)
const [isLabelModalOpen, setIsLabelModalOpen]:any = React.useState(false)
const [isTokenModalOpen, setIsTokenModalOpen]:any = React.useState(false)
const [isTeapotModalOpen, setIsTeapotModalOpen]:any = React.useState(false)
const [isOperatorsModalOpen, setIsOperatorsModalOpen]:any = React.useState(false)
const [isAttributesModalOpen, setIsAttributesModalOpen]:any = React.useState(false)
const [isExampleModalOpen, setIsExampleModalOpen]:any = React.useState(false)
const [_loveNFT, setLoveNFT]:any = React.useState(0)
const [_loveHolder, setLoveHolder]:any = React.useState('')

useEffect(() => {
  if(connected && account){
      setWalletProvider(provider);
      handleStartConnected(account);
  }
}, [account, connected]);

useEffect(() => {
  if(_display.length>0){
      setShowDisplay(true)
  }
}, [_display]);
  
async function handleStartConnected(user_:any){
    
  setLoading(true)
  let _content:any = []
  let resp_ = await servDisplays()

  for (let i = 0; i < resp_[0].length; ++i) {
    let ipfs_:any = resp_[1][i]
    let data_:any = await axios.get(ipfs_)
    let _nftData:any = await handleNFT(resp_[0][i])
    let profileData:any = await axios.get(`/api/getProfile?account=${_nftData[0].addresses[0]}`)
    profileData.data.account = _nftData[0].addresses[0]
    data_.data.id = resp_[0][i]
    data_.data.nftea = _nftData
    data_.data.profile = profileData.data
    data_.data.key = i
    _content.push(data_.data)
  }
  setDisplay(_content)
  
  let balances_:any = await servBalances(user_)
  const number = new BigNumber(balances_.teapot);
  let formattedNumber = number.dividedBy(1000000000).toFixed(9);   
  const formattedString = formattedNumber.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
  
  setTeaPot(formattedString)
  setLoading(false)

}

  async function handleNFT(nftea_:any){
          
    let resp_ = await servNFT(nftea_)
    return resp_;

  }
  async function handleShowLove(){
    
    let resp:any = await servLove(account,_loveNFT, _loveHolder)

  
  }
  async function openLoveModal(nftea:any,holder:any){
    
    setLoveNFT(nftea)
    setLoveHolder(holder)
    setLoveModal(true);

  }
  // function openLoveModal(event:any) {
  //   event.preventDefault();
  //   setLoveModal(true);
  // }
  function closeLoveModal() {
    setLoveModal(false);
  }
  function handleOpenNFTModal(event:any) {
    event.preventDefault();
    setIsNFTModalOpen(true);
  }
  function handleOpenLabelModal(event:any) {
    event.preventDefault();
    setIsLabelModalOpen(true);
  }
  function handleOpenExampleModal(event:any) {
    event.preventDefault();
    setIsExampleModalOpen(true);
  }
  function handleCloseNFTModal() {
    setIsNFTModalOpen(false);
  }
  
  function handleCloseLabelModal() {
    setIsLabelModalOpen(false);
  }
  function handleCloseExampleModal() {
    setIsExampleModalOpen(false);
  }
  function handleTokenModal(event:any) {
    event.preventDefault();
    if(isTokenModalOpen){
      setIsTokenModalOpen(false);
    }else{
      setIsTokenModalOpen(true);
    }
  }
  function handleTeapotModal(event:any) {
    event.preventDefault();
    if(isTeapotModalOpen){
      setIsTeapotModalOpen(false);
    }else{
      setIsTeapotModalOpen(true);
    }
  }
  function handleOperatorsModal(event:any) {
    event.preventDefault();
    if(isOperatorsModalOpen){
      setIsOperatorsModalOpen(false);
    }else{
      setIsOperatorsModalOpen(true);
    }
  }
  function handleAttributesModal(event:any) {
    event.preventDefault();
    if(isAttributesModalOpen){
      setIsAttributesModalOpen(false);
    }else{
      setIsAttributesModalOpen(true);
    }
  }
    

    return(
        <>
        <div className="cs-height_90 cs-height_lg_80"></div>
          <div className="cs-height_30 cs-height_lg_30"></div>
          <section className='container-fluid'>
            <div className='cs-hero_slider_1'>
              <div className='cs-slider cs-style1'>
                <div className='cs-slider_container'>
                  <div className='cs-slider_wrapper'>
                    <div className='slick-list'>
                      <div className='slick-track'>
                        <div className='slick-slide'>
                        <div>
                          <div className="cs-slide" style={{width: '100%', display: 'inline-block'}}>
                            <div className="cs-hero cs-style1 cs-bg cs-center" data-src="/img/hero_bg1.jpeg" style={{backgroundImage: "url('/img/hero_bg1.jpeg')"}}>
                            <div className="container">
                            <div className="cs-hero_text">
                            <h1 className="cs-hero_title">The 1st marketplace for <br/>smart nfts & collections (labels)</h1>
                            <div className="cs-hero_subtitle cs-medium">Smart nfts are nfts attached to a smart contract. This allows your nft <br/>to hold its additional value. Labels are collections you can license.</div>
                            <div className="cs-hero_btns">
                            <a href="#" onClick={handleOpenNFTModal} className="cs-hero_btn cs-style1 cs-color1">NfTea</a>
                            <a href="#" onClick={handleOpenLabelModal}  className="cs-hero_btn cs-style1 cs-color2">Labels</a>
                            </div>
                            </div>
                            </div>
                            </div>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='cs-slider_arrows cs-style2' style={{display:"none"}}>
                      <div className="cs-left_arrow cs-center cs-box_shadow slick-arrow">
                        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.0269 7.55957H0.817552" stroke="currentColor" strokeWidth="1.16474" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M6.92188 1.45508L0.817222 7.55973L6.92188 13.6644" stroke="currentColor" strokeWidth="1.16474" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </div>
                      <div className="cs-right_arrow cs-center cs-box_shadow slick-arrow">
                        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.816895 7.55957H13.0262" stroke="currentColor" strokeWidth="1.16474" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M6.92188 1.45508L13.0265 7.55973L6.92188 13.6644" stroke="currentColor" strokeWidth="1.16474" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="cs-height_95 cs-height_lg_70"></div>
          <section>
            <div className="container">
              <h2 className="cs-section_heading cs-style1 text-center">Browse By Label</h2>
              <div className="cs-height_45 cs-height_lg_45"></div>
                <div className="row">
                  <div className="col-lg-2 col-sm-4 col-6">
                  <a href="https://nftea.app/search/african%20hyena%20pets" className="cs-card cs-style1 cs-box_shadow text-center cs-white_bg">
                    <div className="cs-card_thumb" >
                    <Image
                    src="/img/pets/27.png"
                    alt="Image"
                    className="cs-zoom_item"
                    width='200'
                    height='200'
                    // onLoad={handleImageLoad}
                />                    </div>
                    <p className="cs-card_title" style={{fontFamily: 'Comfortaa'}}>African Hyena Pets</p>
                    </a>
                  </div>
                  
                  <div className="col-lg-2 col-sm-4 col-6">
                  <a href="#" className="cs-card cs-style1 cs-box_shadow text-center cs-white_bg">
                    <div className="cs-card_thumb" onClick={handleOpenExampleModal}>
                    <Image
                    src="/img/nft_nigeria.jpeg"
                    alt="Image"
                    className="cs-zoom_item"
                    width='200'
                    height='200'
                    // onLoad={handleImageLoad}
                />                    </div>
                    <p className="cs-card_title" style={{fontFamily: 'Comfortaa'}}>NFT Nigeria</p>
                    </a>
                  </div>
                  
                  <div className="col-lg-2 col-sm-4 col-6">
                  <a href="#" className="cs-card cs-style1 cs-box_shadow text-center cs-white_bg">
                    <div className="cs-card_thumb" onClick={handleOpenExampleModal}>
                    <Image
                    src="/img/nft_newyork.jpeg"
                    alt="Image"
                    className="cs-zoom_item"
                    width='200'
                    height='200'
                    // onLoad={handleImageLoad}
                />                    </div>
                    <p className="cs-card_title" style={{fontFamily: 'Comfortaa'}}>NFT New York</p>
                    </a>
                  </div>

                  <div className="col-lg-2 col-sm-4 col-6">
                  <a href="#" className="cs-card cs-style1 cs-box_shadow text-center cs-white_bg">
                    <div className="cs-card_thumb" onClick={handleOpenExampleModal}>
                    <Image
                    src="/img/nft_miami.jpeg"
                    alt="Image"
                    className="cs-zoom_item"
                    width='200'
                    height='200'
                    // onLoad={handleImageLoad}
                />                    </div>
                    <p className="cs-card_title" style={{fontFamily: 'Comfortaa'}}>NFT Miami</p>
                    </a>
                  </div>
                  
                  <div className="col-lg-2 col-sm-4 col-6">
                  <a href="#" className="cs-card cs-style1 cs-box_shadow text-center cs-white_bg">
                    <div className="cs-card_thumb" onClick={handleOpenExampleModal}>
                    <Image
                    src="/img/afro_beats.jpeg"
                    alt="Image"
                    className="cs-zoom_item"
                    width='200'
                    height='200'
                    // onLoad={handleImageLoad}
                />                    </div>
                    <p className="cs-card_title" style={{fontFamily: 'Comfortaa'}}>Afro Beats</p>
                    </a>
                  </div>
                  
                  <div className="col-lg-2 col-sm-4 col-6">
                  <a href="#" className="cs-card cs-style1 cs-box_shadow text-center cs-white_bg">
                    <div className="cs-card_thumb" onClick={handleOpenExampleModal}>
                    <Image
                    src="/img/web3women.jpeg"
                    alt="Image"
                    className="cs-zoom_item"
                    width='200'
                    height='200'
                    // onLoad={handleImageLoad}
                />                    </div>
                    <p className="cs-card_title" style={{fontFamily: 'Comfortaa'}}>Web3 Women</p>
                    </a>
                  </div>
                </div>
            </div>
          </section>
          {_isLoading && (
            <>
              <div className="cs-height_100 cs-height_lg_70"></div>
              <section>
              <div className="container">
                <div className="row">
                  <div className="col-12">
                      <p className="text-center">loading display...</p>
                  </div>
                </div>
              </div>
              </section>
            </>
          )}
          {_showDisplay && (
            <>
                      <div className="cs-height_100 cs-height_lg_70"></div>
          <section>
          <div className="container">
            <div className="cs-section_heading cs-style2">
              <div className="cs-section_left">
                <h2 className="cs-section_title">On Display</h2>
              </div>
            </div>
            <div className="cs-height_30 cs-height_lg_30"></div>
            <div className="row">
              {/* Repeat this card block for each card */}
              {_display.map((item:any) => (
                <>
                  <div className="col-lg-3 col-md-6 col-sm-12" key={item.key}>
                    <div className="cs-isotop cs-style1 cs-has_gutter_30">
                      <div className="cs-grid_sizer"></div>
                      <div className="cs-isotop_item fashion">
                        <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                          <span className="cs-card_like cs-primary_color" onClick={() => openLoveModal} >
                            <i className="fas fa-heart fa-fw"></i>
                            0
                          </span>
                          <a href={`/view/${item.id}/0/${BLANK}`} className="cs-card_thumb cs-zoom_effect">
                            <img
                              src={item.image}
                              alt="Image"
                              className="cs-zoom_item"
                              width='200'
                              height='200'
                              // onLoad={handleImageLoad}
                            />
                          </a>
                          <div className="cs-card_info">
                            <a href={`/profile/${item.profile.account}`} className="cs-avatar cs-white_bg">
                              <img
                                src={item.profile.profilePic}
                                alt="Image"
                                className="cs-zoom_item"
                                width='50'
                                height='50'
                              /> <span>{`${item.profile.account.substring(0, 6)}...${item.profile.account.substring(item.profile.account.length - 6)}`}</span>
                            </a>
                            <h3 className="cs-card_title text-center"><a href={`/view/${item.id}/0/${BLANK}`}>{item.name} #{item.id}</a></h3>
                          </div>
                          <hr />
                          <div className="cs-card_footer">
                            <div className="text-center">
                              <button  onClick={() => openLoveModal(item.id,item.profile.account)} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Show Love</span></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>

              ))}
            </div>
          </div>
          
          </section>
            </>
          )}
          
          <div className="cs-height_100 cs-height_lg_70"></div>
          <section>
            <div className="container">
              <h2 className="cs-section_heading cs-style1 text-center">Competitive Advantages</h2>
              <div className="cs-height_30 cs-height_lg_30"></div>

              <div>
                <div className="row">
                  <div className="col-lg-3 col-sm-6">
                    
                  <div className="cs-iconbox cs-style1 cs-white_bg">
                  <a href="#" onClick={handleTokenModal}>
                    <div className="cs-iconbox_icon">
                      
                      <Image
                        src="/img/teacup2.jpeg"
                        alt="Image"
                        className="cs-zoom_itemer"
                        width='100'
                        height='100'
                        style={{ borderRadius: '5px' }} 
                      />
                    
                    </div></a>
                    <h2 className="cs-iconbox_title" >NFTea Token</h2>
                    <div className="cs-iconbox_subtitle">An innovative DEFI token that feeds the community tea pot</div>
                    </div>
                    <div className="cs-height_30 cs-height_lg_30"></div>
                  </div>

                  <div className="col-lg-3 col-sm-6">
                      <div className="cs-iconbox cs-style1 cs-white_bg">
                      <a href="#" onClick={handleTeapotModal}>
                      
                      <div className="cs-iconbox_icon">
                      <Image
                        src="/img/teapot.jpeg"
                        alt="Image"
                        className="cs-zoom_itemer"
                        width='100'
                        height='100'
                        style={{ borderRadius: '5px' }} 
                      />
                      </div></a>
                      <h2 className="cs-iconbox_title">Tea Pot</h2>
                      <div className="cs-iconbox_subtitle">A community vault for community loans</div>
                      </div>
                      <div className="cs-height_30 cs-height_lg_30"></div>
                  </div>
                
                  <div className="col-lg-3 col-sm-6">
                      <div className="cs-iconbox cs-style1 cs-white_bg">
                      <a href="#" onClick={handleOperatorsModal}>

                      <div className="cs-iconbox_icon">
                      <Image
                        src="/img/hands.jpeg"
                        alt="Image"
                        className="cs-zoom_itemer"
                        width='100'
                        height='100'
                        style={{ borderRadius: '5px' }} 
                      />
                      </div></a>
                      <h2 className="cs-iconbox_title">Label Operators</h2>
                      <div className="cs-iconbox_subtitle">Allow your team members to mint or sell under your label</div>
                      </div>
                      <div className="cs-height_30 cs-height_lg_30"></div>
                  </div>
                  
                  <div className="col-lg-3 col-sm-6">
                      <div className="cs-iconbox cs-style1 cs-white_bg">
                      <a href="#" onClick={handleAttributesModal}>

                      <div className="cs-iconbox_icon">
                      <Image
                        src="/img/attributes.jpeg"
                        alt="Image"
                        className="cs-zoom_itemer"
                        width='100'
                        height='100'
                        style={{ borderRadius: '5px' }} 
                      />
                      </div></a>
                      <h2 className="cs-iconbox_title">Attribute Tokens</h2>
                      <div className="cs-iconbox_subtitle">Gamified nfts with our Attributes As Assets tokens</div>
                      </div>
                      <div className="cs-height_30 cs-height_lg_30"></div>
                  </div>  
                  </div>              
              </div>
            </div>
          </section>
          <div className="cs-height_70 cs-height_lg_70"></div>
          <section>
            <div className="container">
              <div className="cs-section_heading cs-style2">
                <div className="cs-section_left">
                <div className="cs-section_heading cs-style2">
                  <div className="cs-section_left">
                  <h2 className="cs-section_title">NFTea Blogs</h2>
                  </div>
                  <div className="cs-section_right">
                    {/* <a href="explore-details.html" className="cs-btn cs-style1"><span>Explore More</span></a> */}
                  </div>
                  </div>
                </div>
              
              </div>
              <div className="cs-height_45 cs-height_lg_45"></div>
              <div className="row">
              <div className="col-lg-4">
                <div className="cs-post cs-style1">
                <a href="#" className="cs-post_thumb">
                <div className="cs-post_thumb_in cs-bg" data-src="/img/general_26.jpeg" style={{backgroundImage: "url('/img/general_26.jpeg')"}}></div>
                </a>
                <div className="cs-post_info">
                <h2 className="cs-post_title" style={{fontFamily: 'Comfortaa'}}><a href="#">Welcome to NFT 2.0</a></h2>
                <div className="cs-post_subtitle">No NFTs will be left behind, all will have value...</div>
                <div className="cs-height_20 cs-height_lg_20"></div>
                </div>
                </div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                </div>

                <div className="col-lg-4">
                <div className="cs-post cs-style1">
                <a href="#" className="cs-post_thumb">
                <div className="cs-post_thumb_in cs-bg" data-src="/img/general_27.jpeg" style={{backgroundImage: "url('/img/general_27.jpeg')"}}></div>
                </a>
                <div className="cs-post_info">
                <h2 className="cs-post_title" style={{fontFamily: 'Comfortaa'}}><a href="#">The Genius of Labels</a></h2>
                <div className="cs-post_subtitle">Labels are game changing, why wasn't it like this from the beginning?..</div>
                <div className="cs-height_20 cs-height_lg_20"></div>

                </div>
                </div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                </div>

                <div className="col-lg-4">
                <div className="cs-post cs-style1">
                <a href="#" className="cs-post_thumb">
                <div className="cs-post_thumb_in cs-bg" data-src="/img/general_28.jpeg" style={{backgroundImage: "url('/img/general_28.jpeg')"}}></div>
                </a>
                <div className="cs-post_info">
                <h2 className="cs-post_title" style={{fontFamily: 'Comfortaa'}}><a href="#">Show Love</a></h2>
                <div className="cs-post_subtitle">This defi token could set a wave of how creatives are rewarded...</div>
                <div className="cs-height_20 cs-height_lg_20"></div>
                
                </div>
                </div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                </div>

              </div>
            </div>
          </section>
          
          {isNFTModalOpen && ( 
            <Modal onClose={handleCloseNFTModal} title="Smart NFTeas">
                <div className="cs-single_post">
                  <p style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>Smart NFTs, often referred to as NFT 2.0, introduce a revolutionary approach to ensure the seamless resale of your NFTs. By integrating a smart contract with your NFT, these tokens gain the ability to store various assets, including other NFTs. This groundbreaking feature opens up a realm of possibilities for creators, offering avenues for collector incentives, gamification, puzzles, and beyond.
                </p>
              </div>
            </Modal>
        
        )}
        {isLabelModalOpen &&  (
            <Modal onClose={handleCloseLabelModal} title="Labels">
              <div className="cs-single_post">
                <p style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>Labels are an evolution beyond collections, offering a dynamic and superior alternative. Unlike collections, which lack flexibility and global collaboration, Labels empower creators with hyper-localized discovery. When you own a label, such as "Harlem NFT," exclusive rights to sell NFTs under that label are granted solely to you. Should you wish to enable other creatives to showcase their art under your label, you can offer them a label license. Connect and create your label now to experience the immense power and versatility of this feature.
                </p>
              
              </div>
            </Modal>
        
        )}
        {isExampleModalOpen &&  (
            <Modal onClose={handleCloseExampleModal} title="Example Labels">
              <div className="cs-single_post">
                <p style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                Consider owning labels like 'NFT Nigeria,' 'NFT New York,' 'NFT Miami,' etc. If these labels are unclaimed, seize the opportunity. In the NFT world, you don't have to be an artist to earn. As a curator, you can offer licenses to artists that align with your curation. Secure your label now before someone else does and unlock the potential for unique curation and collaboration in the NFT space. 
                </p>
              
              </div>
            </Modal>
        
        )}
        {_loveModalOpen &&  (
            <Modal onClose={closeLoveModal} title="Show Love">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                  Show Love to awesome art works.<br/>When you show love a sip is taken from the teapot and added to the wallet of this nftea.
                </p>
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}> Teapot: {_teaPot}</p>
                <div className="cs-height_20 cs-height_lg_20"></div>
                <p className="text-center">live soon</p>
                {/* <button onClick={() => handleShowLove()} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Show Love</span></button> */}

              </div>
            </Modal>
        
        )}
        {isTokenModalOpen &&  (
            <Modal onClose={handleTokenModal} title="NFTEA Token">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                Experience an innovative DeFi token driving community rewards. Every transfer contributes 1% to the Teapot, supporting loans and 'show love' rewards.                </p>
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}> <b>Tokenomics</b></p>
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}> supply: 84 trillion <br/>up to 5% development<br/>up to 5% marketing/donations<br/>up to 3% static reflections</p>
                <div className="cs-height_20 cs-height_lg_20"></div>
                <p className="text-center mb-3"><a href="https://www.dextools.io/app/en/bnb/pair-explorer/0x3acd58d9cc879bed0b0b5313466c9116176bc242" target='_blank' style={{textDecoration:'none'}}>Dextools</a></p>
                <p className="text-center"><a href="https://pancakeswap.finance/swap?outputCurrency=0xb4668238Acf0314A7b4e153368e479fCd2E09831" target='_blank' className="cs-btn cs-style1 cs-btn_lg w-100"><span>Buy</span></a></p>

              </div>
            </Modal>
        
        )}
        {isTeapotModalOpen &&  (
            <Modal onClose={handleTeapotModal} title="Teapot">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                Access a community wallet designed for interest-free loans and 'show love' rewards. Secure 0% interest, 30-day loans directly from the teapot, eliminating the need to borrow from other members at high interest rates.                </p>
                <p className="text-center mt-3" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}><b>Teapot</b><br/> {_teaPot || 'connect wallet to see pot balance'}</p>
                <div className="cs-height_20 cs-height_lg_20"></div>

              </div>
            </Modal>
        
        )}
        {isOperatorsModalOpen &&  (
            <Modal onClose={handleOperatorsModal} title="Label Operators">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                Picture this: you're a celebrity, and your graphic artist or marketer contacts you for every mint. What if they could independently mint and sell on your behalf whenever necessary? Label operators provide the autonomy your team members need for more efficient NFT management, enabling them to excel in the NFT space

                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {isAttributesModalOpen &&  (
            <Modal onClose={handleAttributesModal} title="Assets As Attributes">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                Transform your NFT set into a gamified experience with Assets as Attributes. Move beyond static attributes like speed, power, defense, flight, and attack. In this innovative approach, these attributes are represented by DEFI tokens, securely stored in your smart NFTea's wallet
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              
              </div>
            </Modal>
        
        )}
        </>
    )
}
export default Start;
