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
        // const number = new BigNumber(resp.tea);
        // let formattedNumber = number.dividedBy(1000000000).toFixed(9);   
        // const formattedString = formattedNumber.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
        resp.tea = formatNumber(resp.tea/1000000000);
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
            {_showWallet && (
                <>
            <div className="cs-profile_wrap">
              <Side   profile={_profile} />
              <div className="cs-profile_right">
              <div className="cs-height_30 cs-height_lg_30"></div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                <div className="cs-medium">
                    <>
                    <div className="row">
                        <div className="col-lg-6 cs-white_bg cs-box_shadow">
                            <h3 className="text-center">TEA</h3>
                                <div className="mb-2" style={{width: '100%', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                                <div className="text-center">
                                {(_wallet.tea)}
                                </div>
        
                        </div>
                        <div className="col-lg-6 cs-white_bg cs-box_shadow">
                            <h3 className="text-center">Gas Refund (BNB)</h3>
                                <div className="mb-2" style={{width: '100%', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                                <div className="text-center">
                                {_wallet.gas}
                                </div>
                        
                        </div>
        
                    </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <button  onClick={() => setLimitModal(true)}  className="cs-btn cs-style1 cs-btn_lg w-100">
                                    Remove Wallet Limit
                                </button>&nbsp;
                                <button  onClick={() => setGasModal(true)}  className="cs-btn cs-style1 cs-btn_lg w-100">
                                    Gas Refund
                                </button>
                            </div>
                        
                        </div>  
                    </>
                </div>
              
              </div>
            </div>
                </>
            )}            
        
        </div>
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