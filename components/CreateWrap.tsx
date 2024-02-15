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
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
import Modal from './Modal';
const BLANK = '0x0000000000000000000000000000000000000000';

import dotenv from 'dotenv';
dotenv.config();

const CreateWrap = () => {
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [_nftImage, setNFTImage]:any = React.useState("")
    const [_showNFTImage, setShowNFTImage]:any = useState(false)
    let [contractAddress, setContractAddress] = useState('');
    const [_msg, setMessage]:any = useState()

    const handleSetWrapContract = () => {
        const newContractAddress:any = process.env.mint; // Set the desired value here
        setContractAddress(newContractAddress);
      };

    const handleWrap = async (event:any) => {
        event.preventDefault();
        let pass = 0;
        console.log(contractAddress)
        
        let resp1_:any = await servWrapApproveCheck(account,contractAddress)
        // console.log(resp1_)
            if(!resp1_){
                
                let resp_:any = await servApproveWrapper(account,contractAddress)
                if(resp_.status){
                    pass = 1
                }
            }else{
                pass = 1;
            }
            if(pass>0){
                    let label = await servContract2Label(contractAddress)
                    let contract = contractAddress
                    let nftid = event.target.nftid.value
                    let ipfs_ = await servURI(contract,nftid);
                    // console.log(label)
            
                    let settings_:number[] = []
                    settings_.push(parseInt(label)) //0 link to label
                    settings_.push(0) // 1 registration in years
                    settings_.push(0) //2 minter license
                    settings_.push(11) //3 nftea type
                    settings_.push(0) //4 if type is license, license term
                    settings_.push(0) //5 0 false, 1 true
                    settings_.push(1) //6 quantity
                    settings_.push(0) //7 label registration expire
                    settings_.push(0) //8 unused.. use to be redeem days
                    settings_.push(1) //9 transferable
                    settings_.push(parseInt(nftid)) // 10 wrapto
                    settings_.push(0) //11 label royalty
                    settings_.push(1) // 12 open
            
                    let addresses_ = []
                    addresses_.push(account) // 0 creator/label owner
                    addresses_.push(account) // 1 minter
                    addresses_.push(BLANK) // 2 wallet
                    addresses_.push(BLANK) //3 label wallet
                    addresses_.push(contractAddress) //4 external nft contract address
                    // console.log(settings_, addresses_)
                    let result = await servWrap(account,contractAddress,event.target.nftid.value,settings_,addresses_,'null')
                    if(result.status){
                        setMessage("wrap completed")
                        settings_ = []
                        addresses_ = []

                    }
        
            }else{
                setMessage('error wrapping, check contract address or nft id')
            }
      }

    return(
        <>
            <div className="row">
                {/* <div className="col-lg-4">
                {_showNFTImage && (
                                    <Image
                                    className="rounded-lg shadow-md dark:shadow-gray-700 group-hover:scale-110 transition-all duration-500"                      
                                    src={_nftImage}
                                    alt="logo"
                                    width={600}
                                    height={600}
                                    priority
                                    />
                                )}
                                {!_showNFTImage && (
                                    <Image
                                    className="rounded-lg shadow-md dark:shadow-gray-700 group-hover:scale-110 transition-all duration-500"                      
                                    src="/assets/images/kit-tea.gif"
                                    alt="loading"
                                    width={600}
                                    height={600}
                                    priority
                                    />
                                )}
                </div> */}
                <div className="col-lg-8 offset-lg-2 cs-white_bg cs-box_shadow cs-general_box_5">
                <form className="row p-3" id="nft" onSubmit={handleWrap}>
                        <label className="cs-form_label text-center">NFT Contract Address:</label>
                        <div className="cs-form_field_wrap">
                            <input
                                name="contractAddress"
                        
                                type="text"
                                className="cs-form_field"
                                placeholder="0x..."
                                value={contractAddress}
                                onChange={(e) => setContractAddress(e.target.value)}
                                required
                            />                       
                        </div>
                        <p className="text-center">
                                <small>
                                contract address of the nft you want to wrap (<a href="#contractAddress" onClick={handleSetWrapContract}>click here</a>) to use NfTea
                                </small>
                            </p> 
                        <div className="cs-height_20 cs-height_lg_20"></div>
                        <label className="cs-form_label text-center">NFT ID</label>
                        <div className="cs-form_field_wrap">
                            <input name="nftid" id="nftid"  type="text" className="cs-form_field" placeholder="104" />
                        </div>
                        <p className="text-center">id of the nft you are wrapping</p>
                        <div className="cs-height_20 cs-height_lg_20"></div>
                        <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Wrap NFT</span></button>
                        {_msg && (
                            <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                        )}

                </form>

                </div>
            </div>
        </>
    )
}
export default CreateWrap;