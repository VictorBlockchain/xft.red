import React, { Component } from 'react'
import Image from 'next/image'
import {useCallback, useEffect, useState} from 'react'
import { setWalletProvider,servBalances,servRemoveLimit,servGasRefund } from '../services/web3Service';
import { useRouter } from 'next/router';
import axios from 'axios'
import { BigNumber } from 'bignumber.js';
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
import Side from "./ProfileSide";
import Modal from './Modal';

const BLANK = '0x0000000000000000000000000000000000000000';

const Wallets = ({isConnected}:any) => {
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [_wallet,setWallet]:any = React.useState('')
    const [_showWallet,setShowWallet]:any = React.useState(false)
    const [_error, setError]:any = React.useState("")
    const [_errorModalOpen, setErrorModal]:any = React.useState(false)
    const [_limitModalOpen, setLimitModal]:any = React.useState(false)
    const [_gasModalOpen, setGasModal]:any = React.useState(false)
    const [_profile,setProfile]:any = React.useState('')
    
    useEffect(() => {
        if (connected && account) {
            // console.log(walletProvider.provider)
            setWalletProvider(provider);
            handleGetProfile()
        }
      }, [account, connected]);
    
    // React.useEffect(() => {
        
    //     let user_:any = localStorage.getItem("account")
    //     if(user_ && isConnected){
    //         start(user_)
    //         setAccount(user_)
    //     }
            
    // }, []);

    React.useEffect(() => {
        
        if(_wallet){
            setShowWallet(true)
        }
    }, [_wallet]);
    
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
    // const formatNumber = (number:any, decimalPlaces:any) => {
    //     const parts = number.toString().split('.');
    //     const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //     const decimalPart = parts[1] ? parts[1].slice(0, decimalPlaces) : '';
    //     return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    //   };
      
      const handleGetProfile = async () => {
        try {
           let data = await axios.get(`/api/getProfile?account=${account}`)
           if(data.data){
            data.data.account = account
            setProfile(data.data)
            // setShowProfile(true)
           }
           start(account)
        //   console.log(profileData);
        } catch (err) {
          console.error(err);
        }
      };
    
    const start = async (user_:any) => {
        
        let resp = await servBalances(user_);
        const number = new BigNumber(resp.tea);
        // let formattedNumber = number.dividedBy(1000000000).toFixed(9);   
        // const formattedString = formattedNumber.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
        if(resp.tea>0){
          resp.tea = formatNumber(resp.tea/1000000000);
        }
        setWallet(resp)
        
    }
    
    const handleRemoveLimit = async () => {
        
        let resp:any = await servRemoveLimit();
        if(resp.status){
            setError('wallet limit removed')
            setErrorModal(true)
        }
    }
    const handleGasRefund = async () => {
        
        let resp:any = await servGasRefund(account);
        if(resp.status){
            setGasModal(false)
            setError('gas refunded')
            setErrorModal(true)
        }
    }
    const closeErrorModal = async () => {
        setErrorModal(false);
        setError("")
 
    };
    const closeLimitModal = async () => {
        setLimitModal(false);
        setError("")
 
    };
    return(
        <>
            <div className="cs-height_90 cs-height_lg_80"></div>
            <section className="cs-page_head cs-bg" style={{backgroundImage: "url(/img/page_head_bg.svg)"}}>
                <div className="container">
                    <div className="text-center">
                        <h1 className="cs-page_title" style={{fontFamily: 'Comfortaa'}}>Wallet</h1>
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item" style={{fontFamily: 'Comfortaa'}}><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" style={{fontFamily: 'Comfortaa'}}>Wallet</li>
                        </ol>
                    </div>
                </div>
            </section>
            <div className="cs-height_100 cs-height_lg_70"></div>

            <section>
              <div className="container">
              <div className="row">
                        <div className="col-lg-6 cs-white_bg cs-box_shadow mb-3">
                            <h3 className="text-center p-3" style={{fontFamily: 'Comfortaa'}}>TEA</h3>
                                <div className="mb-2" style={{width: '100%', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                                <div className="text-center">
                                {(_wallet.tea || 0)}
                                </div>
        
                        </div>
                        <div className="col-lg-6 cs-white_bg cs-box_shadow mb-3">
                            <h3 className="text-center p-3" style={{fontFamily: 'Comfortaa'}}>Gas Refund (BNB)</h3>
                                <div className="mb-2" style={{width: '100%', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                                <div className="text-center">
                                {_wallet.gas || 0}
                                </div>
                        
                        </div>
        
                    </div>
                    <div className="cs-height_25 cs-height_lg_25"></div>

                        <div className="row">
                            <div className="col-lg-6 mb-3">
                                <button  onClick={() => setLimitModal(true)}  className="cs-btn cs-style1 cs-btn_lg w-100">
                                    Remove Wallet Limit
                                </button>
                            </div>
                            <div className="col-lg-6 mb-3">
                                <button  onClick={() => setGasModal(true)}  className="cs-btn cs-style1 cs-btn_lg w-100">
                                    Gas Refund
                                </button>
                            </div>
                        </div>
              </div>
            </section>
        {_errorModalOpen &&  
            <Modal onClose={closeErrorModal} title="Error">
                <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                {_error}                  
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal> 
        } 
        {_limitModalOpen &&  
            <Modal onClose={() => closeLimitModal()} title="Remove Wallet Limit">
                <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                    Remove wallet trading limit               
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
                <button type="button" onClick={() => handleRemoveLimit()} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Remove Limit</span></button>
              
              </div>
            
            </Modal> 
        } 
        {_gasModalOpen &&  
            <Modal onClose={() => closeLimitModal()} title="Remove Wallet Limit">
                <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                  Get a refund on the gas used to mint, sell and other functions             
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
                <button type="button" onClick={() => handleGasRefund()} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Gas Refund</span></button>
              
              </div>
            
            </Modal> 
        } 
        </>
    )
}
export default Wallets;