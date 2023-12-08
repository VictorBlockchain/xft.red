import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import { setWalletProvider,servBalances, servBag,servUserLoans,servBorrow,servSellApproveCheck,servApproveNFT,servActiveLoans,servBuyDefault,servTokenAllowance,servApproveToken } from '../services/web3Service';
import { useRouter } from 'next/router';
import axios from 'axios'
import dotenv from 'dotenv';
import moment from 'moment';
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';

dotenv.config();
const teaPot = process.env.teaPot;

const BLANK = '0x0000000000000000000000000000000000000000';

const Loan = ({nftea}:any) => {
    const { sdk, connected, connecting, provider, chainId } = useSDK();    
    const { account, setAccount } = useUser();
    const [_nftea,setNftea]:any = React.useState('')
    const [_showNftea,setShowNftea]:any = React.useState(false)
    let [_showActiveLoans,setShowActiveLoans]:any = useState(false)
    let [_showFAQ,setShowFAQ]:any = useState(false)
    const [_error, setError]:any = React.useState("")
    // const [activeTab, setActiveTab]:any = useState(1);
    const [_showGetLoan, setGetLoan]:any= useState(true);
    const [_activeLoans, setActiveLoans]:any = React.useState([]);
    const [_allLoans, setAllLoans]:any = React.useState([]);
    const [activeTab, setActiveTab] = useState('all'); 
    const [_loading, setLoading]:any = useState(false)
    
    useEffect(() => {
      if (connected && account) {
        setWalletProvider(provider);
        if(nftea>0){
          
         setActiveLoans('nftea')
          start(account)
        
        }else{
          
          setGetLoan(false)
          setShowActiveLoans(true)
          activeLoans()
      }
    }
    }, [account, connected]);
    
    const handleTabClick = (tab:any) => {
        setActiveTab(tab);
    };

    // React.useEffect(() => {
        
    //     let user_:any = localStorage.getItem("account")
    //     if(user_){
    //         setAccount(user_)
    //         if(nftea>0){
    //             start(user_)
    //         }
    //     }
    //     if(nftea<1){
    //         setGetLoan(false)
    //         setShowActiveLoans(true)
    //         setActiveTab(2)
    //         activeLoans()
    //     }
    // }, []);

    React.useEffect(() => {
        
        if(_nftea){
            setShowNftea(true)
        }
    }, [_nftea]);
    
    React.useEffect(() => {
        setShowActiveLoans(true)
    }, [_activeLoans]);
    
    // React.useEffect(() => {
    //     setShowFAQ(true)
    //     setGetLoan(false)
    //     setShowActiveLoans(false)
    
    // }, [_showFAQ]);


    const start = async (user_:any) => {
        setLoading(true)
        let resp_ = await servBag(nftea,user_)
        // console.log(resp_)
        let ipfs_:any = resp_[0]
        axios.get(ipfs_)
        .then(async(resp)=>{
            // console.log(resp)
            let loans:any = await servUserLoans(user_)
            if(loans[3]==0){
                loans[3] = 45;
            }
            let data:any = []
            data.id = nftea
            data.name = resp.data.name
            data.bnb = resp_[2][0]
            data.tea = resp_[2][1]
            data.holding = resp_[2][2]
            data.nftea = resp.data
            data.loans = loans
            setNftea(data)
        })
        setLoading(false)

    }
    const activeLoans = async () => {
        try {
            setLoading(true)

          let data_:any = [];
          let loans = await servActiveLoans();
          console.log(loans)
          const axiosRequests = loans[0].map(async (element:any, i:any) => {
            let ipfs_ = loans[1][i];
            const resp = await axios.get(ipfs_);
            resp.data.key = i;
            resp.data.id = element;
            resp.data.bnb = loans[3][0][3];
            resp.data.tea = loans[3][0][4];
            resp.data.loanAmount = loans[3][0][2];
            resp.data.defaultDate = loans[3][0][1];
            data_.push(resp.data);
          });
          await Promise.all(axiosRequests);
          setActiveLoans(data_);
        } catch (err) {
          console.log(err);
        }
        setLoading(false)

      };
    const handleError = async (msg:any)=>{
        setError(msg)
      }
    async function handleShopApprove(){
        let approved = await servSellApproveCheck(account, teaPot)
        // console.log(approved)
        if(!approved){
            handleError('please approve the shop to sell your nftea')
            let resp_ = await servApproveNFT(account,teaPot)
            console.log(resp_)
            if(resp_.status){
                approved = true
            }
        }
        return approved;
    }
    const handleBorrow = async (bnbonly:any) => {
        let approved = await handleShopApprove()
        if(approved){
            let resp_:any = await servBorrow(account,nftea,bnbonly)
            console.log(resp_)
            if(resp_.status){
                handleError('loan issued')
            
            }
        }
    
    }
    const handleBuyDefault = async(nftea:any, value:any) => {
        
        let pass = 0;
        let fee = value*5;
        fee = fee/100
        value = value+fee;

        let resp_:any =await servTokenAllowance(account,teaPot)
        if(resp_<value){
            resp_ =await servApproveToken(account,value,teaPot)
            if(resp_.status){                    
                handleError('token approved')
                pass = 1
            }
        }else{
            pass = 1
        }
        if(pass>0){
            let resp:any = await servBuyDefault(account,nftea)
            if(resp.status){
                handleError('it\'s yours!')
            
            }
        }

    }
    const handleShow = async(value:any) => {
        if(value==1){
            
            setGetLoan(true)
            setShowActiveLoans(false)
            setShowFAQ(false)
        
        }
        if(value==2){
            await activeLoans()
            setGetLoan(false)
            setShowFAQ(false)
        
        }
        if(value==3){
            setGetLoan(false)
            setShowActiveLoans(false)
            setShowFAQ(true)
        }
        
        setActiveTab(value);
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
            <section className="cs-page_head cs-bg" style={{backgroundImage: "url(/img/page_head_bg.svg)"}}>
                <div className="container">
                    <div className="text-center">
                        <h1 className="cs-page_title" style={{fontFamily: 'Comfortaa'}}>Get A Loan</h1>
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item" style={{fontFamily: 'Comfortaa'}}><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" style={{fontFamily: 'Comfortaa'}}>Loans</li>
                        </ol>
                    </div>
                </div>
            </section>
            <div className="cs-height_100 cs-height_lg_70"></div>
            <div className="container">
            <div className="cs-isotop_filter cs-style1 cs-center">
                <ul className="cs-mp0 cs-center">
                    <li className={activeTab === 'all' ? 'active' : ''}>
                        <a href="#" onClick={() => handleTabClick('all')}>
                            <span>Active Loans</span>
                        </a>
                    </li>
                    <li className={activeTab === 'loan' ? 'active' : ''}>
                        <a href="#" onClick={() => handleTabClick('loan')}>
                            <span>Get A Loan</span>
                        </a>
                    </li>
                    <li className={activeTab === 'nftea' ? 'active' : ''}>
                        <a href="#" onClick={() => handleTabClick('nftea')}>
                            <span>NFTea</span>
                        </a>
                    </li>
                    <li className={activeTab === 'faq' ? 'active' : ''}>
                        <a href="#" onClick={() => handleTabClick('faq')}>
                            <span>Faq</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="cs-height_30 cs-height_lg_30"></div>

            {activeTab === 'all' && (
                <div className="row">
                    {_activeLoans.length<0 && !_loading && (
                        <div className="col-12">
                                     <p className="mb-4">
                                        Buy defaulted loans from the Teapot. Some defaulted loans may have 55% or more in value stored in their bags compared to the loan amount.
                                    </p>
                                    <p className="mb-4">
                                    Borrow from the Teapot, a community vault, based on the amount of Tea Tokens held in your NFT's wallet and your Loan-to-Value (LTV) rating. The higher your LTV rating, the more you can borrow. Loans are issued for 30 days, and you start with a 45% LTV rating.
                                    </p>
                        </div>
                    )}
                    {_activeLoans.length<0 && _loading && (
                        <div className="col-12">
                            <p className="text-center">no active loans</p>
                        </div>
                    )}
                    {_activeLoans.map((item: any) => (
                        <>
                            <div className="co-lg-4">
                                <div className="col-xl-3 col-lg-4 col-sm-6" key={item.key}>
                                    <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                                    <span className="cs-card_like cs-primary_color">{item.loanAmount}</span>
                                    <a href={`/view/${item.id}/0/${BLANK}`} className="cs-card_thumb cs-zoom_effect">
                                        <Image
                                        src={item.image}
                                        alt="Image"
                                        className="cs-zoom_item"
                                        width="200"
                                        height="200"
                                        // onLoad={handleImageLoad}
                                        />
                                    </a>
                                    <div className="cs-card_button">
                                        <a href={`/view/${item.id}/0/${BLANK}`}  className="cs-btn cs-style1 cs-btn_lg w-100">
                                            <span>View</span>
                                        </a>
                                    </div>
                                    <div className="cs-card_info">
                                        <a href="#" className="cs-avatar cs-white_bg">
                                        <span>{`${account.substring(0, 6)}...${account.substring(account.length - 6)}`}</span>
                                        </a>
                                        <h3 className="cs-card_title text-center">
                                        <a href={`/view/${item.id}/0/${BLANK}`}>{item.name} #{item.id}</a>
                                        </h3>
                                        <div className="cs-card_price text-center">
                                        <b className="cs-primary_color">{item.typeName}</b>
                                        </div>
                                        <hr />
                                        <div className="cs-card_footer">
                                        <div className="row">
                                            <div className="col-12">
                                            <table className="text-center mb-0 pb-0">
                                                <tbody>
                                                <tr>
                                                    <td>0 BNB</td>
                                                    <td>{formatNumber(item.tea) || 0} TEA</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            </div>
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

            {activeTab === 'loan' && (
                <div className="row">
                    <div className="co-lg-4">
                    loan
                    </div>
                
                </div>
            )}
            {activeTab === 'nftea' && (
                <div className="row">
                    <div className="co-lg-4">
                    nftea
                    </div>
                
                </div>
            )}
            {activeTab === 'faq' && (
                <div className="row">
                    <div className="co-lg-4">
                    faq
                    </div>
                
                </div>
            )}

        </div>

    </>
    )
}
    export default Loan;