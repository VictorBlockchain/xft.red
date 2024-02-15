'use client';
import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import ReactPlayer from 'react-player'
import axios from "axios";
import moment from 'moment';
import {create as ipfsHttpClient}  from "ipfs-http-client";
import { BigNumber } from 'bignumber.js';
import { setWalletProvider,servBag,servToBNB,servApproveToken,servChallenge,servChallenges,servSetChallenge,servAcceptChallenge,servDeclineChallenge,servChangeOpponent,servReportScore,servConfirmScore,servDispute,servMediatorClaim,servMediator,servCancelGame,servGame,servPlayerChallenges,servPlayerProfile } from '../services/web3Service';
import { servNFTbalance } from '../services/web3Service';
import { servNFT } from '../services/web3Service';
import { servNFT2Label } from '../services/web3Service';
import { servSale } from '../services/web3Service';
import { servMediaAttributes } from '../services/web3Service';
import { servChallengeSync,setChallenge } from '../services/events';

import MediaComponent from "./Media"
import { AnyARecord } from 'dns';
import dotenv from 'dotenv';
import DisplayDescription from './DisplayDescription';
import { useUser } from './UserContext';
import { useSDK } from '@metamask/sdk-react';
import Modal from './Modal';
import { setTimeout } from 'timers/promises';
import Chatroom from './Chat';

dotenv.config();
const BLANK:any = '0x0000000000000000000000000000000000000000';
const teaToken = process.env.teaToken;
const shopLogic = process.env.shopLogic;
const teaPot = process.env.teaPot;
const mintLogic = process.env.mintLogic;

const Esports = ({ challenge }:any) => {
    const router:any = useRouter()
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [activeTab, setActiveTab] = useState('chat'); 
    const [_msg, setMessage]:any = useState()
    const [_profile, setProfile]:any = useState([])
    const [_isCreateModalOpen, setIsCreateModalOpen]:any = useState(false)
    const [opponent, setOpponent] = useState('');
    const [opponent0x, setOpponent0x] = useState('');
    const [token, setToken] = useState('');
    const [token0x, setToken0x] = useState('');
    const [tokenNames, setTokenNames]:any = useState([]);

    const [userNames, setUserNames]:any = useState([]);
    const [loading, setLoading] = useState(false);
    const [prizeType, setPrizeType] = useState('0'); 
    const [tokenValue, setTokenValue]:any = useState('');
    const [gameid, setGameId]:any = useState('')
    const [game, setGame]:any = useState('')
    const [games, setGames]:any = useState('')
    const [amount, setAmount] = useState('');
    const [mychallenges, setMyChallenges]:any = useState([])
    const [mystats, setMyStats]:any = useState([])
    const [actionsModalOpen, setActionsModalOpen]:any = useState(false)
    const [canceledModalOpen, setCanceledModalOpen]:any = useState(false)
    const [actionsGame, setActionsGame]:any = useState()
    const [changeOpponentModalOpen, setChangeOpponentModal]:any = useState(false)
    const [scoreModalOpen, setScoreModal]:any = useState(false)
    
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
  }, [activeTab])
    
    useEffect(() => {
        if (connected && account) {
            // console.log(walletProvider.provider)
            setWalletProvider(provider);
            handleGetProfile()
            servChallengeSync()
            // handleStart(play)    
        }
      }, [account, connected]);

      const handleTabClick = async(tab:any) => {
        let type:any = 0;
        if(tab=="nftea"){
            type = 1
        }
        if(tab=="mychallenges"){
            type = 2
            handleGetMyChallenges()
        }
        if(tab=="history"){
            type = 4
            handleGetMyHistory()
        }
        if(tab=="practice"){
            type = 3
        }
        
        setActiveTab(tab);
    };
    function handleCreateModal() {
        
        if(_isCreateModalOpen){
            
            setIsCreateModalOpen(false);
            setMessage('')
        
        }else{
            setIsCreateModalOpen(true);
            handleTabClick('create')
        }
        
      }
    
    const fetchUserNames = async (query:any) => {
        try {
        setLoading(true);
        // Simulate fetching user names from an API endpoint
        let data_ = {
            query,
          }
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/getName2'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const data = await response.json();
        // console.log(data)
        setUserNames(data);
        } catch (error) {
        console.error('Error fetching user names:', error);
        } finally {
        setLoading(false);
        }
    };
    
    const fetchTokens = async (query:any) => {
        try {
        setLoading(true);
        // Simulate fetching user names from an API endpoint
        let data_ = {
            query,
          }
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/esports/getToken'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const data = await response.json();
        console.log(data)
        setTokenNames(data);
        } catch (error) {
        console.error('Error fetching user names:', error);
        } finally {
        setLoading(false);
        }
    };
    
    const handleInputChange = (e:any) => {
        const inputValue = e.target.value;
        setOpponent(inputValue);
    
        // Fetch user names only if the input is not empty
        if (inputValue.trim() !== '') {
            fetchUserNames(inputValue);
        } else {
            setUserNames([]);
        }
    };

    const handleTokenInputChange = (e:any) => {
        const inputValue = e.target.value;
        setToken(inputValue);
    
        // Fetch user names only if the input is not empty
        if (inputValue.trim() !== '') {
            fetchTokens(inputValue);
        } else {
            setTokenNames([]);
        }
    };

    const handlePrizeTypeChange = (event:any) => {
        setPrizeType(event.target.value);
      };

    const handleUserNameSelect = (name2:any, player:any) => {
        setOpponent(name2);
        setOpponent0x(player)
        setUserNames([]); // Clear the dropdown after selection
    };
    const handleTokenSelect = (name:any, address:any) => {
        setToken(name);
        setToken0x(address)
        setTokenNames([]); // Clear the dropdown after selection
    };
    const handleNFTeaClick = () => {
        // Set the value to your NFTea Token
        setTokenValue(process.env.teaToken); // Replace with the actual value
      };
      
      const handleAmountChange = (e:any) => {
        const value = e.target.value;
    
        // Use a regex pattern to allow decimals
        const decimalPattern = /^\d*\.?\d*$/;
        if (decimalPattern.test(value)) {
          setAmount(value);
        }
      };

      const handleSetChallange = async (event:any) => {
        
        event.preventDefault();
        let opponent:any = event.target.opponent.value
        let game:any = event.target.game.value
        let console:any = event.target.console.value
        let prizeType:any = event.target.prizeType.value
        let amount:any = event.target.amount.value
        let token:any = event.target.token.value
        let rules:any = event.target.rules.value
        let nftid1:any = 0
        let nftid2:any = 0
        let pass = 1;

        if(prizeType==2){

                nftid1 = event.target.nftid1.value
                nftid2 = event.target.nftid2.value    
        }

        if(nftid1>0){
            //check that user owns this nft
            let resp:any = await servBag(nftid1,account)
            if(resp[2][2]<1){
                setMessage('you do not own this nft')
                pass = 0
            }
        }
        if(nftid2>0){
            //check that opponent owns this nft
            let resp:any = await servBag(nftid2,opponent0x)
            if(resp[2][2]<1){
                setMessage('your oppoent does not own this nft')
                pass = 0
            }
        }
        if(amount && amount!=0 && pass>0){
            //approve token amount
            if(token!=0){
                token = process.env.teaToken
                let operator = process.env.eSports
                amount = amount/1000000000;
                let resp_ =await servApproveToken(account,amount,operator)
                if(!resp_.status){  
                    setMessage('error approving token')                  
                    pass = 0
                }
            }else{
                token = BLANK
                amount = await ckc(amount)
                
            }
        
        }
        if(pass>0){
            let resp:any = await servSetChallenge(opponent0x,nftid1,nftid2,game,amount,token,console,rules);
            if(resp.status){
                let eventData = resp.events.ChallengeCreated.returnValues
                let amount = eventData.amount
                let console = eventData.console
                let game = eventData.game
                let gameId = eventData.gameId
                let nftIdPlayer1 = eventData.nft1
                let nftIdPlayer2 =  eventData.nft2
                let player1 = eventData.player1
                let player2 = eventData.player2
                let rules = eventData.rules
                let tokenAddress= eventData.token
                await setChallenge(amount,console,game,gameId,nftIdPlayer1,nftIdPlayer2,player1,player2,rules,tokenAddress) 
                setMessage('challenge created')
              }
        }

      }
      
      const handleCancelChallenge = async (gameId:any) => {
      
        let resp:any = await servCancelGame(gameId);
        if(resp.status){
            let eventData:any = resp.events.GameCancelled.returnValues
            let gameId = eventData.gameId
            let data_ = {
                gameId,
              }
            const JSONdata = JSON.stringify(data_)
            const endpoint = '/api/esports/setCancel'
            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSONdata,
            }
            const response = await fetch(endpoint, options)
            const result = await response.json()
            if(result.success){
                setMessage('challenge canceled')
            }
        }
      }
      
      const handleChangeOpponent = async (event:any) => {

        let resp:any = await servChangeOpponent(gameid, opponent0x);
        // console.log(resp)
        if(resp.status){
            let data_ = {
                gameid,
                opponent0x
              }
            const JSONdata = JSON.stringify(data_)
            const endpoint = '/api/esports/setOpponent'
            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSONdata,
            }
            const response = await fetch(endpoint, options)
            const result = await response.json()
            if(result.success){
                setMessage('opponent updated')
            }
        }
      }

      const handleDeclineChallenge = async (gameId:any) => {
      
        let resp:any = await servDeclineChallenge(gameId);
        if(resp.status){
            let eventData:any = resp.events.ChallengeDeclined.returnValues
            let gameId = eventData.gameId
            let data_ = {
                gameId,
              }
            const JSONdata = JSON.stringify(data_)
            const endpoint = '/api/esports/setOpponent'
            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSONdata,
            }
            const response = await fetch(endpoint, options)
            const result = await response.json()
            if(result.success){
                setMessage('challenge canceled')
            }
        }
      }
      
      const handleAcceptChallenge = async (gameId:any,amount:any) => {
        let resp:any = await servAcceptChallenge(gameId,amount);
        if(resp.status){
            let eventData:any = resp.events.ChallengeAccepted.returnValues
            let gameId = eventData.gameId
            let data_ = {
                gameId,
              }
            const JSONdata = JSON.stringify(data_)
            const endpoint = '/api/esports/setAccepted'
            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSONdata,
            }
            const response = await fetch(endpoint, options)
            const result = await response.json()
            if(result.success){
                setMessage('challenge canceled')
            }
        }
      }
      
      const handleScore = async (event:any) => {
        
        event.preventDefault();
        let score1:any = event.target.score1.value
        let score2:any = event.target.score2.value
        if(score1==score2){
            setMessage('someone has to win, scores can\'t be the same')
        }else{
            let resp = await servReportScore(gameid, score1, score2)
            console.log(resp)
            if(resp.status){
                let scorer = account
                let eventData:any = resp.events.ScoreReported.returnValues
                let data_ = {
                    gameid,
                    score1,
                    score2,
                    scorer
                  }
                const JSONdata = JSON.stringify(data_)
                const endpoint = '/api/esports/setScore'
                const options = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSONdata,
                }
                const response = await fetch(endpoint, options)
                const result = await response.json()
            }
        
        }

      }
      
      const handleConfirmScore = async (gameId:any) => {
      
        let resp:any = await servConfirmScore(gameId,actionsGame.score1,actionsGame.score2);
        // console.log(resp)
        if(resp.status){
            let eventData:any = resp.events.FundsTransferred.returnValues
            let txid = eventData.transactionHash
            let gameId = eventData.gameId
            let data_ = {
                gameId,
                txid
              }
            const JSONdata = JSON.stringify(data_)
            const endpoint = '/api/esports/setScoreConfirm'
            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSONdata,
            }
            const response = await fetch(endpoint, options)
            const result = await response.json()
            if(result.success){
                setMessage('challenge canceled')
            }
        }
      }

      const handleActionsModal = async (event:any, gameId:any) => {
        event.preventDefault();
        
        if(actionsModalOpen){

            setActionsModalOpen(false)
        
        }else{
            
            let challenge = await servChallenge(gameId)
            console.log(challenge)
            let aGame:any = mychallenges.find((item:any) => item.gameId === gameId);
            // console.log(challenge)
            if(challenge[0].status==0 || challenge[0].status==2){
                console.log("here")
                //game is canceled or completed
                if(aGame.active){
                    //turn off
                    let data_ = {
                        gameId,
                      }
                    const JSONdata = JSON.stringify(data_)
                    const endpoint = '/api/esports/setCancel'
                    const options = {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSONdata,
                    }
                    const response = await fetch(endpoint, options)
                    const result = await response.json()
                    // console.log(result)
                    handleGetMyChallenges()
                }
            }
            if(challenge[0].status==1 && challenge[0].player2.toLowerCase()!=aGame.player2){
                console.log("updating player2")
                //player2 declined the challenge
                    //update opponent as open
                    let gameid = gameId
                    let opponent = challenge[0].player2
                    let data_ = {
                        gameid,
                        opponent
                      }
                    const JSONdata = JSON.stringify(data_)
                    const endpoint = '/api/esports/setOpponent'
                    const options = {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSONdata,
                    }
                    const response = await fetch(endpoint, options)
                    const result = await response.json()
                    if(result.success){
                        handleGetMyChallenges()
                    }
                    // handleGetMyChallenges()
            }
            if(challenge[0].status==1 && challenge[0].accepted && !aGame.accepted){
                ///sync db to accepted
                console.log('syncing accepted')
                let data_ = {
                    gameId,
                  }
                const JSONdata = JSON.stringify(data_)
                const endpoint = '/api/esports/setAccepted'
                const options = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSONdata,
                }
                const response = await fetch(endpoint, options)
                const result = await response.json()
                if(result.success){
                    handleGetMyChallenges()
                }
            }
            if(challenge[0].status==1 && challenge[0].accepted && (challenge[0].score1>0 || challenge[0].score2>0) && (aGame.score1==0 && aGame.score2==0)){
                //sync score to db
                console.log('syncing score')
                console.log(aGame)
                let score1 = challenge[0].score1;
                let score2 = challenge[0].score2;
                let scorer = challenge[4]
                let gameid = aGame.gameId
                let data_ = {
                    gameid,
                    score1,
                    score2,
                    scorer
                  }
                const JSONdata = JSON.stringify(data_)
                const endpoint = '/api/esports/setScore'
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
                if(result.success){
                    handleGetMyChallenges()
                }
            }
            if(challenge[0].status==3 && aGame.active){
                //sync completed to db
                console.log('syncing completed')
                let txid = 'ox..'
                let gameid = aGame.gameId
                let data_ = {
                    gameid,
                    txid
                  }
                const JSONdata = JSON.stringify(data_)
                const endpoint = '/api/esports/setScoreConfirm'
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
                if(result.success){
                    handleGetMyChallenges()
                }
            }

            if(challenge[0].status==3){
                //game is in dispute
            }
            if(challenge[0].status==1){
                //game is active
                setActionsGame(aGame)    
                setActionsModalOpen(true)
            
            }

        }
      }
      const handleCanceledModal = async (event:any) => {
        event.preventDefault();
        
        if(canceledModalOpen){
            setCanceledModalOpen(false)
        }else{
            setCanceledModalOpen(true)
        
        }
    }
    const handleChangeOpponentModal = async (event:any, game_id:any) => {
        event.preventDefault();
        setGameId(game_id)
        if(changeOpponentModalOpen){
            setChangeOpponentModal(false)
        }else{
            setChangeOpponentModal(true)
        
        }
    }
    const handleScoreModal = async (event:any, game_id:any) => {
        event.preventDefault();
        // console.log(game)
        setGameId(game_id)
        if(scoreModalOpen){
            setScoreModal(false)
        }else{
            setScoreModal(true)
        
        }
    }
      const handleGetChallenge = async () => {
        
        let resp = await servChallenge(challenge)
        setGame(resp)
      
      }
    
      const handleGetMyChallenges = async () => {
        // let challenge:any = await servPlayerChallenges(account)
        // console.log(challenge)

        let data:any = await axios.get(`/api/esports/getChallenge?player=${account}&gameId=0`)
        if(data.data.length<1){
            //verify db sync
            console.log("syncing db")
            let challenge:any = await servPlayerChallenges(account)
            // console.log(challenge)
            for (let i = 0; i < challenge.length; i++) {
                const id:any = challenge[i];
                let resp = await servChallenge(id)
                // console.log(resp)
                if(resp[0].status==1){
                    let amount = resp[0].amount
                    let console = resp[1]
                    let game = resp[0].game
                    let gameId = id
                    let nftIdPlayer1 = resp[0].nft1
                    let nftIdPlayer2 =  resp[0].nft2
                    let player1 = resp[0].player1
                    let player2 = resp[0].player2
                    let rules = resp[2]
                    let tokenAddress= resp[0].token
                    await setChallenge(amount,console,game,gameId,nftIdPlayer1,nftIdPlayer2,player1,player2,rules,tokenAddress)
                }
            }
            if(challenge.length<1){
                setMyChallenges([])
            }
        }else{
            setMyChallenges(data.data)
        }
        console.log(data.data)
      
      }
      const handleGetMyHistory = async () => {
        let stats:any = await servPlayerProfile(account)
        setMyStats(stats)
        console.log(stats)

      }

    const handleGetProfile = async () => {
        try {
           let data = await axios.get(`/api/getProfile?account=${account}`)
        //    console.log(data.data)
           if(data.data){
            data.data.account = account
            setProfile(data.data)
           }
        } catch (err) {
          console.error(err);
        }
      };
    return(
        <>
        <div className="cs-height_90 cs-height_lg_80"></div>
        <section className="cs-page_head cs-bg" style={{backgroundImage: "url(/img/page_head_bg.svg)"}}>
            <div className="container">
            <div className="text-center">
            <h1 className="cs-page_title" style={{fontFamily: 'Comfortaa'}}>Esports</h1>
            <ol className="breadcrumb">
            <li className="breadcrumb-item" style={{fontFamily: 'Comfortaa'}}><a href="/">Home</a></li>
            <li className="breadcrumb-item active" style={{fontFamily: 'Comfortaa'}}><a href="/esports/0">Esports</a></li>
            </ol>
            </div>
            </div>
        </section>
        <div className="cs-height_30 cs-height_lg_30"></div>
        <div className="container">
            <>
                <div className="cs-isotop_filter cs-style1 cs-center">
                    <ul className="cs-mp0 cs-center">
                        <li className={activeTab === 'chat' ? 'active' : ''}>
                            <a href="#" onClick={() => handleTabClick('chat')}>
                                <span>Chatroom</span>
                            </a>
                        </li>
                        <li className={activeTab === 'mychallenges' ? 'active' : ''}>
                            <a href="#" onClick={() => handleTabClick('mychallenges')}>
                                <span>My Challenges</span>
                            </a>
                        </li>
                        <li className={activeTab === 'history' ? 'active' : ''}>
                            <a href="#" onClick={() => handleTabClick('history')}>
                                <span>History</span>
                            </a>
                        </li>
                        <li className={activeTab === 'rules' ? 'active' : ''}>
                            <a href="#" onClick={() => handleTabClick('rules')}>
                                <span>Rules</span>
                            </a>
                        </li>
                        <li className={activeTab === 'create' ? 'active' : ''}>
                            <a href="#" onClick={() => handleTabClick('create')}>
                                <span>Challenge</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                {activeTab=="chat" && (
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                        <Chatroom account={account} tab={activeTab}/>
                        </div>
                    </div>
                )}
                {activeTab=="history" && (
                    <>
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2 ">
                            <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                                    <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'24px', lineHeight:'33px'}}>Wins: | Loss:</p>
                                
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {activeTab=="rules" && (
                    <>
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2 ">
                            <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                                    <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'24px', lineHeight:'33px'}}>compete in heads up battles for nfts or tokens</p>
                                    <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>challenges are stored on the blockchain</p>
                                    <p className="text-center pt-1" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>funds are held in the challenge wallet <br/>until the score is reported or game canceled</p>
                                    <p className="text-center pt-1" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>challenger reports the score, opponent confirms the score</p>
                                    <p className="text-center pt-1" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>use a referee to settle disputes</p>
                                    <p className="text-center pt-1" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>5% service fee applies to all token challenges <br/>except NFTea Token</p>
                                    <p className="text-center pt-1" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>5% service fee applies if a referee is used <br/>paid to referee</p>
                                
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab=="create" && (
                    <>
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2 cs-white_bg cs-box_shadow cs-general_box_5">
                            <div className="cs-height_20 cs-height_lg_20"></div>
                                
                            <div className="cs-tabs cs-fade_tabs cs-style1">
                                <div className="cs-medium">
                                    <ul className="cs-tab_links cs-style1 cs-medium cs-primary_color cs-mp0 cs-primary_font">
                                    <li className="active" style={{fontFamily: 'Comfortaa'}}><a href="#HeadsUp">Heads Up</a></li>
                                    <li><a href="#Help" style={{fontFamily: 'Comfortaa'}}>Help</a></li>
                                    </ul>
                                </div>
                                <div className="cs-tab_content">
                                    <div id="HeadsUp" className="cs-tab active">
                                        <div className="p-5">
                                            <form onSubmit={handleSetChallange}>  
                                                <div className="cs-height_20 cs-height_lg_20"></div>
                                                <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                                                    send a challenge to a player who is online and ready to play right now
                                                </div>
                                                <div className="cs-height_20 cs-height_lg_20"></div>
                                                
                                                <label className="cs-form_label">Opponent</label>
                                                <div className="cs-form_field_wrap">
                                                    <input
                                                        name="opponent"
                                                        id="opponent"
                                                        type="text"
                                                        className="cs-form_field"
                                                        placeholder="0x..."
                                                        value={opponent}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                {loading && <p>Loading...</p>}
                                                {userNames.length > 0 && (
                                                    <ul className="user-list">
                                                    {userNames.map((userName:any, index:any) => (
                                                    <li
                                                        key={userName}
                                                        onClick={() => handleUserNameSelect(userName.name2, userName.account)}
                                                        className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                                    >
                                                        {userName.name2}
                                                    </li>
                                                    ))}
                                                </ul>
                                                
                                                )}
                                                <div className="cs-height_20 cs-height_lg_20"></div>
                                                <label className="cs-form_label">Game</label>
                                                <div className="cs-form_field_wrap">
                                                    <input name="game" id="game"  type="text" className="cs-form_field" placeholder="madden" required />
                                                </div>
                                                <div className="cs-height_20 cs-height_lg_20"></div>
                                                <label className="cs-form_label">Console</label>
                                                <div className="cs-form_field_wrap">
                                                <select
                                                    className="cs-form_field"
                                                    name="console"
                                                    id="console"                                        >
                                                    <option value="0">select one</option>
                                                    <option value="PS5">PS5</option>
                                                    <option value="XBOX">XBOX</option>
                                                    <option value="PC/MAC">PC/MAC</option>
                                                </select>
                                                </div>
                                                <div className="cs-height_20 cs-height_lg_20"></div>
                                                <label className="cs-form_label">Prize Type</label>
                                                <div className="cs-form_field_wrap">
                                                    <select className="cs-form_field" name="prizeType" id="prizeType" value={prizeType} onChange={handlePrizeTypeChange}>
                                                        <option value="0">select one</option>
                                                        <option value="1">Token</option>
                                                        <option value="2">NFT</option>
                                                    </select>
                                                </div>
                                                <div className="cs-height_20 cs-height_lg_20"></div>

                                                {prizeType=='1' && (
                                                    <>
                                                        <label className="cs-form_label">Token</label>
                                                        <div className="cs-form_field_wrap">
                                                            <input
                                                                name="token"
                                                                id="token"
                                                                type="text"
                                                                className="cs-form_field"
                                                                placeholder="BNB"
                                                                value={token}
                                                                onChange={handleTokenInputChange}
                                                                required
                                                            />
                                                        </div>
                                                        {loading && <p>Loading...</p>}
                                                        {tokenNames.length > 0 && (
                                                            <ul className="user-list">
                                                            {tokenNames.map((tokenName:any, index:any) => (
                                                            <li
                                                                key={tokenName}
                                                                onClick={() => handleTokenSelect(tokenName.name, tokenName.address)}
                                                                className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                                            >
                                                                {tokenName.name}
                                                            </li>
                                                            ))}
                                                            </ul>
                                                        )}
                                                        <div className="cs-height_20 cs-height_lg_20"></div>

                                                        <label className="cs-form_label">Amount</label>
                                                        <div className="cs-form_field_wrap">
                                                            <input
                                                            name="amount"
                                                            id="amount"
                                                            type="text"
                                                            className="cs-form_field"
                                                            placeholder="10000"
                                                            value={amount}
                                                            onChange={handleAmountChange}
                                                            required
                                                            />
                                                        </div>
                                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                                    </>
                                                )}
                                                {prizeType=='2' && (
                                                    <>
                                                        <label className="cs-form_label">Your NFT ID</label>
                                                        <div className="cs-form_field_wrap">
                                                            <input name="nft1" id="nft1"  type="number" className="cs-form_field" placeholder="12" required />
                                                        </div>
                                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                                        <label className="cs-form_label">Opponent NFT ID</label>
                                                        <div className="cs-form_field_wrap">
                                                            <input name="nft2" id="nft2"  type="number" className="cs-form_field" placeholder="45" required />
                                                        </div>
                                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                                    </>
                                                )}
                                                
                                                <label className="cs-form_label">Rules</label>
                                                <div className="cs-form_field_wrap">
                                                    <textarea name="rules" id="rules" className="cs-form_field" placeholder="win by 3" required ></textarea>
                                                </div>
                                                <div className="cs-height_20 cs-height_lg_20"></div>
                                                <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Send Challenge</span></button>
                                                {_msg && (
                                                    <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                                                )}
                                            
                                            </form>       
                                        
                                        </div>
                                    </div>
                                    <div id="Help" className="cs-tab">
                                        <div className="cs-white_bg cs-box_shadow cs-general_box_5 mt-3">
                                            <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px', color:'#000'}}>play for crypto or nfts</p>
                                            <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px', color:'#000'}}>Steps <br/>1. send challenge to your opponent<br/>2. they accept challenge<br/>3. play game <br/>4. report score<br/>5. confirm score,<br/>6. use mediator to resolve dispute if needed</p>
                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </>
                )}
                {activeTab=="mychallenges" && (
                    <>
                        <div className="row">
                            <div className="col-lg-8 offset-lg-2 ">
                            <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                                <div className="table-responsive">
                                <table  className="table table-bordered">
                                    <thead>
                                        <tr>
                                        <th>Challenger</th>
                                        <th>Opponent</th>
                                        <th>Game</th>
                                        <th>Console</th>
                                        <th>Amount</th>
                                        <th>Accepted</th>
                                        <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mychallenges.map((challenge:any, index:any) => (
                                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
                                            <td>{challenge.name1}</td>
                                            <td>{challenge.name2}</td>
                                            <td>{challenge.game}</td>
                                            <td>{challenge.console}</td>
                                            {challenge.token==BLANK && (
                                                <td>{challenge.amount/1000000000000000000} BNB</td>
                                            )}
                                            {challenge.token!=BLANK && (
                                                <td>{challenge.amount/1000000000000000000}</td>
                                            )}
                                            <td>{challenge.accepted ? 'Yes' : 'No'}</td>
                                            <td>
                                            {/* Link or button for more info, you can customize this */}
                                            <a href="#" onClick={(e)=>handleActionsModal(e,challenge.gameId)} className="cs-btn"><small>actions</small></a>
                                            </td>
                                        </tr>
                                        ))}
                                        {mychallenges.length<1 && (
                                            <tr><td colSpan={7}>no open challenges</td></tr>
                                        )}
                                    </tbody>
                                    </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            
            </> 
        </div>
        {_isCreateModalOpen && (
            <>
            <Modal onClose={() => handleCreateModal()} title="Create Challenge">

                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <div className="cs-tabs cs-fade_tabs cs-style1">
                        <div className="cs-medium">
                            <ul className="cs-tab_links cs-style1 cs-medium cs-primary_color cs-mp0 cs-primary_font">
                            <li className="active" style={{fontFamily: 'Comfortaa'}}><a href="#HeadsUp">Heads Up</a></li>
                            <li><a href="#Help" style={{fontFamily: 'Comfortaa'}}>Help</a></li>
                            </ul>
                        </div>
                        <div className="cs-tab_content">
                            <div id="HeadsUp" className="cs-tab active">
                                <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                                    <form onSubmit={handleSetChallange}>  
                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                        <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                                            send a challenge to a player who is online and ready to play right now
                                        </div>
                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                        
                                        <label className="cs-form_label">Opponent</label>
                                        <div className="cs-form_field_wrap">
                                            <input
                                                name="opponent"
                                                id="opponent"
                                                type="text"
                                                className="cs-form_field"
                                                placeholder="0x..."
                                                value={opponent}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        {loading && <p>Loading...</p>}
                                        {userNames.length > 0 && (
                                            <ul className="user-list">
                                            {userNames.map((userName:any, index:any) => (
                                              <li
                                                key={userName}
                                                onClick={() => handleUserNameSelect(userName.name2, userName.account)}
                                                className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                              >
                                                {userName.name2}
                                              </li>
                                            ))}
                                          </ul>
                                        
                                        )}
                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                        <label className="cs-form_label">Game</label>
                                        <div className="cs-form_field_wrap">
                                            <input name="game" id="game"  type="text" className="cs-form_field" placeholder="madden" required />
                                        </div>
                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                        <label className="cs-form_label">Console</label>
                                        <div className="cs-form_field_wrap">
                                        <select
                                            className="cs-form_field"
                                            name="console"
                                            id="console"                                        >
                                            <option value="0">select one</option>
                                            <option value="PS5">PS5</option>
                                            <option value="XBOX">XBOX</option>
                                            <option value="PC/MAC">PC/MAC</option>
                                        </select>
                                        </div>
                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                        <label className="cs-form_label">Prize Type</label>
                                        <div className="cs-form_field_wrap">
                                            <select className="cs-form_field" name="prizeType" id="prizeType" value={prizeType} onChange={handlePrizeTypeChange}>
                                                <option value="0">select one</option>
                                                <option value="1">Token</option>
                                                <option value="2">NFT</option>
                                            </select>
                                        </div>
                                        <div className="cs-height_20 cs-height_lg_20"></div>

                                        {prizeType=='1' && (
                                            <>
                                                <label className="cs-form_label">Token</label>
                                                <div className="cs-form_field_wrap">
                                                    <input
                                                    name="token"
                                                    id="token"
                                                    type="text"
                                                    className="cs-form_field"
                                                    placeholder="0x.."
                                                    value={tokenValue}
                                                    onChange={(e) => setTokenValue(e.target.value)}
                                                    required
                                                    />
                                                </div>
                                                <p className="text-center p-1" style={{ color: '#000', fontFamily: 'Comfortaa' }}>
                                                    enter 0 for BNB | <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={handleNFTeaClick}>click here</span> for NFTea Token
                                                </p>
                                                <div className="cs-height_20 cs-height_lg_20"></div>

                                                <label className="cs-form_label">Amount</label>
                                                <div className="cs-form_field_wrap">
                                                    <input
                                                    name="amount"
                                                    id="amount"
                                                    type="text"
                                                    className="cs-form_field"
                                                    placeholder="10000"
                                                    value={amount}
                                                    onChange={handleAmountChange}
                                                    required
                                                    />
                                                </div>
                                                <div className="cs-height_20 cs-height_lg_20"></div>
                                            </>
                                        )}
                                        {prizeType=='2' && (
                                            <>
                                                <label className="cs-form_label">Your NFT ID</label>
                                                <div className="cs-form_field_wrap">
                                                    <input name="nft1" id="nft1"  type="number" className="cs-form_field" placeholder="12" required />
                                                </div>
                                                <div className="cs-height_20 cs-height_lg_20"></div>
                                                <label className="cs-form_label">Opponent NFT ID</label>
                                                <div className="cs-form_field_wrap">
                                                    <input name="nft2" id="nft2"  type="number" className="cs-form_field" placeholder="45" required />
                                                </div>
                                                <div className="cs-height_20 cs-height_lg_20"></div>
                                            </>
                                        )}
                                        
                                        <label className="cs-form_label">Rules</label>
                                        <div className="cs-form_field_wrap">
                                            <textarea name="rules" id="rules" className="cs-form_field" placeholder="win by 3" required ></textarea>
                                        </div>
                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                        <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Send Challenge</span></button>
                                        {_msg && (
                                            <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                                        )}
                                    
                                    </form>       
                                
                                </div>
                            </div>
                            <div id="Help" className="cs-tab">
                                <div className="cs-white_bg cs-box_shadow cs-general_box_5 mt-3">
                                    <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px', color:'#000'}}>play for crypto or nfts</p>
                                    <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px', color:'#000'}}>Steps <br/>1. send challenge to your opponent<br/>2. they accept challenge<br/>3. play game <br/>4. report score<br/>5. confirm score,<br/>6. use mediator to resolve dispute if needed</p>
                                
                                </div>
                            </div>
                        </div>
                    </div>
            </Modal>
            </>
        )}
        {actionsModalOpen && (
            <>
                <Modal onClose={(e) => handleActionsModal(e,0)} title="Game Actions">
                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                    <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>opponent: {actionsGame.name2}</p>
                    <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>game: {actionsGame.game}</p>
                    <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>console: {actionsGame.console}</p>
                    <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>rules</p>
                    <p className="text-center pt-3" style={{ fontFamily: 'Comfortaa', fontSize: '18px', lineHeight: '33px', border: '1px dashed #000' }}>
                         {actionsGame.rules}
                        </p>
                    {actionsGame.player1==account && actionsGame.player2==BLANK && (
                        <div className="text-center mt-3">
                            <button className="cs-btn cs-style1 cs-btn_lg w-100" onClick={(e)=>handleChangeOpponentModal(e,actionsGame.gameId)}><span>Change Opponent</span></button>
                        </div>
                    )}
                    {actionsGame.player1==account && !actionsGame.accepted && (
                        <div className="text-center mt-3">
                            <button className="cs-btn cs-style1 cs-btn_lg w-100" onClick={()=>handleCancelChallenge(actionsGame.gameId)}><span>Cancel Challenge</span></button>
                        </div>
                    )}
                    {actionsGame.player2==account && !actionsGame.accepted && (
                        <>
                        <div className="text-center mt-3">
                            <button className="cs-btn cs-style1 cs-btn_lg w-100" onClick={()=>handleAcceptChallenge(actionsGame.gameId, actionsGame.amount)}><span>Accept Challenge</span></button>
                        </div>
                        <div className="text-center mt-1">
                            <button className="cs-btn cs-style1 cs-btn_lg w-100" onClick={()=>handleDeclineChallenge(actionsGame.gameId)}><span>Decline Challenge</span></button>
                        </div>
                        </>
                    )}
                    {(actionsGame.player1==account || actionsGame.player2==account) && (actionsGame.score1==0 && actionsGame.score2==0) && actionsGame.accepted && (
                        <div className="text-center mt-3">
                            <button className="cs-btn cs-style1 cs-btn_lg w-100" onClick={(e)=>handleScoreModal(e,actionsGame.gameId)}><span>Score Challenge</span></button>
                        </div>
                    )}
                    {(actionsGame.player1==account && actionsGame.scorer==actionsGame.player2) && (
                        <div className="text-center mt-3">
                            <button className="cs-btn cs-style1 cs-btn_lg w-100"><span>Confirm Score</span></button>
                        </div>
                    )}
                    {(actionsGame.scorer==actionsGame.player1 || actionsGame.scorer==actionsGame.player2) && (
                        <div className="text-center mt-3">
                            <p className="text-center pb-3 pt-3">score reported</p>
                            <div>
                                <table>
                                    <thead><tr><th>{actionsGame.name1}</th> <th>{actionsGame.name2}</th></tr></thead>
                                    <tbody><tr><td><h4>{actionsGame.score1}</h4></td><td><h4>{actionsGame.score2}</h4></td></tr></tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {((actionsGame.player2==account && actionsGame.scorer==actionsGame.player1) || actionsGame.player1==account && actionsGame.scorer==actionsGame.player2)&& (
                        <div className="text-center mt-3">
                            <button className="cs-btn cs-style1 cs-btn_lg w-100" onClick={()=>handleConfirmScore(actionsGame.gameId)}><span>Confirm Score</span></button>
                            
                            <button className="cs-btn cs-style1 cs-btn_lg w-100 mt-3"><span>Dispute Score</span></button>
                        </div>
                    )}
                    {((actionsGame.player1==account && actionsGame.scorer==actionsGame.player1) || (actionsGame.player2==account && actionsGame.scorer==actionsGame.player2))&& (
                        <div className="text-center mt-3">
                            <button className="cs-btn cs-style1 cs-btn_lg w-100"><span>Get Moderator</span></button>
                         </div>
                    )}
                </div>
                </Modal>
            </>
            )}
            {canceledModalOpen && (
            <>
                <Modal onClose={(e) => handleCanceledModal(e)} title="Challenge Canceled">
                    <div className="cs-height_20 cs-height_lg_20"></div>
                                    
                    <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                        <p className="text-center pt-3" style={{fontFamily: 'Comfortaa', fontSize:'18px', lineHeight:'33px'}}>this challenge was canceled</p>
                    </div>
                </Modal>
            
            </>
            )}
            
            {changeOpponentModalOpen && (
            <>
                <Modal onClose={(e)=>handleChangeOpponentModal(e,0)} title="Change Opponent">
                    <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                        <form onSubmit={handleChangeOpponent}>  
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                                Add your new opponent if your previous opponent declined
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Opponent</label>
                            <div className="cs-form_field_wrap">
                                <input
                                    name="opponent"
                                    id="opponent"
                                    type="text"
                                    className="cs-form_field"
                                    placeholder="0x..."
                                    value={opponent}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            {loading && <p>Loading...</p>}
                                        {userNames.length > 0 && (
                                            <ul className="user-list">
                                            {userNames.map((userName:any, index:any) => (
                                              <li
                                                key={userName}
                                                onClick={() => handleUserNameSelect(userName.name2, userName.account)}
                                                className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                                              >
                                                {userName.name2}
                                              </li>
                                            ))}
                                          </ul>
                                        
                                        )}
                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                        <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Send Challenge</span></button>
                                        {_msg && (
                                            <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                                        )}
                        </form>
                    </div>
                </Modal>
            
            </>
            )}

{scoreModalOpen && (
            <>
                <Modal onClose={(e)=>handleScoreModal(e,0)} title="Report Score">
                    <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                        <form onSubmit={handleScore}>  
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center" style={{color:'#000'}}>
                                Add your new opponent if your previous opponent declined
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">{actionsGame.name1} score</label>
                            <div className="cs-form_field_wrap">
                                <input
                                    name="score1"
                                    id="score1"
                                    type="text"
                                    className="cs-form_field"
                                    placeholder="10"
                                    required
                                />
                            </div>
  
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            <label className="cs-form_label">{actionsGame.name2} score</label>
                            <div className="cs-form_field_wrap">
                                <input
                                    name="score2"
                                    id="score2"
                                    type="text"
                                    className="cs-form_field"
                                    placeholder="10"
                                    required
                                />
                            </div>
  
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Score Challenge</span></button>
                            {_msg && (
                                <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                            )}
                        </form>
                    </div>
                </Modal>
            
            </>
            )}
    
    </>
    )
}
export default Esports;