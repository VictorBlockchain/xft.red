'use client';
import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import ReactPlayer from 'react-player'
import axios from "axios";
import moment from 'moment';
import {create as ipfsHttpClient}  from "ipfs-http-client";
import { BigNumber } from 'bignumber.js';
import { setWalletProvider,servBag, servDisplay,servSellApproveCheck,servLastMarket,servLabel,servSell,servUnsell,servBuy,servApproveToken, servApproveNFT,servTransfer,servMediaAdd,servTokenAllowance,servLabelStats,servDisplayRemove,servOperator,servLicenseCheck,servExpireCheck,servHolders,servBalances,servLove,servUnWrap,servDisplayEarnings,servEditLinkedTo } from '../services/web3Service';
import { servNFTbalance } from '../services/web3Service';
import { servNFT } from '../services/web3Service';
import { servNFT2Label } from '../services/web3Service';
import { servSale } from '../services/web3Service';
import { servMediaAttributes } from '../services/web3Service';
import MediaComponent from "./Media"
import { AnyARecord } from 'dns';
import dotenv from 'dotenv';
import DisplayDescription from './DisplayDescription';
import { useUser } from './UserContext';
import { useSDK } from '@metamask/sdk-react';
import Modal from './Modal';
import { setTimeout } from 'timers/promises';
import {
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    WeiboIcon,
    WeiboShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
  } from "react-share";
dotenv.config();
const BLANK:any = '0x0000000000000000000000000000000000000000';
const teaToken = process.env.teaToken;
const shopLogic = process.env.shopLogic;
const teaPot = process.env.teaPot;
const mintLogic = process.env.mintLogic;

const Grabbit = ({ play }:any) => {
    const router:any = useRouter()
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [activeTab, setActiveTab] = useState('all'); 
    const [_games, setGames]:any = useState([]);
    const [_game, setGame]:any = useState([]);
    const [_timer, setTimer]:any = useState(0);
    const [_players, setPlayers]:any = useState([]);
    const [_showGames, setShowGames]:any = useState(false);
    const [_showGame, setShowGame]:any = useState(false);
    const [_showPlayers, setShowPlayers]:any = useState(false);
    const [_isPlayModalOpen, setIsPlayModalOpen]:any = useState(false)
    const [_isProfileModalOpen, setIsProfileModalOpen]:any = useState(false)
    const [_isCreateModalOpen, setIsCreateModalOpen]:any = useState(false)
    const [_playid, setPlayId]:any = useState(0)
    const [_msg, setMessage]:any = useState()
    const [_profile, setProfile]:any = useState([])
    const [_inGame, setInGame]:any = useState(false)
    const grabbitSSE = useRef<EventSource | null>(null);
    const shareUrl = "https://nftea.app/xmash/"+play;
    const title = "come play #Grabbit with me, a fun game to win crypto & NFTs";

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
  }, [_game,_games,activeTab])
    
    useEffect(() => {
        if (connected && account) {
            // console.log(walletProvider.provider)
            setWalletProvider(provider);
            handleGetProfile()
            // handleStart(play)
                
        }
      }, [account, connected]);
    
    useEffect(()=>{
        if(_games.length>0){
            setShowGames(true)
            setShowGame(false)
        }
    },[_games])
    
    useEffect(()=>{
        if(_game){
            setShowGame(true)
            setShowGames(false)
        }
    },[_game])
    
    useEffect(() => {
        if (_players) {
          setShowPlayers(true);
          const isInGame = _players.some((item: any) => item.game === play && item.player === account);
          if (isInGame) {
            setInGame(true);
          }else{
            setInGame(false)
          }
        }
      }, [_players, _game]);
      
    useEffect(() => {
        if (!grabbitSSE.current) {
          grabbitSSE.current = new EventSource('/api/grabbit/timer_sse?play='+play);
          
          grabbitSSE.current.addEventListener('open', (e: any) => {
            console.log('SSE Connection opened');
          });
          
          grabbitSSE.current.addEventListener('message', (e: any) => {
            let data = JSON.parse(e.data);
            // console.log(data)
            if(play==0){
                setGames(data)
            }else{
                setGame(data)
                setPlayers(data.players)
                setTimer(data.timer)
                  
            }
            
            // setMessages(data.reverse());
          });
          
          grabbitSSE.current.addEventListener('error', function (e: any) {
            console.error('SSE Connection error:', e);
          });
        }
        
        return () => {
          if (grabbitSSE.current) {
            grabbitSSE.current.close();
            grabbitSSE.current = null;
          }
        };
      }, [play]);

      const handleTabClick = async(tab:any) => {
        let type:any = 0;
        if(tab=="nftea"){
            type = 1
        }
        if(tab=="crypto"){
            type = 2
        }
        if(tab=="practice"){
            type = 3
        }
    
        const data = { play };
        const JSONdata = JSON.stringify(data);
        const endpoint = '/api/getGrabbit';
        const cacheBuster = new Date().getTime();
        const urlWithCacheBuster = `${endpoint}?cacheBuster=${cacheBuster}`;
        
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        };
  
        const response = await fetch(urlWithCacheBuster, options);
        const result: any = await response.json();
        if(type>0){
            let data:any = []
            for (let i = 0; i < result.game.length; i++) {
                const element = result.game[i];
                if(element.type== type){
                    data.push(element)
                }  
            }
            setGames(data)
        }else{
            
            setGames(result.game)
        }
        setActiveTab(tab);
    };

    function handlePlayModal() {
        
        if(_isPlayModalOpen){
            
            setIsPlayModalOpen(false);
            setMessage('')
        
        }else{
            setIsPlayModalOpen(true);
        }
        
      }

      function handleProfileModal() {
        
        if(_isProfileModalOpen){
            
            setIsProfileModalOpen(false);
            setMessage('')
        
        }else{
            setIsProfileModalOpen(true);
        }
        
      }

      function handleCreateModal() {
        
        if(_isCreateModalOpen){
            
            setIsCreateModalOpen(false);
            setMessage('')
        
        }else{
            setIsCreateModalOpen(true);
            handleTabClick('create')
        }
        
      }
    
      const handleGetProfile = async () => {
        try {
           let data = await axios.get(`/api/getProfile?account=${account}`)
           if(data.data){
            data.data.account = account
            setProfile(data.data)
           }
        } catch (err) {
          console.error(err);
        }
      };
    

    
    
    const handleGrab = async () => {
    
        let data_ = {
            play,
            account
          }
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/setGrab'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        console.log(result)
        setMessage(result.msg)
    
    }
    const handleSlap = async () => {
    
        let data_ = {
            play,
            account
          }
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/setSlap'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        setMessage(result.msg)
        console.log(result)

    }
    const handleSneak = async () => {
    
        let data_ = {
            play,
            account
          }
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/setSneak'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        setMessage(result.msg)
        console.log(result)


    }

    const handlePlay = async () => {
        
        let pass = 1
        if(_game.ahpReferralCount>0 && _profile.ahpReferrals<_game.ahpReferralCount){
            setMessage('you have\'t referred enough African Hyena Pets holders')
            pass = 0
        }
        if(pass>0){
            let joinnft = 0
            let data_ = {
                play,
                account,
                joinnft          
              }
            const JSONdata = JSON.stringify(data_)
            const endpoint = '/api/setPlay'
            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSONdata,
            }
            const response = await fetch(endpoint, options)
            const result = await response.json()
            setMessage(result.msg)
            if(result.msg=="create your profile 1st"){
                setIsProfileModalOpen(true)
            }
        }
        // console.log(result)
    }

    const handlePlay2 = async (event:any) => {
        event.preventDefault();
        let joinnft:any = event.target.nftid.value

        let pfp:any = await servBag(joinnft, account)
        let ipfs_:any = pfp[0];
        let nftData:any = await axios.get(ipfs_)
        if(pfp[2][2]>0){
            
            if(_game.nft2PlayLabel!=nftData.data.linkedTo){

                setMessage('this nft is not linked to the required label')

            }else{

                let data_ = {
                    play,
                    account,
                    joinnft          
                  }
                const JSONdata = JSON.stringify(data_)
                const endpoint = '/api/setPlay'
                const options = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSONdata,
                }
                const response = await fetch(endpoint, options)
                const result = await response.json()
                setMessage(result.msg)
                if(result.msg=="create your profile 1st"){
                    setIsProfileModalOpen(true)
                }
            }
        
        }else{
            
            setMessage('you do not own this nftea')
        }

    }
    
    const handleCreate = async (event:any) => {
        
        event.preventDefault();
        let title:any = event.target.title.value
        let type:any = event.target.type.value
        let story:any = event.target.story.value
        let nft2play:any = event.target.nft2play.value
        let nft2playlabel:any = event.target.nft2playlabel.value
        let nft2playcontract:any;
        let grabs:any = event.target.grabs.value
        let slaps:any = event.target.slaps.value
        let sneaks:any = event.target.sneaks.value
        let playersMin:any = event.target.playersMin.value
        let playersMax:any = event.target.playersMax.value
        let prize:any = event.target.prize.value
        let prizeValue:any = event.target.prizeValue.value
        let prizeNftea:any = event.target.prizeNftea.value
        let image:any;
        let prizecontract:any;
        let token2playcontract:any;
        let token2playbalance:any = 0;
        let ahpreferralcount:any = 0;
        let lat = 0;
        let long = 0
        
        if(event.target.prizeNftea.value!=0){
            
            let pfp:any = await servBag(event.target.prizeNftea.value, account)
            let ipfs_:any = pfp[0];
            let nftData:any = await axios.get(ipfs_)
            if(pfp[2][2]>0){
                
                image = nftData.data.image
            
            }else{
                
                setMessage('you do not own this nftea')
            }
        
        }else{
            if(type==1){
                image = "/grabbit/9.jpeg"

            }else{
                const rand = Math.floor(Math.random() * 3) + 6;
                image = '/grabbit/'+rand+'.jpeg'
            }
        }
        
        let data_ = {
            title,
            type,
            story,
            image,
            nft2play,
            nft2playcontract,
            nft2playlabel,
            token2playcontract,
            token2playbalance,
            ahpreferralcount,
            grabs,
            slaps,
            sneaks,
            playersMax,
            playersMin,
            prize,
            prizeValue,
            prizeNftea,
            prizecontract,
            lat,
            long,
            account
          }
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/setGrabbit'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        console.log(result)
        setMessage(result.msg)
        // setMessage("create game is for AHP holders")
    }
    
    
    const handleProfile = async (event:any) => {
        event.preventDefault();
        let name:any = event.target.name.value
        let name2:any = event.target.name2.value
        let email:any = event.target.email.value
        let avatar:any = event.target.avatar.value
        let twitter:any = event.target.twitter.value
        let tiktok:any = event.target.tiktok.value
        let story:any = event.target.story.value
        let phone:any;
        let cover:any;
        
        if(event.target.avatar.value!=0){
            
            let pfp:any = await servBag(event.target.avatar.value, account)
            let ipfs_:any = pfp[0];
            let nftData:any = await axios.get(ipfs_)
            if(pfp[2][2]>0){
                
                avatar = nftData.data.image
            
            }else{
                
                setMessage('you do not own this nftea')
            }
        
        }else{
            
            avatar = "/assets/images/avatar/1.jpeg"
        }
        
        let data_ = {
            email,
            phone,
            account,
            name,
            name2,
            avatar,
            twitter,
            tiktok,
            story,
            cover
          }
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/setProfile'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        setMessage(result.msg)
        console.log(result.msg)
    
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
      }
      return(
      <>
        <div className="cs-height_90 cs-height_lg_80"></div>
        <section className="cs-page_head cs-bg" style={{backgroundImage: "url(/img/page_head_bg.svg)"}}>
            <div className="container">
            <div className="text-center">
            <h1 className="cs-page_title" style={{fontFamily: 'Comfortaa'}}>xMash</h1>
            <ol className="breadcrumb">
            <li className="breadcrumb-item" style={{fontFamily: 'Comfortaa'}}><Link href="/">Home</Link></li>
            <li className="breadcrumb-item active" style={{fontFamily: 'Comfortaa'}}><Link href="/xmash/0">xMash</Link></li>
            </ol>
            </div>
            </div>
        </section>
        <div className="cs-height_30 cs-height_lg_30"></div>
        <div className="container">
        {_showGames && (
            <>
                <div className="cs-isotop_filter cs-style1 cs-center">
                    <ul className="cs-mp0 cs-center">
                        <li className={activeTab === 'all' ? 'active' : ''}>
                            <Link href="#" onClick={() => handleTabClick('all')}>
                                <span>All Games</span>
                            </Link>
                        </li>
                        <li className={activeTab === 'nftea' ? 'active' : ''}>
                            <Link href="#" onClick={() => handleTabClick('nftea')}>
                                <span>xFt</span>
                            </Link>
                        </li>
                        <li className={activeTab === 'crypto' ? 'active' : ''}>
                            <Link href="#" onClick={() => handleTabClick('crypto')}>
                                <span>Crypto</span>
                            </Link>
                        </li>
                        <li className={activeTab === 'practice' ? 'active' : ''}>
                            <Link href="#" onClick={() => handleTabClick('practice')}>
                                <span>Practice</span>
                            </Link>
                        </li>
                        <li className={activeTab === 'create' ? 'active' : ''}>
                            <Link href="#" onClick={() => handleCreateModal()}>
                                <span>Create</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="cs-height_30 cs-height_lg_30"></div>
            </>        
        )}
            {_showGames && (
                <div className="row">
                    {_games.map((item:any) => (
                        <>
                            <div className="col-lg-3 col-md-6 col-sm-12 mb-3" key={item._id}>
                            <div className="cs-isotop cs-style1 cs-has_gutter_30">
                                <div className="cs-grid_sizer"></div>
                                <div className="cs-isotop_item fashion">
                                <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                                    <span className="cs-card_like cs-primary_color">
                                    <i className="fas fa-users fa-fw"></i>
                                        {item.playersReady || 0}/{item.playersMax}
                                    </span>
                                    <Link href={`/xmash/${item._id}`} className="cs-card_thumb cs-zoom_effect">
                                    <img
                                        src={item.image}
                                        alt="Image"
                                        className="cs-zoom_item"
                                        width='600'
                                        height='600'
                                        // onLoad={handleImageLoad}
                                    />
                                    </Link>
                                    <div className="cs-card_info">
                                    <span>{item.title}</span>
                                    <h3 className="cs-card_title text-center"><Link href={`/xmash/${item._id}`}>{item.title}</Link></h3>
                                    <p className="text-center mb-0 pb-0"><small>{item.playersMin} players to start</small></p>
                                    </div>
                                    <hr />
                                    <div className="cs-card_footer">
                                    <div className="text-center">
                                        <Link  href={`/xmash/${item._id}`} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Play</span></Link>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                            </>
                        
                        ))}
                </div>
            )}
            
            {_showGame && (
                <>
                <div className="row">
                    <div className="col-lg-6">
                    <div style={{width: '100%', display: 'inline-block'}}>
                            <div className='cs-slider_thumb_lg'>
                                <img
                                src={_game.image}
                                alt={_game.image}
                                className="cs-zoom_item"
                                width='600'
                                height='600'
                            />
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-6">
                        <div className="cs-height_0 cs-height_lg_40"></div>
                        <div className="cs-single_product_head">
                            <h2 style={{fontFamily: 'Comfortaa'}}>{_game.title}</h2>
                            <p style={{fontFamily: 'Comfortaa'}}>players <span className="cs-accent_color">{_game.playersReady || 0}</span> ~ <span className="cs-accent_color">{_game.playersMax}</span> <small>({_game.playersMin} min)</small></p>
                            <span className="cs-card_like cs-primary_color cs-box_shadow">
                            <i className="fas fa-users fa-fw"></i>
                            {_game.playersReady || 0}/{_game.playersMax}
                            </span>
                        </div>
                        <div className="cs-height_25 cs-height_lg_25"></div>
                        <div className="row">
                            <div className="col-xl-6">
                                <div className="cs-white_bg cs-box_shadow pt-2 pb-1">
                                    {_game.startPlay==0 && _game.start==0 && (
                                        <>
                                            <p className="text-center p-0 m-0" style={{fontFamily: 'Comfortaa'}}>starts with</p>
                                            <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}>{_game.playersMin} players</h4>
                                        
                                        </>
                                    )}
                                    {_game.start==0 && _game.startPlay >0 && (
                                        <>
                                            <p className="text-center p-0 m-0" style={{fontFamily: 'Comfortaa'}}>starts in</p>
                                            <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}>{_timer}</h4>
                                        
                                        </>
                                    )}
                                    {_game.start>0 && _game.end == 0 && (
                                        <>
                                            <p className="text-center p-0 m-0" style={{fontFamily: 'Comfortaa'}}>starts in</p>
                                            <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}>{_timer}</h4>
                                        
                                        </>
                                    )}
                                    {_game.start>0 && _game.end != 0 && (
                                        <>
                                            <p className="text-center p-0 m-0" style={{fontFamily: 'Comfortaa'}}>ends in</p>
                                            <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}>{_timer}</h4>
                                        
                                        </>
                                    )}
                                </div>
                                <div className="cs-height_25 cs-height_lg_25"></div>
                            </div>

                            <div className="col-xl-6">
                                <div className="cs-author_card cs-white_bg cs-box_shadow">
                                <div className="cs-author_img">
                                <img
                                    src={_game.winnerAvatar}
                                    alt={_game.winnerName}
                                    className="cs-zoom_item"
                                    width='100'
                                    height='100'
                                />                            </div>
                                <div className="cs-author_right">
                                <h3 style={{fontFamily: 'Comfortaa'}}>Winner</h3>
                                {_game.winner!=account && (
                                    <p style={{fontFamily: 'Comfortaa', color:'#000'}}>{_game.winnerName || '0x...'}</p>
                                )}
                                {_game.winner==account && (
                                    <p style={{fontFamily: 'Comfortaa', color:'#000'}}>YOU!</p>
                                )}
                                </div>
                                </div>
                                <div className="cs-height_25 cs-height_lg_25"></div>
                            </div>
                        </div>
                        {_game.start==0 && (
                            <>
                                <div className="cs-tabs cs-fade_tabs cs-style1">
                                    <div className="cs-medium">
                                        <ul className="cs-tab_links cs-style1 cs-medium cs-primary_color cs-mp0 cs-primary_font">
                                        <li className="active" style={{fontFamily: 'Comfortaa'}}><Link href="#Description">Game Info</Link></li>
                                        <li><Link href="#Details" style={{fontFamily: 'Comfortaa'}}>Prize Info</Link></li>
                                        <li><Link href="#HowTo" style={{fontFamily: 'Comfortaa'}}>How To Play</Link></li>
                                        </ul>
                                    </div>
                                    <div className="cs-height_20 cs-height_lg_20"></div>
                                    <div className="cs-tab_content">
                                        <div id="Description" className="cs-tab active">
                                        <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                                        <p style={{fontFamily: 'Comfortaa', whiteSpace: 'pre-line'}}>{_game.story} </p>
                                        <p className="text-center p-0 m-0" style={{fontFamily: 'Comfortaa'}}>grabs: <b>{_game.grabs}</b> | slaps: <b>{_game.slaps} </b>| sneaks: <b>{_game.sneaks}</b></p>
                                        {_game.nft2play>0 && (
                                            <p className="text-center pt-2 m-0" style={{fontFamily: 'Comfortaa'}}>nft to play <b>#{_game.nft2play}</b></p>
                                        )}
                                        {_game.nft2PlayLabel>0 && (
                                            <p className="text-center pt-2 m-0" style={{fontFamily: 'Comfortaa'}}>label to play <b>#{_game.nft2PlayLabel}</b></p>
                                        )}
                                        {_game.ahpReferralCount>0 && (
                                            <p className="text-center pt-2 m-0" style={{fontFamily: 'Comfortaa'}}>AHP referrals to play <b>#{_game.ahpReferralCount}</b></p>
                                        )}
                                        </div>
                                        </div>
                                        <div id="Details" className="cs-tab">
                                        <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                                            <h5 className="text-center" style={{fontFamily: 'Comfortaa'}}>prize: {_game.prize || 'n/a'} </h5>
                                            <h5 className="text-center" style={{fontFamily: 'Comfortaa'}}>prize value: {_game.prizeValue || 'n/a'} </h5>
                                            {_game.location && _game.location.coordinates && (
                                                <h5 className="text-center" style={{fontFamily: 'Comfortaa'}}>location: {_game.location.coordinates[0]} lat | {_game.location.coordinates[0]} long </h5>
                                            )}                                
                                        </div>
                                        </div>
                                        <div id="HowTo" className="cs-tab">
                                        <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                                                <h5 className="text-center" style={{fontFamily: 'Comfortaa'}}>How To Play</h5>
                                                <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}>slap after you grab, sneak before you grab</h4>
                                                <h5 className="text-center" style={{fontFamily: 'Comfortaa'}}>hold the prize for 10 or 3 seconds and you win</h5>
                                                <h6 className="text-center" style={{fontFamily: 'Comfortaa'}}>use your grabs, slaps and sneaks wisely.. you only have so many</h6>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {_game.start==0 && !_inGame && (
                        <>  
                            <div className="text-center pt-4">
                                <button  onClick={() => handlePlayModal()} className="cs-btn cs-style1 cs-btn_lg w-100 pt-2"><span>Join Game</span></button>
                            </div>
                            <div className="text-center pt-4">
                            <TwitterShareButton
                                url={shareUrl}
                                title={title}
                                className="Demo__some-network__share-button"
                                >
                                <XIcon size={32} round />
                                </TwitterShareButton>&nbsp;
                                <FacebookShareButton
                                    url={shareUrl}
                                    className="Demo__some-network__share-button"
                                    >
                                    <FacebookIcon size={32} round />
                                    </FacebookShareButton>&nbsp;
                                    <FacebookMessengerShareButton
                                        url={shareUrl}
                                        appId="521270401588372"
                                        className="Demo__some-network__share-button"
                                        >
                                        <FacebookMessengerIcon size={32} round />
                                        </FacebookMessengerShareButton>&nbsp;
                                    <TelegramShareButton
                                    url={shareUrl}
                                    title={title}
                                    className="Demo__some-network__share-button"
                                    >
                                    <TelegramIcon size={32} round />
                                    </TelegramShareButton>&nbsp;
                                    <WhatsappShareButton
                                        url={shareUrl}
                                        title={title}
                                        separator=":: "
                                        className="Demo__some-network__share-button"
                                        >
                                        <WhatsappIcon size={32} round />
                                        </WhatsappShareButton>&nbsp;
                                        <WeiboShareButton
                                        url={shareUrl}
                                        title={title}
                                        image={`${String(window.location)}/${_game.image}`}
                                        className="Demo__some-network__share-button"
                                        >
                                        <WeiboIcon size={32} round />
                                        </WeiboShareButton>
                            </div>
                            <div className="text-center pt-4">
                                <Link  href='/xmash/0' className="cs-btn cs-style1 cs-btn_lg w-100 pt-2"><span>Back</span></Link>
                            </div>
                        </>
                        )}
                        {_game.start==0 && _inGame && (
                        <>  
                        <div className="text-center p-4">
                            <h5 className="text-center" style={{fontFamily: 'Comfortaa'}}>grab some friends</h5>
                            <TwitterShareButton
                                url={shareUrl}
                                title={title}
                                className="Demo__some-network__share-button"
                                >
                                <XIcon size={32} round />
                                </TwitterShareButton>&nbsp;
                                <FacebookShareButton
                                    url={shareUrl}
                                    className="Demo__some-network__share-button"
                                    >
                                    <FacebookIcon size={32} round />
                                    </FacebookShareButton>&nbsp;
                                    <FacebookMessengerShareButton
                                        url={shareUrl}
                                        appId="521270401588372"
                                        className="Demo__some-network__share-button"
                                        >
                                        <FacebookMessengerIcon size={32} round />
                                        </FacebookMessengerShareButton>&nbsp;
                                    <TelegramShareButton
                                    url={shareUrl}
                                    title={title}
                                    className="Demo__some-network__share-button"
                                    >
                                    <TelegramIcon size={32} round />
                                    </TelegramShareButton>&nbsp;
                                    <WhatsappShareButton
                                        url={shareUrl}
                                        title={title}
                                        separator=":: "
                                        className="Demo__some-network__share-button"
                                        >
                                        <WhatsappIcon size={32} round />
                                        </WhatsappShareButton>&nbsp;
                                        <WeiboShareButton
                                        url={shareUrl}
                                        title={title}
                                        image={`${String(window.location)}/${_game.image}`}
                                        className="Demo__some-network__share-button"
                                        >
                                        <WeiboIcon size={32} round />
                                        </WeiboShareButton>
                        </div>
                        </>
                        )}
                        {_game.start>0 && _inGame &&  (
                        <>
                            <div className="row pt-3">
                                <div className="col-4 text-center">
                                    <button  onClick={() => handleSlap()} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Slap</span></button>
                                </div>
                                <div className="col-4 text-center">
                                    <button  onClick={() => handleGrab()} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Grab</span></button>
                                </div>
                                <div className="col-4 text-center">
                                    <button  onClick={() => handleSneak()} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Sneak</span></button>
                                </div>
                            </div>
                            <div className="row pt-4">
                                <div className="col-12 text-center">{_msg}</div>
                            </div>
                        </>
                        )}
                        {_game.start>0 && !_game.active && (
                        <>   <hr/>
                            <div className="row pt-4">
                            <div className="col-6 text-center">End Time <br/>{moment.unix(_game.end / 1000).format("MM/Do YYYY, h:mm:ss a")}</div>
                            <div className="col-6 text-center">Last Grab <br/>{moment.unix(_game.grabTime / 1000).format("MM/Do YYYY, h:mm:ss a")}</div>

                            </div>
                            <div className="row pt-4">
                                <div className="col-12 text-center">
                                    <Link  href="/xmash/0" className="cs-btn cs-style1 cs-btn_lg w-100"><span>back</span></Link>
                                </div>
                            </div>
                        </>
                        )}
                    
                    </div>
                </div>
                <div className="cs-height_95 cs-height_lg_70"></div>
                {_showPlayers && (
                    <>
                        <div className="row">
                            <div className="col-lg-6 offset-lg-3 cs-white_bg cs-box_shadow cs-general_box_5">
                                <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}>players</h4>
                                <div className="text-center">
                                    <table>
                                        <thead><tr><th></th><th>grabs used</th><th>slaps used</th><th>sneaks used</th></tr></thead>
                                        <tbody>
                                        {_players.map((item:any) => (
                                            <tr><td>{item.playerName}</td><td>{item.grabsUsed}</td><td>{item.slapsUsed}</td><td>{item.sneaksUsed}</td></tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                </>
            )}
        </div>
        
        {_isPlayModalOpen &&  (
            <Modal onClose={() => handlePlayModal()} title="Play xMash">
              <div className="cs-single_post">
              {_game.nft2PlayLabel<1 && (
                <>
                    <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                        Sneak before you grab, slap after you grab! <br/>hold the prize for 10 or 3 seconds and you win!
                    </p>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    <hr/>

                </>            
              )}
                {_game.nft2PlayLabel>0 && (
                    <>
                    <div className="row">
                        <div className="col-12 cs-card cs-style4 cs-box_shadow cs-white_bg">
                        <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                                You must have an nft from label #{_game.nft2PlayLabel} <br/>to join this game
                            </p>
                            <form onSubmit={handlePlay2}>         
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                <label className="cs-form_label text-center">enter your nft id</label>
                                <div className="cs-form_field_wrap">
                                    <input name="nftid" id="nftid"  type="text" className="cs-form_field" placeholder="3" required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                    <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Join</span></button>
                            
                            </form>
                        </div>
                    </div>
                    
                    </>
                )}
                {!_msg && _game.nft2PlayLabel<1 && (
                    <div className="text-center">
                        <button  onClick={() => handlePlay()} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Join Game</span></button>
                    </div>
                )}
                {_msg && (
                    <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                )}
              </div>
            </Modal>
        )}
        
        {_isProfileModalOpen &&  (
            <Modal onClose={() => handleProfileModal()} title="Edit Profile">
                <form onSubmit={handleProfile}>         
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Real Name</label>
                    <div className="cs-form_field_wrap">
                        <input name="name" id="name"  type="text" className="cs-form_field" placeholder="john picasso" required />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">User Name</label>
                    <div className="cs-form_field_wrap">
                        <input name="name2" id="name2"  type="text" className="cs-form_field" placeholder="picasso" required />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Email</label>
                    <div className="cs-form_field_wrap">
                        <input name="email" id="email"  type="email" className="cs-form_field" placeholder="picasso@gmail.com" required />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Avatar</label>
                    <div className="cs-form_field_wrap">
                        <input name="avatar" id="avatar"  type="number" className="cs-form_field" placeholder="1" required />
                    </div>
                    <p className="text-center">must be an nftea you own, enter 0 to otherwise</p>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Twitter</label>
                    <div className="cs-form_field_wrap">
                        <input name="twitter" id="twitter"  type="text" className="cs-form_field" placeholder="picasso"/>
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Tiktok</label>
                    <div className="cs-form_field_wrap">
                        <input name="tiktok" id="tiktok"  type="text" className="cs-form_field" placeholder="picassotiktok" />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Your Story</label>
                    <div className="cs-form_field_wrap">
                        <textarea name="story" id="story" className="cs-form_field" placeholder="I love nfteas..." required></textarea>
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Update</span></button>
                    {_msg && (
                        <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                        )}
                </form>
            </Modal>
        )}
    
    {_isCreateModalOpen &&  (
            <Modal onClose={() => handleCreateModal()} title="Create xMash Game">
                <form onSubmit={handleCreate}>         
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                        Host fun, fast paced promotional give-aways for your art or coupon nfts. Even host crypto give-aways to your followers and fans. A host NFTea is required to create games, grab one now from the grabbit label.
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    {_profile.admin<1 && (
                        <>
                            <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                                For now only African Hyena Pets holders can create games
                            </div>
                        </>
                    )}
                    {_profile.admin>0 && (
                        <>
                        <label className="cs-form_label">Title</label>
                            <div className="cs-form_field_wrap">
                                <input name="title" id="title"  type="text" className="cs-form_field" placeholder="win 20% off" required />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Prize Type</label>
                            <div className="cs-form_field_wrap">
                                <input name="type" id="type"  type="number" className="cs-form_field" placeholder="1" required />
                            </div>
                            <p className="text-center">enter 1 for nft or 2 if it's a crypto prize</p>
                            
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">NFT 2 Play</label>
                            <div className="cs-form_field_wrap">
                                <input name="nft2play" id="nft2play"  type="number" className="cs-form_field" placeholder="2" required />
                            </div>
                            <p className="text-center">if a player has one of these nfts they can play</p>
                            
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            {/* <label className="cs-form_label">NFT 2 Play Contract</label>
                            <div className="cs-form_field_wrap">
                                <input name="nft2playcontract" id="nft2playcontract"  type="text" className="cs-form_field" placeholder="0x..." />
                            </div>
                            <p className="text-center">if a player has an nft from this contract (on BNB) they can play</p>
                            <div className="cs-height_20 cs-height_lg_20"></div> */}
                            
                            <label className="cs-form_label">NFT 2 Play Label</label>
                            <div className="cs-form_field_wrap">
                                <input name="nft2playlabel" id="nft2playlabel"  type="number" className="cs-form_field" placeholder="3" />
                            </div>
                            <p className="text-center">if a player has an nft from this label they can play</p>
                            
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Grabs</label>
                            <div className="cs-form_field_wrap">
                                <input name="grabs" id="grabs"  type="number" className="cs-form_field" placeholder="10" required />
                            </div>
                            <p className="text-center">how many grabs will each player get</p>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Slaps</label>
                            <div className="cs-form_field_wrap">
                                <input name="slaps" id="slaps"  type="number" className="cs-form_field" placeholder="15" required />
                            </div>
                            <p className="text-center">how many slaps will each player get</p>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Sneaks</label>
                            <div className="cs-form_field_wrap">
                                <input name="sneaks" id="sneaks"  type="number" className="cs-form_field" placeholder="5" required />
                            </div>
                            <p className="text-center">how many sneaks will each player get</p>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Max Players</label>
                            <div className="cs-form_field_wrap">
                                <input name="playersMax" id="playersMax"  type="number" className="cs-form_field" placeholder="20" required/>
                            </div>
                            <p className="text-center">whats the max number of players for this game?</p>
                            
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Min Players</label>
                            <div className="cs-form_field_wrap">
                                <input name="playersMin" id="playersMin"  type="number" className="cs-form_field" placeholder="3" required />
                            </div>
                            <p className="text-center">whats the minimum number of players to start the game?</p>
                            
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Prize</label>
                            <div className="cs-form_field_wrap">
                                <input name="prize" id="prize"  type="text" className="cs-form_field" placeholder="coupon nft"  required/>
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Prize Value</label>
                            <div className="cs-form_field_wrap">
                                <input name="prizeValue" id="prizeValue"  type="text" className="cs-form_field" placeholder="$10" />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">NFT Prize ID</label>
                            <div className="cs-form_field_wrap">
                                <input name="prizeNftea" id="prizeNftea"  type="text" className="cs-form_field" placeholder="104" />
                            </div>
                            <p className="text-center">if the prize is an nft, whats the nft id?</p>
                            
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Game Story</label>
                            <div className="cs-form_field_wrap">
                                <textarea name="story" id="story" className="cs-form_field" placeholder="win this awesome.." required></textarea>
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Create Game</span></button>
                            {_msg && (
                                <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                            )}
                        </>
                    )}
                </form>
            </Modal>
        )}
      </>
      )
}
export default Grabbit;