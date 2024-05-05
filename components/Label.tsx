'use client';
import React, { Component } from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import axios from "axios";
import { BigNumber } from 'bignumber.js';
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
import SideLabel from "./LabelSide";

import { setWalletProvider,servDisplays,servLove,servBalances, servLabel,servIPFS, servStats,servLabelSales,servLabelDisplay,servWrapedToLabel } from '../services/web3Service';
const BLANK = '0x0000000000000000000000000000000000000000';

const Label = ({label}:any) => {
    const router = useRouter();
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [_labelData, setLabelData]:any = useState('');
    const [_labelChildren, setLabelChildren]:any = useState([]);
    const [_showLabel, setShowLabel]:any = useState('');
    const [_showLabelChildren, setShowLabelChildren]:any = useState('');
    const [_showStats, setShowStatus]:any = useState('');
    const [_labelId, setLabelId]:any = useState('');
    const [_royaltea, setRoyaltea]:any = useState('');
    const [_stats, setStats]:any = useState('');
    const [_activeTab, setActiveTab]:any = useState();
    const [_sale, setSale]:any = useState([]);
    const [_wraps, setWraps]:any = useState([]);
    const [_showSale, setShowSale]:any = useState(false);
    const [_display, setDisplay]:any = useState([]);
    const [_showDisplay, setShowDisplay]:any = useState(false);
    const [_showWraps, setShowWraps]:any = useState(false);
    const [_contractAddress, setContractAddress]:any = useState();
    const [_tab, setTab]:any = useState();
    const [_loading, setLoading]:any = useState(false)

    const [labelInfo, setLabelInfo]:any = useState({
        image: 'path/to/image.jpg',
        name: 'Label Name',
        dataArray: [],
        // other variables
      });

      useEffect(()=>{
        $('.cs-tabs.cs-fade_tabs .cs-tab_links a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');
        $('.cs-tabs ' + currentAttrValue)
          .fadeIn(400)
          .siblings()
          .hide();
        $(this).parents('li').addClass('active').siblings().removeClass('active');
        e.preventDefault();
      });
  }, [_activeTab])
    
    useEffect(() => {
        if (connected && account) {
            // console.log(walletProvider.provider)
            setWalletProvider(provider);
            handleStart(account)
        
        }
      }, [account, connected]);

      React.useEffect(() => {

        if(_labelData){
            setShowLabel(true)
        }

    }, [_labelData]);
    React.useEffect(() => {

        if(_labelChildren.length>0){
            // setShowLabel(true)
            // console.log(_labelChildren)
            setShowLabelChildren(true)
        }

    }, [_labelChildren]);

    React.useEffect(() => {

        if(_labelId>0){

            handleStats()
        }

    }, [_labelId]);
    
    React.useEffect(() => {
        
        if(_stats){
            
            setShowStatus(true)
        }
    
    }, [_stats]);

    React.useEffect(() => {
        
        if(_sale.length>0){
            setShowSale(true)
        }else{}
    
    }, [_sale]);

    React.useEffect(() => {
        
        if(_wraps.length>0){
            setShowWraps(true)
        }
    
    }, [_wraps]);
    
    React.useEffect(() => {
        // console.log(_display)
        if(_display.length>0){
            
            setShowDisplay(true)
        
        }
    
    }, [_display]);
    
    // React.useEffect(() => {
        
    //     if(_activeTab){
    //         setTab(_activeTab)
        
    //     }
    
    // }, [_activeTab]);


    const handleHexToString = async (hex:any) => {
        let string = '';
        for (let i = 2; i < hex.length; i += 2) {
          const byte = parseInt(hex.substr(i, 2), 16);
          string += String.fromCharCode(byte);
        }
        return string;
      }

    async function handleStart(user_:any){
        setLoading(true)
        //check if label is linked to a main label
        let respLabel_:any = await servLabel(0, label)
        // console.log(respLabel_)
        //
        // console.log(respLabel_)
        setContractAddress(respLabel_.label[0].addresses[4])
        let labelipfs_:any = await servIPFS(respLabel_.label[0][0])
        labelipfs_ = labelipfs_
        // console.log(labelipfs_)
        if(labelipfs_){
            axios.get(labelipfs_)
            .then(async(resp:any)=>{
                if(resp.data){
                    // console.log(resp.data)
                    let childData:any = []
                    let profileData:any = await axios.get(`/api/getProfile?account=${resp.data.creator}`)
                    resp.data.creatorName = profileData.data.artistName
                    resp.data.avatar = profileData.data.avatar
                    resp.data.twitter = profileData.data.twitter
                    resp.data.children = respLabel_.label[1]
                    resp.data.id = respLabel_.label[0][0]
                    resp.data.wallet = respLabel_.label[0][1][2]
                    setLabelId(respLabel_.label[0][0])
                    for (let i = 0; i < resp.data.children.length; i++) {
                        const element = resp.data.children[i];
                        let childipfs_:any = await servIPFS(element)
                        childipfs_ = childipfs_
                       let childresp:any = await axios.get(childipfs_)
                        let childCreator:any = await axios.get(`/api/getProfile?account=${childresp.data.creator}`)
                        childresp.data.creatorName = childCreator.data.name2
                        childresp.data.avatar = childCreator.data.avatar
                        childresp.data.twitter = childCreator.data.twitter
                        childresp.data.id = element
                        childresp.data.key = i
                        childresp.data.tea = 0
                        childresp.data.bnb = 0
                        
                        if(childresp.data){
                            childData.push(childresp.data)
                        }
                    }
                    setLabelChildren(childData)
                    setLabelData(resp.data)
                    console.log(resp.data)
                    setActiveTab(1)
                }
            })
        }
        setLoading(false)
    
    }
    const handleGetSale = async () => {
        setLoading(true)
        let respLabel_:any = await servLabelSales(label)
        if(respLabel_[0].length>0){
            let data:any = [];
            for (let i = 0; i < respLabel_[0].length; i++) {
                const nft = respLabel_[0][i];
                const saleid = respLabel_[1][i];
                const seller = respLabel_[2][i];
                let ipfs_:any = respLabel_[3][i];
                let nftea_ = await axios.get(ipfs_)
                let sellerData:any = await axios.get(`/api/getProfile?account=${seller}`)
                
                data.push({key:i,nftid:nft,saleid:saleid,nftea:nftea_.data, seller:sellerData.data})
            }
            setSale(data)
        }
        setLoading(false)

    }
    
    const handleGetWraps = async () => {
        setLoading(true)
        let wrapped = await servWrapedToLabel(_contractAddress)
        let data:any = [];
        setLoading(true)
        if(wrapped[0].length>0){
           for (let i = 0; i < wrapped[0].length; i++) {
                const nft = wrapped[0][i];
                const bnb = wrapped[1][i];
                const tea = wrapped[2][i];
                let ipfs_:any = wrapped[3][i];
                let nftea_ = await axios.get(ipfs_)
                // console.log(nftea_)
                let creatorData:any = await axios.get(`/api/getProfile?account=${nftea_.data.creator}`)
                creatorData.data.account = nftea_.data.creator
                data.push({key:i,nftid:nft,bnb:bnb,tea:tea, nftea:nftea_.data, creator:creatorData.data})
            }
        }
        setWraps(data)
        setLoading(false)
        // console.log(data)

    }
    
    const handleGetDisplays = async () => {
        setLoading(true)
        let respLabel_:any = await servLabelDisplay(label)
        if(respLabel_[0].length>0){
            let data:any = [];
            for (let i = 0; i < respLabel_[0].length; i++) {
                let key:any = i
                const nft = respLabel_[0][i];
                const teaBalance = respLabel_[1][i];
                const holder = respLabel_[2][i];
                let ipfs_:any = respLabel_[3][i];
                let nftea_ = await axios.get(ipfs_)
                let holderData:any = await axios.get(`/api/getProfile?account=${holder}`)
                holderData.data.account = holder
                console.log(teaBalance)
                data.push({key:key,nftid:nft,teaBalance:parseInt(teaBalance),nftea:nftea_.data, holder:holderData.data})
            }
            setDisplay(data)
            // console.log(_tab)
            // console.log(data)
        }
        setLoading(false)
    }
    
    async function handleStats(){
        let stats:any = await servStats(_labelId, account)
        setRoyaltea(stats.royaltea)
        setStats(stats.volume)
        console.log(stats)
    }
    const handleTab = async (value_:any) => {
        if(value_==1){
            // event.preventDefault();
            
            handleStart(account);
            setActiveTab(1)
        }
        if(value_==2){
            // event.preventDefault();

            handleGetSale();
            setActiveTab(2)
        }
        if(value_==3){
            // event.preventDefault();

            handleGetDisplays();
            setActiveTab(3)
        }
        if(value_==4){
            // event.preventDefault();
            
            handleGetWraps()
            setActiveTab(4)
        }
        if(value_==5){
            // event.preventDefault();
            
            handleStats()
            setActiveTab(5)
        }
        
        
    }
    function formatNumber(value:any) {
        const suffixes = ["", "K", "M", "B", "T", "Q"];
        const tier = Math.floor(Math.log10(value) / 3);
      
        if (tier < suffixes.length) {
          const suffix = suffixes[tier];
          const scale = Math.pow(10, tier * 3);
          const scaled = value / scale;
      
          return scaled.toFixed(suffix === '' ? 0 : 1) + suffix;
        } else {
          // If the tier is too large, return the value as is
          return value.toFixed(0);
        }
        // const suffixes = ["", "K", "M", "B", "T"];
        // const tier = Math.floor(Math.log10(value) / 3);
      
        // if (tier < suffixes.length) {
        //   const suffix = suffixes[tier];
        //   const scale = Math.pow(10, tier * 3);
        //   const scaled = value / scale;
      
        //   return scaled.toFixed(1) + suffix;
        
        // } else {
        //   // If the tier is too large, you can return the original value or handle it as needed
        //   return value;
        // }
      }
    return(
        <>
            <div className="cs-height_90 cs-height_lg_80"></div>
          <div className="cs-height_100 cs-height_lg_70"></div>
            <div className='container'>
      
            <div className="cs-cover_photo cs-bg" style={{backgroundImage: "url('/img/cover-photo.jpeg')"}}>
              <button className="cs-edit_cover cs-center">
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M29.9062 24.75H26.8125V21.6562C26.8125 21.3827 26.7039 21.1204 26.5105 20.927C26.3171 20.7336 26.0548 20.625 25.7812 20.625C25.5077 20.625 25.2454 20.7336 25.052 20.927C24.8586 21.1204 24.75 21.3827 24.75 21.6562V24.75H21.6562C21.3827 24.75 21.1204 24.8586 20.927 25.052C20.7336 25.2454 20.625 25.5077 20.625 25.7812C20.625 26.0548 20.7336 26.3171 20.927 26.5105C21.1204 26.7039 21.3827 26.8125 21.6562 26.8125H24.75V29.9062C24.75 30.1798 24.8586 30.4421 25.052 30.6355C25.2454 30.8289 25.5077 30.9375 25.7812 30.9375C26.0548 30.9375 26.3171 30.8289 26.5105 30.6355C26.7039 30.4421 26.8125 30.1798 26.8125 29.9062V26.8125H29.9062C30.1798 26.8125 30.4421 26.7039 30.6355 26.5105C30.8289 26.3171 30.9375 26.0548 30.9375 25.7812C30.9375 25.5077 30.8289 25.2454 30.6355 25.052C30.4421 24.8586 30.1798 24.75 29.9062 24.75Z" fill="url(#paint0_linear_1353_5467)"></path>
                <path d="M17.5312 24.75H5.15625C4.88275 24.75 4.62044 24.6414 4.42705 24.448C4.23365 24.2546 4.125 23.9923 4.125 23.7188V5.15625C4.125 4.88275 4.23365 4.62044 4.42705 4.42705C4.62044 4.23365 4.88275 4.125 5.15625 4.125H23.7188C23.9923 4.125 24.2546 4.23365 24.448 4.42705C24.6414 4.62044 24.75 4.88275 24.75 5.15625V17.5312C24.75 17.8048 24.8586 18.0671 25.052 18.2605C25.2454 18.4539 25.5077 18.5625 25.7812 18.5625C26.0548 18.5625 26.3171 18.4539 26.5105 18.2605C26.7039 18.0671 26.8125 17.8048 26.8125 17.5312V5.15625C26.8125 4.33574 26.4866 3.54883 25.9064 2.96864C25.3262 2.38845 24.5393 2.0625 23.7188 2.0625H5.15625C4.33574 2.0625 3.54883 2.38845 2.96864 2.96864C2.38845 3.54883 2.0625 4.33574 2.0625 5.15625V23.7188C2.0625 24.5393 2.38845 25.3262 2.96864 25.9064C3.54883 26.4866 4.33574 26.8125 5.15625 26.8125H17.5312C17.8048 26.8125 18.0671 26.7039 18.2605 26.5105C18.4539 26.3171 18.5625 26.0548 18.5625 25.7812C18.5625 25.5077 18.4539 25.2454 18.2605 25.052C18.0671 24.8586 17.8048 24.75 17.5312 24.75Z" fill="url(#paint1_linear_1353_5467)"></path>
                <path d="M11.3438 11.3438C12.7676 11.3438 13.9219 10.1895 13.9219 8.76562C13.9219 7.34177 12.7676 6.1875 11.3438 6.1875C9.91989 6.1875 8.76562 7.34177 8.76562 8.76562C8.76562 10.1895 9.91989 11.3438 11.3438 11.3438Z" fill="url(#paint2_linear_1353_5467)"></path>
                <path d="M7.51781 14.7367L6.1875 16.0773V22.6876H22.6875V16.0773L18.2634 11.6429C18.1676 11.5463 18.0535 11.4696 17.9278 11.4172C17.8022 11.3648 17.6674 11.3379 17.5312 11.3379C17.3951 11.3379 17.2603 11.3648 17.1347 11.4172C17.009 11.4696 16.8949 11.5463 16.7991 11.6429L11.3438 17.1086L8.98219 14.7367C8.88632 14.64 8.77226 14.5633 8.64659 14.511C8.52093 14.4586 8.38614 14.4316 8.25 14.4316C8.11386 14.4316 7.97907 14.4586 7.85341 14.511C7.72774 14.5633 7.61368 14.64 7.51781 14.7367Z" fill="url(#paint3_linear_1353_5467)"></path>
                <defs>
                <linearGradient id="paint0_linear_1353_5467" x1="20.625" y1="20.625" x2="32.9893" y2="26.8849" gradientUnits="userSpaceOnUse">
                <stop offset="0"stopColor ="#FC466B"></stop>
                <stop offset="1" stopColor="#3F5EFB"></stop>
                </linearGradient>
                <linearGradient id="paint1_linear_1353_5467" x1="2.0625" y1="2.0625" x2="31.7368" y2="17.0862" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FC466B"></stop>
                <stop offset="1" stopColor="#3F5EFB"></stop>
                </linearGradient>
                <linearGradient id="paint2_linear_1353_5467" x1="8.76562" y1="6.1875" x2="14.9478" y2="9.31744" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FC466B"></stop>
                <stop offset="1" stopColor="#3F5EFB"></stop>
                </linearGradient>
                <linearGradient id="paint3_linear_1353_5467" x1="6.1875" y1="11.3379" x2="22.3081" y2="23.2031" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FC466B"></stop>
                <stop offset="1" stopColor="#3F5EFB"></stop>
                </linearGradient>
                </defs>
                </svg>
              </button>
            </div>
                {!account && (
                    <div className="cs-prifile_wrap">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                                    <h4 className="text-center">Connect Wallet to view label</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                
                )}
                {account && (
                    <>
                <div className="cs-prifile_wrap">
                <SideLabel labelInfo={_labelData} />
                <div className="cs-profile_right">
                    <div className="cs-height_30 cs-height_lg_30"></div>
                    <div className="cs-height_30 cs-height_lg_30"></div>
                    <div className="cs-tabs cs-fade_tabs cs-style1">
                    <div className="cs-medium">
                    <ul className="cs-tab_links cs-style1 cs-medium cs-primary_color cs-mp0 cs-primary_font">
                        <li className="active" style={{fontFamily: 'Comfortaa'}}><a href="#nftea" onClick={() => handleTab(1)}>NFTea</a></li>
                        <li className="" style={{fontFamily: 'Comfortaa'}}><a href="#wraps" onClick={() => handleTab(4)}>Wraps</a></li>
                        <li className="" style={{fontFamily: 'Comfortaa'}}><a href="#forsale" onClick={() => handleTab(2)}>For Sale</a></li>
                        <li className="" style={{fontFamily: 'Comfortaa'}}><a href="#display" onClick={() => handleTab(3)}>On Display</a></li>
                        <li className="" style={{fontFamily: 'Comfortaa'}}><a href="#stats" onClick={() => handleTab(5)}>Info/Stats</a></li>
                    </ul>
                    </div>
                        <div className="cs-height_20 cs-height_lg_20"></div>
                        <div className="cs-tab_content">
                                <div id="nftea" className="cs-tab active">
                                {_showLabelChildren && (
                                     <>
                                    {_labelChildren.map((item:any) => (
                                        <>
                                    <div className="col-xl-3 col-lg-4 col-sm-6" key={item.id}>
                                        <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                                        <span className="cs-card_like cs-primary_color">
                                            <i className="fas fa-heart fa-fw"></i>
                                            0
                                        </span>
                                        <a href={`/view/${item.id}/0/${BLANK}`} className="cs-card_thumb cs-zoom_effect">
                                                    <Image
                                                src={item.image}
                                                alt="Image"
                                                className="cs-zoom_item"
                                                width='200'
                                                height='200'
                                                // onLoad={handleImageLoad}
                                            />
                                        </a>
                                        <div className="cs-card_info">
                                        <a href="#" className="cs-avatar cs-white_bg">
                                        <Image
                                                src={item.avatar}
                                                alt="Image"
                                                className="cs-zoom_item"
                                                width='200'
                                                height='200'
                                                // onLoad={handleImageLoad}
                                            />
                                            <span></span>
                                            </a>
                                            <h3 className="cs-card_title text-center"><a href={`/view/${item.id}/0/${BLANK}`}>{item.name} #{item.id}</a></h3>
                                            <div className="cs-card_price text-center"><b className="cs-primary_color">{item.typeName}</b></div>
                                            <hr/>
                                            <div className="cs-card_footer">
                                            {item.amount==1 && (
                                                <>
                                                <div className="row">
                                                
                                                    <div className="col-6">
                                                        <span> 0 <small> BNB</small></span>
                                                    
                                                    </div>
                                                    <div className="col-6">
                                                        <span> 0 <small> XTHOS</small></span>
                                                    
                                                    </div>
                                                </div>
                                                </>
                                            )}
                                            {item.amount>1 && (
                                                <>
                                                <div className="row">
                                                    <div className="col-6 text-center">
                                                        <div className="cs-tooltip">
                                                            <span className="mdi mdi-content-duplicate"> {formatNumber(item.amount)}</span>
                                                            <div className="cs-tooltiptext">Supply</div>
                                                        </div>
                                                        
                                                    
                                                    </div>
                                                    <div className="col-6 text-center">
                                                            {item.media!=null && (
                                                            <div className="cs-tooltip">
                                                                <span className="mdi mdi-file-video"> yes</span>
                                                                <div className="cs-tooltiptext">Media</div>
                                                            </div>
                                                            )}
                                                            {item.media==null && (
                                                            <div className="cs-tooltip">
                                                                <span className="mdi mdi-file-video"> no</span>
                                                                <div className="cs-tooltiptext">Media</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                </>
                                            )}
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                        </>
                                    
                                    ))}                                     
                                     </>
                                )}
                                    {!_showLabelChildren && !_loading && (
                                        <>
                                                <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                                                    no nft&apos;s linked to this label
                                                </div>
                                        </>
                                    )}
                                    {!_showLabelChildren && _loading && (
                                        <>
                                                <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                                                    loading nfts
                                                </div>
                                        </>
                                    )}
                                </div>
                                <div id="forsale" className="cs-tab">
                                {_showSale && (
                                    
                                    <>
                                        {_sale.map((item:any) => (
                                            <>
                                        <div className="col-xl-3 col-lg-4 col-sm-6" key={item.id}>
                                            <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                                            <span className="cs-card_like cs-primary_color">
                                                <i className="fas fa-heart fa-fw"></i>
                                                0
                                            </span>
                                            <a href={`/view/${item.nftid}/${item.sellid}/${item.seller}`} className="cs-card_thumb cs-zoom_effect">
                                                        <Image
                                                    src={item.nftea.image}
                                                    alt="Image"
                                                    className="cs-zoom_item"
                                                    width='200'
                                                    height='200'
                                                    // onLoad={handleImageLoad}
                                                />
                                            </a>
                                            <div className="cs-card_info">
                                            <a href="#" className="cs-avatar cs-white_bg">
                                            <Image
                                                    src={item.seller.avatar}
                                                    alt="Image"
                                                    className="cs-zoom_item"
                                                    width='200'
                                                    height='200'
                                                    // onLoad={handleImageLoad}
                                                />
                                                <span>{`${item.creator.account.substring(0, 6)}...${item.creator.account.substring(item.creator.account.length - 6)}`}</span>
                                                </a>
                                                <h3 className="cs-card_title text-center"><a href={`/view/${item.nftid}/${item.sellid}/${item.seller}`}>{item.nftea.name} #{item.nftid}</a></h3>
                                                <div className="cs-card_price text-center"><b className="cs-primary_color">{item.typeName}</b></div>
                                                <hr/>
                                                <div className="cs-card_footer">
                                                <div className="row">
                                                {item.amount==1 && (
                                                <>
                                                    <div className="col-6 text-center">
                                                        <span> 0 <small> BNB</small></span>
                                                    
                                                    </div>
                                                    <div className="col-6 text-center">
                                                        <span> 0 <small> XTHOS</small></span>
                                                    
                                                    </div>
                                                </>
                                            )}
                                            {item.amount>1 && (
                                                <>
                                                    <div className="col-6 text-center">
                                                        <div className="cs-tooltip">
                                                            <span className="mdi mdi-content-duplicate"> {formatNumber(item.amount)}</span>
                                                            <div className="cs-tooltiptext">Supply</div>
                                                        </div>
                                                        
                                                    
                                                    </div>
                                                    <div className="col-6 text-center">
                                                            {item.media!=null && (
                                                            <div className="cs-tooltip">
                                                                <span className="mdi mdi-file-video"> yes</span>
                                                                <div className="cs-tooltiptext">Media</div>
                                                            </div>
                                                            )}
                                                            {item.media==null && (
                                                            <div className="cs-tooltip">
                                                                <span className="mdi mdi-file-video"> no</span>
                                                                <div className="cs-tooltiptext">Media</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                                </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>                                    
                                        </>
                                        ))}
                                    </>
                                )}
                                {!_showSale && !_loading && (
                                    <>
                                        <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                                            nothing for sale
                                        </div>
                                    </>
                                )}
                                {!_showSale && _loading && (
                                    <>
                                        <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                                            loading forsale
                                        </div>
                                    </>
                                )}
                                </div>
                                <div id="display" className="cs-tab">
                                {_showDisplay && (
                                    <>
                                    {_display.map((item:any) => (
                                        <>
                                        <div className="col-xl-3 col-lg-4 col-sm-6" key={item.key}>
                                            <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                                            <span className="cs-card_like cs-primary_color">
                                                <i className="fas fa-heart fa-fw"></i>
                                                0
                                            </span>
                                            <a href={`/view/${item.nftid}/0/${BLANK}`} className="cs-card_thumb cs-zoom_effect">
                                                        <Image
                                                    src={item.nftea.image}
                                                    alt="Image"
                                                    className="cs-zoom_item"
                                                    width='200'
                                                    height='200'
                                                    // onLoad={handleImageLoad}
                                                />
                                            </a>
                                            <div className="cs-card_info">
                                            <a href="#" className="cs-avatar cs-white_bg">
                                            <Image
                                                    src={item.holder.avatar}
                                                    alt="Image"
                                                    className="cs-zoom_item"
                                                    width='200'
                                                    height='200'
                                                    // onLoad={handleImageLoad}
                                                />
                                                <span>{`${item.holder.account.substring(0, 6)}...${item.holder.account.substring(item.holder.account.length - 6)}`}</span>
                                                </a>
                                                <h3 className="cs-card_title text-center"><a href={`/view/${item.nftid}/0/${BLANK}`}>{item.nftea.name} #{item.nftid}</a></h3>
                                                <div className="cs-card_price text-center"><b className="cs-primary_color">{item.typeName}</b></div>
                                                <hr/>
                                                <div className="cs-card_footer">
                                                <div className="row">
                                                <div className="col-6 text-center">
                                                        <span> 0 <small> BNB</small></span>
                                                    
                                                    </div>
                                                    <div className="col-6 text-center">
                                                        {item.teaBalance>0 && (
                                                            <span> {formatNumber(item.teaBalance || 0)} <small> XTHOS</small></span>
                                                        
                                                        )}
                                                        {item.teaBalance==0 && (
                                                            <span> 0 <small> XTHOS</small></span>
                                                        
                                                        )}                                                    
                                                    </div>

                                                </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>                                          
                                        </>
                                    ))}
                                    </>
                                )}
                                {!_showDisplay && !_loading && (
                                    <>
                                        <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                                            nothing on display
                                        </div>
                                        
                                        </>
                                )}
                                {!_showDisplay && _loading && (
                                    <>
                                        <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                                            loading display
                                        </div>
                                        
                                        </>
                                )}
                                </div>
                                <div id="wraps" className="cs-tab">
                                    {_showWraps && (
                                        <>
                                            {_wraps.map((item:any) => (
                                            <div className="col-xl-3 col-lg-4 col-sm-6" key={item.key}>
                                                <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                                                <span className="cs-card_like cs-primary_color">
                                                    <i className="fas fa-heart fa-fw"></i>
                                                    0
                                                </span>
                                                <a href={`/view/${item.nftid}/0/${BLANK}`} className="cs-card_thumb cs-zoom_effect">
                                                            <Image
                                                        src={item.nftea.image}
                                                        alt="Image"
                                                        className="cs-zoom_item"
                                                        width='200'
                                                        height='200'
                                                        // onLoad={handleImageLoad}
                                                    />
                                                </a>
                                                <div className="cs-card_info">
                                                <a href="#" className="cs-avatar cs-white_bg">
                                                <Image
                                                        src={item.creator.avatar}
                                                        alt="Image"
                                                        className="cs-zoom_item"
                                                        width='200'
                                                        height='200'
                                                        // onLoad={handleImageLoad}
                                                    />
                                                    <span>{item.creator.artistName}</span>
                                                    </a>
                                                    <h3 className="cs-card_title text-center"><a href={`/view/${item.nftid}/0/${BLANK}`}>{item.nftea.name} #{item.nftid}</a></h3>
                                                    <div className="cs-card_price text-center"><b className="cs-primary_color">{item.typeName}</b></div>
                                                    <hr/>
                                                    <div className="cs-card_footer">
                                                    <div className="row">
                                                        <>
                                                            <div className="col-6 text-center">
                                                                <span> {item.bnb} <small> BNB</small></span>
                                                            
                                                            </div>
                                                            <div className="col-6 text-center">
                                                                {item.tea>0 && (
                                                                <span> {formatNumber(item.teaBalance || 0)} <small> XTHOS</small></span>
                                                            
                                                            )}
                                                            {item.tea==0 && (
                                                                <span> 0 <small> XTHOS</small></span>
                                                            
                                                            )}                                                             
                                                            </div>
                                                        </>
                                                    </div>
                                                    </div>
                                                </div>
                                                </div>
                                            </div> 
                                        ))}
                                        </>
                                    )}
                                    {!_showWraps && !_loading && (
                                        <>
                                            <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                                                nothing wrapped
                                            </div>
                                        </>
                                    )}
                                    {!_showWraps && _loading && (
                                        <>
                                            ç
                                        </>
                                    )}
                                </div>
                                <div id="stats" className="cs-tab">
                                    {_showStats && (
                                        <>
                                            <div className="row pb-5">
                                                <div className="col-12">
                                                    <div className="cs-sidebar_widget cs-box_shadow cs-white_bg" style={{lineHeight:'36px'}}>
                                                    <h2 className="cs-widget_title"><span>Story</span></h2>

                                                        <p>{_labelData.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="cs-sidebar_widget cs-box_shadow cs-white_bg h4">
                                                    <h2 className="cs-widget_title"><span>Stats</span></h2>
                                                        <p className="pb-1">volume: {_stats[0] || 0} XTHOS</p>
                                                        <p className="pb-1">royalties paid: {_royaltea[1] || 0} XTHOS</p>
                                                        <p className="pb-1">royalties collected: {_royaltea[2] || 0} XTHOS</p>
                                                        <p className="pb-1">buyers: {_stats[1].length || 0}</p>
                                                        <p>your royalteas: {_royaltea[4] || 0} XTHOS </p>
                                                    
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="cs-sidebar_widget cs-box_shadow cs-white_bg h4">
                                                        <h2 className="cs-widget_title"><span>Details</span></h2>
                                                        <p className="pb-1">type: {_labelData.typeName}</p>
                                                        <p className="pb-1">id: #{_labelData.id}</p>
                                                        <p className="pb-1">supply: {_labelData.amount}</p>
                                                        {_labelData.id!=7 && (
                                                            <p>url: <a href={`${_labelData.external_url}}`} target="_blank">{_labelData.external_url}</a> </p>
                                                        
                                                        )}                                                       
                                                        {_labelData.id==7 && (
                                                            <p>url: <a href="https://ahp.nftea.app">https://ahp.nftea.app</a> </p>
                                                        
                                                        )}
                                                        {_labelData.wallet && (
                                                            <p>Wallet: <a href={`https:///bscscan.com/${_labelData.wallet}}`} target="_blank">{`${_labelData.wallet.substring(0, 6)}...${_labelData.wallet.substring(_labelData.wallet.length - 6)}`}</a> </p>
                                                        
                                                        )}
                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                        </div>
                    </div>
                </div>

                </div>
                </>
                )}
            </div>
        </>
    )

    }
    export default Label;