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

const Swapper = ({tokenin, tokenout}:any) => {

    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [inputCurrency, setInputCurrency] = useState('');
    const [outputCurrency, setOutputCurrency] = useState('');
    const [inputAmount, setInputAmount] = useState('');
    const [outputAmount, setOutputAmount] = useState('');
    const [currencyData, setCurrencyData]:any = useState([]);
    const [message, setMessage]:any = useState()
    // const sortedCurrencyData = currencyData.sort((a:any, b:any) => a.name.localeCompare(b.name));
    const [exchangeRate, setExchangeRate] = useState({
        fromAmount: 0,
        fromCurrency: '',
        toAmount: 0,
        toCurrency: '',
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
      
      // const handleInputChange = (event:any) => {
      //   const { name, value } = event.target;
      //   setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
      // };
      useEffect(() => {
        // console.log(formValues);
    }, [formValues]);
      
      const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        // Split the combined value by ":" to get ticker and network
        const [ticker, network] = value.split(':');
        // Update formValues with ticker and network separately
        setFormValues((prevValues:any) => ({
            ...prevValues,
            [name]: ticker, // Update with ticker only
            [`${name}_network`]: network // Add a separate property for network
        }));
    };
      
      const handleSwap = async (event:any) => {
        event.preventDefault();
        
        if (!formValues.fromCurrency || !formValues.toCurrency || !formValues.amount || !formValues.email) {
          alert('Please fill in all fields!');
          return;
        }
        // console.log(formValues)
        const response = await fetch("/api/swap", {
          method: "POST",
          body: JSON.stringify(formValues),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data)
        
        if(data.error){
            // console.log(data.error)
            setMessage(data.message)
        
        }else{
            console.log(data)
            if(!data.result){
              setMessage('receive address is not valid')
            }else{
              
              await setExchangeRate({
                fromAmount: data.fromAmount,
                fromCurrency:data.fromCurrency,
                toAmount: data.toAmount,
                toCurrency: data.toCurrency,
                payinAddress: data.payinAddress,
                qr: data.qr,
              });
            
            }
        }
      
      
      };
      
      function handleCloseShowSwap() {
      
        setExchangeRate({
          fromAmount: 0,
          fromCurrency: '',
          toAmount: 0,
          toCurrency: '',
          payinAddress: "",
          qr:""
        });
        setMessage('')
        
      }
      return (
        <>
        <div className="cs-height_90 cs-height_lg_80"></div>
        <section className="cs-page_head cs-bg" style={{backgroundImage: "url(/img/page_head_bg.svg)"}}>
                <div className="container">
                    <div className="text-center">
                        <h1 className="cs-page_title" style={{fontFamily: 'Comfortaa'}}>xSwap</h1>
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item" style={{fontFamily: 'Comfortaa'}}><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" style={{fontFamily: 'Comfortaa'}}>Swap</li>
                        </ol>
                    </div>
                </div>
            </section>
        <div className="cs-height_30 cs-height_lg_30"></div>
        <section className='container-fluid'>        
            <div className="container mt-5">
                <div className="row">
                <div className="col-lg-6 offset-lg-3 p-4" style={{ backgroundColor: '#fff', borderRadius: '10px' }}>
                    <div className="row">
                    {exchangeRate.fromAmount!=0 && (
                      <>
                    <div className="col-lg-8 offset-lg-2 p-4" style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border: '1px solid' }}>
                        <>
                            <div className="cs-single_post">
                                <div className="text-center">
                                    <h4 style={{ fontFamily: 'Comfortaa', padding:'6px' }}>Exchange Rate</h4>
                                    <p style={{ fontFamily: 'Comfortaa',  backgroundColor:'#F7FAFC' }}>{exchangeRate.fromAmount} {exchangeRate.fromCurrency} = {exchangeRate.toAmount} {exchangeRate.toCurrency}</p>
                                    <p className="p-0 m-0" style={{ fontFamily: 'Comfortaa' }}> send <b>{exchangeRate.fromAmount}</b> {exchangeRate.fromCurrency}<br/><small>to this address</small></p>
                                    <p className="p-0 m-3" style={{ fontFamily: 'Comfortaa', fontSize:'12px', backgroundColor:'#F7FAFC' }}>{exchangeRate.payinAddress}</p>
                                    <div>
                                      <div style={{ borderRadius: '10px', border: '2px solid #000000', display: 'inline-block' }}>
                                        <Image
                                            src={exchangeRate.qr}
                                            alt="pay in address"
                                            layout="responsive"
                                            width={200}
                                            height={200}
                                            objectFit="cover"
                                            style={{marginBottom:'0px'}}
                                            priority
                                        />
                                      </div>
                                    </div>
                                    <p className="mt-3" style={{ fontFamily: 'Comfortaa',  backgroundColor:'#F7FAFC' }}>{exchangeRate.toAmount} {exchangeRate.toCurrency} <br/>will be sent to<br/><b>{`${formValues.payToAddress.substring(0, 6)}...${formValues.payToAddress.substring(formValues.payToAddress.length - 6)}`}</b></p>
                                    <button onClick={handleCloseShowSwap} className="cs-btn cs-style1 cs-btn_lg w-100"  style={{ fontFamily: 'Comfortaa' }} >Back</button>
                                </div>
                            </div>
                            
                        </>
                    </div>
                    <div className="col-lg-8 offset-lg-2 p-4"><p className="text-center m-3">allow 5 - 30 mins for swap, based on network congestion. Head to our <a href="https://discord.gg/RFu8Yj4YYk" target='_blank'>discord </a> or telegram for support</p></div>
                    </>
                    )}
                    
                    {exchangeRate.fromAmount==0 && (
                            
                            <div className="col-lg-8 offset-lg-2 p-4" style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', border: '1px solid' }}>
                            <>
                            <div className="cs-single_post">
                                <div className="cs-bid_input_group2 text-center">
                                  {currencyData && (
                                      <form onSubmit={handleSwap}>
                                          <p className="p0 mb-0">from crypto</p>
                                          <select
                                            id="fromCurrency"
                                            name="fromCurrency"
                                            value={`${formValues.fromCurrency}:${formValues.fromCurrency_network}`}
                                            onChange={handleInputChange}
                                            className="cs-form_field"
                                            style={{ backgroundColor: '#EBF1FF'}}
                                        >
                                            <option value="">--Select--</option>
                                            {currencyData.map((currency: any, index: number) => (
                                                  <option 
                                                  key={`${currency.ticker}-${index}`} 
                                                  value={`${currency.ticker}:${currency.network}`}
                                                  style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}
                                              >
                                                  {currency.name} ({currency.ticker})
                                              </option>
                                            ))}
                                        </select>
                                          <div className="cs-height_20 cs-height_lg_20"></div>
                                      
                                          <p className="p0 mb-0">to crypto</p>
                                          <select
                                            id="toCurrency"
                                            name="toCurrency"
                                            value={`${formValues.toCurrency}:${formValues.toCurrency_network}`}
                                            onChange={handleInputChange}
                                            className="cs-form_field"
                                            style={{ backgroundColor: '#EBF1FF'}}
                                        >
                                            <option value="">--Select--</option>
                                            {currencyData.map((currency: any, index: number) => (
                                                  <option 
                                                  key={`${currency.ticker}-${index}`} 
                                                  value={`${currency.ticker}:${currency.network}`}
                                                  style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f0f0f0' }}
                                                  >
                                                      {currency.name} ({currency.ticker})
                                                  </option>
                                            ))}
                                        </select>
                                      <div className="cs-height_20 cs-height_lg_20"></div>
                                      
                                      <p className="p0 mb-0">amount</p>
                                      <input type="number" className="cs-form_field" onChange={handleInputChange} value={formValues.amount}  placeholder="0" name="amount" id="amount" style={{ backgroundColor: '#EBF1FF', color:'#000'}} />
                                      <div className="cs-height_20 cs-height_lg_20"></div>
                                      
                                      <p className="p0 mb-0">receiving address</p>
                                      <input type="text" className="cs-form_field" onChange={handleInputChange} value={formValues.payToAddress}  placeholder="" name="payToAddress" id="payToAddress" style={{ backgroundColor: '#EBF1FF', color:'#000'}} />
                                      
                                      <div className="cs-height_20 cs-height_lg_20"></div>
                                      
                                      <p className="p0 mb-0">email address</p>
                                      
                                      <input type="text" className="cs-form_field" onChange={handleInputChange} value={formValues.email}  placeholder="confirmation email" name="email" id="email" style={{ backgroundColor: '#EBF1FF', color:'#000'}} />
                                      
                                      <div className="cs-height_20 cs-height_lg_20"></div>
                                      <p className="text-center" style={{ backgroundColor: 'red', color: 'white' }}>{message}</p>
                                      
                                      <div className="cs-height_25 cs-height_lg_25"></div>
                                      
                                      <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100" onClick={handleSwap}><span>Get Quote</span></button>
                                  
                                    </form>                                  
                                  )}
                                
                                </div>
                            </div>
                        </>
                    </div>
                                        )}
                    
                    </div>
                </div>
                </div>
            </div>    
        </section>    
        </>
      
      );
}
export default Swapper;
