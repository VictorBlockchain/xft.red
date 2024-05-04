'use client';
import React, { Component } from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import axios from "axios";
import { BigNumber } from 'bignumber.js';
import { servDisplays,servLove,servBalances,servNFT,setWalletProvider,servFlames } from '../services/web3Service';
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

const [inputCurrency, setInputCurrency] = useState('');
const [outputCurrency, setOutputCurrency] = useState('');
const [inputAmount, setInputAmount] = useState('');
const [outputAmount, setOutputAmount] = useState('');
const [currencyData, setCurrencyData]:any = useState([]);
const [message, setMessage] = useState()
const titles = [
  "Get up to $1,000 BNB referral bonus",
  "Need BNB? Swap BTC/ETH/XRP +",
  "XFT, bridge to your future with xft vaults",
  "Play xSmash, a fun mash button game to win prizes"

]; // Add your replacement titles here

const subtitles = [
  "Mint your Hyena Pet & tell a friend, 1st to refer 30 friends/followers wins up to $1,000 BNB",
  "Easily swap btc, eth and other assets using our decentralized swap. Get BNB in your wallet within mints & start minting.",
  "Lock assets in the vault of your xft, your future self will thank you. Use your xft as collateral for 0% loans if needed.",
  "Win crypto & xfts in this fun, fast paced mash button game. Grab, Slap, & Sneak away with awesome prizes"
]; // Add your replacement subtitles here

useEffect(() => {
  if(connected && account){
      setWalletProvider(provider);
      handleStartConnected(account);
  }
}, [account, connected]);

const [index, setIndex] = useState(0);
const [mainTitle, setMainTitle] = useState(titles[0]);
const [subTitle, setSubTitle] = useState(subtitles[0]);

useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prevIndex) => (prevIndex + 1) % titles.length);
    setMainTitle(titles[index]);
    setSubTitle(subtitles[index]);
  }, 6000); // Change 5000 to the desired duration in milliseconds (e.g., 5000 for 5 seconds)

  return () => clearInterval(interval);
}, [index]);

const [exchangeRate, setExchangeRate] = useState({
  fromAmount: 0,
  toAmount: 0,
  payinAddress: "",
  qr:""
})
const [formValues, setFormValues] = useState({
  fromCurrency: "",
  fromCurrency_network: "", // Add network property for fromCurrency
  toCurrency: "",
  toCurrency_network: "", // Add network property for toCurrency
  amount: "",
  email: "",
  payToAddress: account || ''
});

useEffect(() => {
  const fetchData = async () => {
      try {
          const response = await fetch("/api/swapstart", {
              method: "POST",
              body: JSON.stringify(formValues),
              headers: {
                  "Content-Type": "application/json",
              },
          });
          const data = await response.json();
          // console.log(data)
          setCurrencyData(data); // Update state with fetched data
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };

  fetchData(); // Call the fetchData function when the component mounts
}, []);

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
  
  async function handleFlames(){

    let resp:any = await servFlames(account)
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
                                <div className="row">
                                  <div className="col-lg-6">
                                  <div className="cs-hero_text">
                                      <h1 className="cs-hero_title"  dangerouslySetInnerHTML={{ __html: mainTitle }} style={{fontFamily: 'Comfortaa'}}></h1>
                                      <div className="cs-hero_subtitle cs-medium" style={{fontFamily: 'Comfortaa'}}>{subTitle}</div>
                                      <div className="cs-hero_btns">
                                      <a href="https://ahp.xft.red" target='_blank' className="cs-hero_btn cs-style1 cs-color1 d-block d-lg-none">
                                        <span className="white-text">Hyenas</span>
                                      </a>
                                      <a href="https://ahp.xft.red" target='_blank' className="cs-hero_btn cs-style1 cs-color1 d-none d-lg-block">
                                          <span className="white-text">Hyena Pets</span>
                                        </a>
                                      <a href="/swap/0/0" className="cs-hero_btn cs-style1 cs-color2"><span className="white-text">xSwap</span></a>
                                      <a href="/xmash/0" className="cs-hero_btn cs-style1 cs-color1"><span className="white-text">xMash</span></a>
                                      
                                      </div>
                                    </div>
                                  </div>
                                  {/* <div className="col-lg-6 text-center  d-none d-lg-block">
                                    <div className="row">
                                    <div className="col-lg-9 offset-lg-3 p-4" style={{ backgroundColor: 'rgba(233, 233, 233, 0.8)', borderRadius: '9px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border: '1px solid' }}>
                                      
                                      <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}>xSwap</h4>
                                      
                                    </div>
                                    </div>
                                  </div> */}
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
              <h2 className="cs-section_heading cs-style1 text-center">XFT (NFT) Labels</h2>
              <div className="cs-height_45 cs-height_lg_45"></div>
                <div className="row">
                  {/* <div className="col-lg-2 col-sm-4 col-6">
                  <a href="https://xft.red/search/african%20hyena%20pets" className="cs-card cs-style1 cs-box_shadow text-center cs-white_bg">
                    <div className="cs-card_thumb" >
                    <Image
                    src="/img/pets/27.png"
                    alt="Image"
                    className="cs-zoom_item"
                    width='200'
                    height='200'
                    // onLoad={handleImageLoad}
                />                    </div>
                    <p className="cs-card_title" style={{fontFamily: 'Comfortaa'}}>Hyena Pets</p>
                    </a>
                  </div> */}
                  
                  <div className="col-lg-2 col-sm-4 col-6 offset-lg-1">
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
                    <div className="cs-card_thumb" onClick={handleFlames}>
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
          <div className="cs-height_70 cs-height_lg_40"></div>
          <section>
            <div className="container">
              <div className="cs-cta cs-style1 cs-bg" style={{backgroundImage: "url('/assets/images/ahpbg2.webp')"}}>
                <div className="cs-cta_img">
                  <Image
                      src="/assets/images/496.png"
                      alt="Image"
                      className="cs-zoom_item"
                      width='400'
                      height='300'
                      style={{ borderRadius: '33px', border: '3px solid white' }}
                      // onLoad={handleImageLoad}
                  /> 
                  
                  </div>
                  <div className="cs-cta_right">
                  <div style={{ backgroundColor: 'white', border: '1px solid black', borderRadius: '10px', color: 'black', padding:'25px' }}>
                    <h2 className="cs-cta_title text-center mt-10" style={{ fontFamily: 'Comfortaa', lineHeight:'54px' }}>
                      Hyena Pets <br/> nft's of the future
                    </h2>
                    <div className="cs-cta_subtitle text-center" style={{ fontFamily: 'Comfortaa', lineHeight:'33px' }}>
                      These mythical, magical, battle-able pet hyenas are the 1st generative xFt's. Each pet has a vault to store assets. <br/>Lock assets in the vault of your xFt till a future date
                    </div>
                    <div className="text-center">
                    <a href="https://ahp.xft.red" target='_blank' className="cs-btn cs-style1 cs-btn_lg" style={{ color: 'white' }}>
                      <span>Mint Yours Now</span>
                    </a>

                    </div>
                  </div>


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
                          <span className="cs-card_like cs-primary_color" onClick={() => openLoveModal(item.id,item.profile.account)} >
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
                                src={item.profile.avatar}
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
                    <h2 className="cs-iconbox_title" >XFT (XTHOS) Token</h2>
                    <div className="cs-iconbox_subtitle">An innovative DEFI token that feeds the big vault</div>
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
                      <h2 className="cs-iconbox_title">Big Vault</h2>
                      <div className="cs-iconbox_subtitle">A community vault for community loans and refunds </div>
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
                      <h2 className="cs-iconbox_title">XFT's</h2>
                      <div className="cs-iconbox_subtitle">Smarter, more dynamic, more collaborative NFTs</div>
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
                      <div className="cs-iconbox_subtitle">SPEED, POWER, DEFENSE etc.. Attributes As Tokens</div>
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
              <div className="cs-cta cs-style1 cs-bg" style={{backgroundImage: "url('/img/cta_bg.jpeg')"}}>
                <div className="cs-cta_img">
                  <Image
                      src="/grabbit/9.jpeg"
                      alt="Image"
                      className="cs-zoom_item"
                      width='400'
                      height='300'
                      style={{borderRadius:'33px'}}
                      // onLoad={handleImageLoad}
                  /> 
                  
                  </div>
                  <div className="cs-cta_right">
                    <h2 className="cs-cta_title cs-white_color_8" style={{fontFamily: 'Comfortaa'}}>xMash! &amp; WIN NFTs! WIN Crypto! A mash button game to win nfts and crypto.</h2>
                    <div className="cs-cta_subtitle cs-white_color_8">xMash is a fun, fast paced, rapid fire, mash button game. Slap, Grab, or Sneak your way to winning awesome crypto prizes. .</div>
                    <a href="/xmash/0" className="cs-btn cs-style1 cs-btn_lg"><span>Play xMash</span></a>
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
                  <h2 className="cs-section_title">XFT Blogs</h2>
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
                <a href="/blog/1" className="cs-post_thumb">
                <div className="cs-post_thumb_in cs-bg" data-src="/img/general_26.jpeg" style={{backgroundImage: "url('/assets/images/nft2.jpeg')"}}></div>
                </a>
                <div className="cs-post_info">
                <h2 className="cs-post_title" style={{fontFamily: 'Comfortaa'}}><a href="#">Welcome to NFT 2.0</a></h2>
                <div className="cs-post_subtitle">In the blink of an eye, Non-Fungible Tokens (NFTs) stormed the tech landscape, catching the attention of artists, investors, and enthusiasts alike...</div>
                <div className="cs-height_20 cs-height_lg_20"></div>
                </div>
                </div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                </div>

                <div className="col-lg-4">
                <div className="cs-post cs-style1">
                <a href="/blog/2" className="cs-post_thumb">
                <div className="cs-post_thumb_in cs-bg" data-src="/img/general_27.jpeg" style={{backgroundImage: "url('/img/general_27.jpeg')"}}></div>
                </a>
                <div className="cs-post_info">
                <h2 className="cs-post_title" style={{fontFamily: 'Comfortaa'}}><a href="#">The Genius of Labels</a></h2>
                <div className="cs-post_subtitle">In the realm of innovation, the path to progress is often paved with reinvention. Tesla redefined the truck with a vision of the future, and similarly, our NFT marketplace...</div>
                <div className="cs-height_20 cs-height_lg_20"></div>

                </div>
                </div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                </div>

                <div className="col-lg-4">
                <div className="cs-post cs-style1">
                <a href="/blog/3" className="cs-post_thumb">
                <div className="cs-post_thumb_in cs-bg" data-src="/img/general_28.jpeg" style={{backgroundImage: "url('/img/general_28.jpeg')"}}></div>
                </a>
                <div className="cs-post_info">
                <h2 className="cs-post_title" style={{fontFamily: 'Comfortaa'}}><a href="#">Show Love</a></h2>
                <div className="cs-post_subtitle">The advent of Web 2.0 brought us platforms like Facebook, where the value of creative expression was distilled into the simplicity of a "like" button. While users experienced...</div>
                <div className="cs-height_20 cs-height_lg_20"></div>
                
                </div>
                </div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                </div>

              </div>
            </div>
          </section>
          
          {isNFTModalOpen && ( 
            <Modal onClose={handleCloseNFTModal} title="XFT">
                <div className="cs-single_post">
                  <p style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>XFT's are NFT 2.0. We attach a smart contract to your NFT (making it an XFT). This groundbreaking feature opens up a realm of possibilities for creators, offering avenues for collector incentives, gamification, puzzles, and beyond.
                </p>
              </div>
            </Modal>
        
        )}
        {isLabelModalOpen &&  (
            <Modal onClose={handleCloseLabelModal} title="XAPPS">
              <div className="cs-single_post">
                <p style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>XAPPS are innovative decentralized applications within the XFT excosystem. <br/><br/> XAPPS are also products that are so innovative, we must introduce them to our community.<br/>
                
                </p>
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa', marginTop:'13px'}}>
                  <b>current xapps</b><br/><b>xFT</b>: better more dynamic nft's<br/><b>Grabbit</b>: a fun, fast paced game to win crypto, nfts and other prizes<br/>
                  <b>Esports</b>: compete in heads up  battles on your console or pc for crypto prizes and nftea's

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
                  Show Love to awesome art works.<br/>Unlike the like button with no rewards, showing love earns the art work a tip from the big vault.
                </p>
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}> Big Vault: {_teaPot}</p>
                <div className="cs-height_20 cs-height_lg_20"></div>
                {/* <p className="text-center">live soon</p> */}
                <button onClick={() => handleShowLove()} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Show Love</span></button>

              </div>
            </Modal>
        
        )}
        {isTokenModalOpen &&  (
            <Modal onClose={handleTokenModal} title="xTHOS Token">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                                  
                </p>
                <p className="text-center mt-10" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}> <b>Tokenomics</b></p>
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}> supply: 24,000,000 <br/>up to 5% development<br/>up to 5% marketing/donations<br/>up to 3% static reflections<br/><br/>This is a rebrand from the NFTea token, holders are able to redeem the equivilent of % of NFTea tokens held in wallet at time of recording (1/24/2024). Holders can also request other tokens including meme tokens in our ecosystem.</p>
                <div className="cs-height_20 cs-height_lg_20"></div>
                {/* <p className="text-center mb-3"><a href="https://www.dextools.io/app/en/bnb/pair-explorer/0x3acd58d9cc879bed0b0b5313466c9116176bc242" target='_blank' style={{textDecoration:'none'}}>Dextools</a></p>
                <p className="text-center"><a href="https://pancakeswap.finance/swap?outputCurrency=0xb4668238Acf0314A7b4e153368e479fCd2E09831" target='_blank' className="cs-btn cs-style1 cs-btn_lg w-100"><span>Buy</span></a></p> */}
              
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
                Transform your XFT set into a gamified experience with Assets as Attributes. Move beyond static attributes like speed, power, defense, flight, and attack. In this innovative approach, these attributes are represented by DEFI tokens, securely stored in your XFT.
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              
              </div>
            </Modal>
        
        )}
        
        </>
    )
}
export default Start;
