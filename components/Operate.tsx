'use client';
import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import ReactPlayer from 'react-player'
import axios from "axios";
import moment from 'moment';
import { setWalletProvider,servLabel,servIPFS,servOperator,servOperators,servWithdrawSettings,servSetRole,servSetOperator,servWithdrawBNB,servWithdrawToken,servWithdrawNft, servNFT,servOperatorApproveCheck,servApproveOperator, servSellApproveCheck,servLockWallet, servBag } from '../services/web3Service';
import { servSetProfile } from '../services/profile';
import { BigNumber } from 'bignumber.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
import SideOperate from "./OperateSide";
import Modal from './Modal';

import dotenv from 'dotenv';
dotenv.config();

const BLANK:any = '0x0000000000000000000000000000000000000000';
const teaToken = '0x076177154c71DC80637dCD7c48f7661eEF2363F8';
const shopLogic = '0xdc5a1953b37FFdcFD6072935abEF858ecEdb8FC9';

const Operate = ({ nftea, op}:any) => {
    const router:any = useRouter()
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [isAddOperatorModalOpen, setAddOperatorModalOpen] = useState(false);
    const [isOperatorSettingsrModalOpen, setOperatorSettingsModalOpen] = useState(false);
    const [isOperatorEditModalOpen, setOperatorEditModalOpen] = useState(false);
    const [isOperatorWithdawModalOpen, setOperatorWithdrawModalOpen] = useState(false);
    const [_error, setError]:any = React.useState("")
    const [_errorModalOpen, setErrorModal]:any = React.useState(false)
    const [_operators, setOperators]:any = React.useState([]);
    const [_showOperators, setShowOperators]:any = React.useState(false);
    const [_showEditWithdraw, setShowEditWithdraw]:any = React.useState(false);
    const [_showEditRole, setShowEditRole]:any = React.useState(false);
    const [_showSettings, setShowSettings]:any = React.useState(false);
    const [_operator, setOperator]:any = React.useState('');
    let [_license, setLicense]:any = React.useState('');
    const [_operatorSettings, setOperatorSettings]:any = React.useState("");
    const [withdrawalOption, setWithdrawalOption] = useState('');
    const [_wallet, setWallet] = useState('');
    const [_nftea, setNFTEA]:any = useState([]);
    const [_bag, setBag]:any = useState([]);
    const [_showInfo, setShowInfo] = useState(false);
    const [_showLockWallet, setShowLockWallet] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateTime, setSelectedDateTime]:any = useState();
    const [_activeTab, setActiveTab]:any = useState();
    const [_labelData, setLabelData]:any = useState('');

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
        
        if(_operators.length>0){
            setShowOperators(true)
            // console.log(_operators)
        }
    }, [_operators]);

    React.useEffect(() => {
        
        if(_nftea.length>0){
            //setShowOperators(true)
            setShowInfo(true)
            // console.log(_nftea)
        }
    }, [_nftea]);

    React.useEffect(() => {
        if(_error!=""){
         setErrorModal(true)
        }else{
            setErrorModal(false)
        }
    }, [_error]);
    React.useEffect(() => {
        if(_operatorSettings!=""){
            setOperatorEditModalOpen(false)
            setShowSettings(true)
        }
    }, [_operatorSettings]);

    const openModal = (type_:any) => {
        if(type_==1){

            setAddOperatorModalOpen(true)
        }
        if(type_==2){

            setOperatorEditModalOpen(true)

        }
        if(type_==3){
            setOperatorSettingsModalOpen(true)

        }
        if(type_==4){
            setOperatorWithdrawModalOpen(true)

        }  
        if(type_==5){
            setShowEditWithdraw(true)
            setOperatorEditModalOpen(false)
        }  
        if(type_==6){
            setShowEditRole(true)
            setOperatorEditModalOpen(false)
        }  
        if(type_==7){
            setShowSettings(true)
            setOperatorEditModalOpen(false)
        } 
        if(type_==8){
            setShowLockWallet(true)
        }  
    };
  
    const closeModal = (type_:any) => {
        if(type_==1){

            setAddOperatorModalOpen(false)
        
        }
        if(type_==2){
            setOperatorEditModalOpen(false)

        } 
        if(type_==3){
            setOperatorSettingsModalOpen(false)

        }  
        if(type_==4){
            setOperatorWithdrawModalOpen(false)
 
        } 
        if(type_==5){
            setShowEditWithdraw(false)
            setOperatorEditModalOpen(true)
        }  
        if(type_==6){
            setShowEditRole(false)
            setOperatorEditModalOpen(true)
        }  
        if(type_==7){
            setShowSettings(false)
            setOperatorEditModalOpen(true)
        }  
        if(type_==8){
            setShowLockWallet(false)
        } 
    };
    const handleError = async (msg:any)=>{
        setError(msg)
      }
      const closeErrorModal = async () => {
        setErrorModal(false);
        setError("")
 
    };

    async function handleStart(user_:any){
        let nftData:any = await servNFT(nftea)
        let bagData:any = await servBag(nftea,user_);
            // console.log(bagData)
            setWallet(nftData[0][1][2])
            setNFTEA(nftData[0])
            setBag(bagData)
        // console.log(bagData)
        let operators:any = await servOperators(nftea);
        // console.log(operators)
            let ops_:any = []
            for (let i = 0; i < operators[0].length; ++i) {
                let ops:any = await axios.get(`/api/getProfile?account=${operators[0][i]}`)
                if(ops.data){
                    ops.data.key = i
                    ops.data.license = operators[1][i]
                    ops.data.expire = operators[2][i]
                    ops.data.role = operators[3][i]
                    ops.data.account = operators[0][i]
                    ops_.push(ops.data)    
                }
            }
            setOperators(ops_)
            handleLabel()
    }
    async function handleLabel(){

        let respLabel_:any = await servLabel(nftea, 'null')
        let labelipfs_:any = await servIPFS(respLabel_.label[0][0])
        if(labelipfs_){
            axios.get(labelipfs_)
            .then(async(resp:any)=>{
                if(resp.data){
                    setLabelData(resp.data)
                }
            })
        }
    }
    const handleEditOperator = async (op:any, license:any)=>{
        setOperator(op)
        setLicense(license)
        setOperatorEditModalOpen(true)

      }
      const handleWithdraw = async (op:any, license:any)=>{
        setOperator(op)
        setLicense(license)
        setOperatorWithdrawModalOpen(true)

      }
      const handleOperatorSettings = async ()=>{

        let opsettings_ = await servOperator(_operator,nftea);
        console.log(opsettings_)
        setOperatorSettings(opsettings_)

      }
    async function handleSetOperator(event:any){
        event.preventDefault();

        let license_ = event.target.license.value
        let operator_ = event.target.address.value
        let expire_ = event.target.expire.value
        let role_ = event.target.role.value
        let label = nftea
        let addresses_ = []

        let isApproved:any = await servOperatorApproveCheck(account)
        let pass = 0;
        if(!isApproved){
            let approve:any = await servApproveOperator(account)
            if(approve.status){
                pass = 1
            }
        }else{
            pass = 1;
        }
        if(pass>0){

            let resp_ = await servSetOperator(account,operator_,_wallet,nftea,license_,expire_,role_)
            if(resp_.status){
                let data_:any = {
                    label: nftea,
                    operator: operator_,
                    license: license_,
                    expire: expire_,
                    role: role_,
                    wlimit: 0,
                    wdelay:0,
                    wfreq:0,
                    
                }
                const JSONdata = JSON.stringify(data_)
                const endpoint = '/api/setOperator'
                const options = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSONdata,
                }
                setAddOperatorModalOpen(false)
                handleError('operator added')
                handleStart(account)
            }
    
        }
    }
    async function handleSetWithdrawSettings(event:any){
        event.preventDefault();
        let wlimittea:any = event.target.wlimittea.value
        let wlimitbnb:any = event.target.wlimitbnb.value
        let wfreq:any = event.target.wfreq.value
        // let wdelay:any = event.target.wdelay.value
        let wexpire:any = event.target.wexpire.value
        let numbers:any = [];
        if(wlimitbnb < 1){
            handleError('bnb limit must be at least 1')
        }else if(wlimittea < 1){
            handleError('tea token limit must be at least 1')
        }else{
        
            numbers.push(parseInt(wlimittea));
            numbers.push(parseInt(wlimitbnb));
            numbers.push(parseInt(wfreq));
            numbers.push(0);
            numbers.push(parseInt(wexpire));
            numbers.push(parseInt(_license));
            console.log(_operator)
            let resp_:any = await servWithdrawSettings(account, _operator, numbers,nftea)
            if(resp_.status){
                let data_:any = {
                    label: nftea,
                    operator: _operator,
                    expire: wexpire,
                    wlimittea: wlimittea,
                    wlimitbnb: wlimitbnb,
                    nextwithdraw:0,
                    wfreq:wfreq,
                    
                }
                const JSONdata = JSON.stringify(data_)
                const endpoint = '/api/updateOperator'
                const options = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSONdata,
                }
                handleError('settings updated')
                setShowEditWithdraw(false)
                setOperatorEditModalOpen(false)
            
            }

        }
        
    }
    async function handleSetRole(event:any){
        event.preventDefault();
        let role_ = event.target.wrole.value
        let license_ = event.target.license.value
        let operator_ = event.target.operator.value
        let nftea2operate = nftea
        let resp_ = await servSetRole(account,_operator,nftea,role_)
        if(resp_.status){
            handleError('role updated')

        }

    }
    async function handleSetWithdraw(event:any){
        event.preventDefault();
        let type = event.target.type.value
        if(type==1){
            // console.log(_nftea)
            if(_nftea.settings[3]>6){
                _license = 0
            }
            let bnbamount = event.target.bnbamount.value
            let resp_ = await servWithdrawBNB(account,_license, parseInt(nftea), bnbamount)
            if(resp_.status){
                handleError('bnb withdraw processing')
                setOperatorWithdrawModalOpen(false)
                // closeModal(5)
    
            }
        }else if(type==2){
            
            let tokenAddress = event.target.tokenAddress.value
            let amount = event.target.amount.value
            if(tokenAddress == ""){
                tokenAddress = process.env.teaToken
            }
            if(_nftea.settings[3]>6){
                _license = 0
            }
            // console.log(tokenAddress)
            let resp_ = await servWithdrawToken(account,_license, nftea, tokenAddress,amount)
            if(resp_.status){
                handleError('token withdraw processing')
                setOperatorWithdrawModalOpen(false)

            }
        }else{
            let contractAddress = event.target.contractAddress.value
            if(contractAddress==""){
                contractAddress = process.env.mint
            }
            let quantity = event.target.quantity.value
            let nftid = event.target.nftid.value
            let withdrawAddress = event.target.withdrawAddress.value
            if(_nftea.settings[3]>6){
                _license = 0
            }
            let resp_ = await servWithdrawNft(account,_license,nftea,contractAddress,nftid,quantity,withdrawAddress)
            if(resp_.status){
                handleError('nft withdraw processing')
                setOperatorWithdrawModalOpen(false)

            }
        
        }
        // console.log(type)
    
    }
    const handleDateTimeChange = (dateTime:any) => {
        setSelectedDateTime(dateTime);
      }
    const handleLockWallet = async (event:any) => {
        event.preventDefault();
        
        const now = new Date();
        const minDate = new Date(now.getTime() + 5 * 60 * 1000);
        if (selectedDateTime < minDate) {
            handleError('unlock date must be at least 5 mins in the future')
            return;
        }
        const timestamp = Math.floor(selectedDateTime.getTime() / 1000);
        console.log(_nftea.nftea,timestamp)
        let resp_ = await servLockWallet(_nftea.nftea,timestamp);
        if(resp_.status){
            handleError('wallet locked')
            closeModal(8)
        }
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
            
                <div className="cs-prifile_wrap">
                    <SideOperate labelInfo={_labelData} />
                    <div className="cs-profile_right">
                        <div className="cs-height_30 cs-height_lg_30"></div>
                        <div className="cs-height_30 cs-height_lg_30"></div>
                        {_showOperators && (
                            <>
                            <div className="row">
                            {_operators.map((item:any) =>
                                <div className="col-lg-6">
                                    <div className="row cs-white_bg cs-box_shadow cs-general_box_5">
                                        <div className="col-4">
                                            <Image
                                                className="h-full w-full object-cover lg:w-48"
                                                src={item.profilePic}
                                                alt="logo"
                                                width={200}
                                                height={200}
                                                priority
                                                style={{ borderRadius: '5px' }} 

                                            />
                                        </div>
                                        <div className="col-8">
                                            <table>
                                            <tr><td><a href="#">{item.artistName}</a></td> <td><small>license: #{item.license}</small></td></tr>
                                                <tr>
                                                    <td>
                                                        {item.expire==0 && (
                                                            <p><small>expires: n/a</small></p>
                                                        )}
                                                        {item.expire>0 && (
                                                            <p><small>expires: {moment.unix(item.expire).format("MMMM Do YYYY, h:mm:ss a")}</small></p>
                                                        )}
                                                    </td> 
                                                    <td>
                                                        <small>role: #{item.role}</small>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <a href={`/profile/${item.account}`}>{`${item.account.substring(0, 6)}...${item.account.substring(item.account.length - 6)}`}</a>
                                                    </td>
                                                    <td>
                                                        {item.role==1 && _nftea[2][3]<7 && (
                                                    
                                                            <a href="#" onClick={() => handleEditOperator(item.account, item.license)}><i className="mdi mdi-account-edit"> edit</i></a>
                                                        )} 
                                                        {item.account==account && moment().isAfter(moment.unix(_bag[2][3])) && (
                    
                                                            <a href="#" onClick={() => handleWithdraw(item.account, item.license)}><i className="mdi mdi-account-edit"> withdraw</i></a>
                                                        )}
                                                        {item.account==account && moment().isBefore(moment.unix(_bag[2][3])) && (
                
                                                        <span>wallet locked</span>
                                                        )}
                                                    </td>
                                                </tr>
                                                {item.role==1 && item.account == account && (
                                                    <tr><td col-span="2">
                                                        <button onClick={()=>{openModal(1)}} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Add Operator</span></button>    
                                                    </td></tr>
                                                )}
                                            </table>

                                        </div>
                                    </div>
                                </div>
                            )}
                            </div>
                            </>
                        )}
                    </div>
                </div>
        </div>
        {_errorModalOpen &&  (
            <Modal onClose={closeErrorModal} title="error">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                {_error}                  
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {isAddOperatorModalOpen &&  (
            <Modal onClose={() => closeModal(1)} title="Add Operator">
              <div className="cs-single_post">
              <form onSubmit={handleSetOperator}>
                    <label className="cs-form_label">Operator</label>
                    <div className="cs-form_field_wrap">
                        <input type="text" className="cs-form_field" placeholder="0x..." name="address" id="address" />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">License</label>
                    <div className="cs-form_field_wrap">
                        <input type="number" className="cs-form_field" placeholder="3" name="license" id="license" />
                    </div>
                    <p>Operator License NFTea #. Operator role expires when license expires</p>
                    <div className="cs-height_20 cs-height_lg_20"></div>

                    <label className="cs-form_label">Expire in</label>
                    <div className="cs-form_field_wrap">
                        <input type="number" className="cs-form_field" placeholder="3" name="expire" id="expire" />
                    </div>
                    <p>Override license expire</p>
                  
                  <div className="cs-height_20 cs-height_lg_20"></div>
                  
                  <label className="cs-form_label">Role ID</label>
                    <div className="cs-form_field_wrap">
                        <input type="number" className="cs-form_field" placeholder="3" name="role" id="role" />
                    </div>
                    <p>set to 1 for super operator. A super operator can add other operators</p>
                  <div className="cs-height_25 cs-height_lg_25"></div>
                  
                  <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Add Operator</span></button>
                
                </form>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {isOperatorSettingsrModalOpen &&  (
            <Modal onClose={() => closeModal(1)} title="Operator Settings">
              <div className="cs-single_post">
                <div className="row">
                    <div className="col-12">
                    <p className="text-center"> <a href="#" onClick={() => openModal(3)}   className="cs-btn cs-style1 cs-btn_lg w-100"><i className="mdi mdi-plus"></i> Edit Operator</a></p>
                    <p className="text-center"> <a href="#" onClick={() => openModal(4)}   className="cs-btn cs-style1 cs-btn_lg w-100"><i className="mdi mdi-plus"></i> Withdraw Settings</a></p>
                    
                    </div>
                </div>
                
              </div>
            </Modal>
        
        )}
        {isOperatorEditModalOpen &&  (
            <Modal onClose={() => closeModal(2)} title="Edit Operator">
              <div className="cs-single_post">
                <div className="row">
                    <div className="col-12">
                    <p className="text-center pb-3"> <a href="#" onClick={() => openModal(5)}   className="cs-btn cs-style1 cs-btn_lg w-100"> Withdraw Permissions</a></p>
                    <p className="text-center pb-3"> <a href="#" onClick={() => openModal(6)}   className="cs-btn cs-style1 cs-btn_lg w-100">Edit Role</a></p>
                    <p className="text-center"> <a href="#" onClick={() => handleOperatorSettings()}   className="cs-btn cs-style1 cs-btn_lg w-100"> View Settings</a></p>
                    
                    </div>
                </div>
                
              </div>
            </Modal>
        
        )}
        {_showEditWithdraw &&  (
            <Modal onClose={() => closeModal(5)} title="Withdraw Settings">
              <div className="cs-single_post">
              <form onSubmit={handleSetWithdrawSettings}>
                    <label className="cs-form_label">withdraw limit (in BNB):</label>
                    <div className="cs-form_field_wrap">
                        <input type="number" className="cs-form_field" placeholder="1" name="wlimitbnb" id="wlimitbnb" required />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">withdraw limit (in TEA):</label>
                    <div className="cs-form_field_wrap">
                        <input type="number" className="cs-form_field" placeholder="1000000" name="wlimittea" id="wlimittea" required />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">withdraw frequency (in days)</label>
                    <div className="cs-form_field_wrap">
                        <input type="number" className="cs-form_field" placeholder="3" name="wfreq" id="wfreq" />
                    </div>
                    <p>How often can this operator withdraw from label wallet?</p>
                  
                  <div className="cs-height_20 cs-height_lg_20"></div>
                  
                  <label className="cs-form_label">license expire (in days)</label>
                    <div className="cs-form_field_wrap">
                        <input type="number" className="cs-form_field" placeholder="3" name="wexpire" id="wexpire" />
                    </div>
                    <p>Override operator license expiration</p>
                  <div className="cs-height_25 cs-height_lg_25"></div>
                  
                  <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Edit Settings</span></button>
                
                </form>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {_showEditRole &&  (
            <Modal onClose={() => closeModal(6)} title="Withdraw Settings">
              <div className="cs-single_post">
              <form onSubmit={handleSetRole}>
                    <label className="cs-form_label">Role ID:</label>
                    <div className="cs-form_field_wrap">
                        <input type="number" className="cs-form_field" placeholder="1" name="wrole" id="wrole" required />
                    </div>
                    <p>set to 1 for super operator. A super operator can add other operators</p>
                    
                    <div className="cs-height_20 cs-height_lg_20"></div>
                                  
                    <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Edit Role</span></button>
                
                </form>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {_showSettings &&  (
            <Modal onClose={() => closeModal(7)} title="Operator Settings">
              <div className="cs-single_post">
                <div className="row">
                    <div className="col-12">
                    <p className="mb-5">withdraw limit BNB: {_operatorSettings[1][2]/1000000000000000000} <small>BNB</small><br/><small>max this operator can withdraw</small></p>
                    <p className="mb-5">withdraw limit TEA: {_operatorSettings[1][3]/1000000000} <small>TEA</small><br/><small>max this operator can withdraw</small></p>
                    <p className="mb-5">next withdraw: {moment.unix(_operatorSettings[1][1]).format('MMMM Do YYYY, h:mm:ss a') }</p>
                    <p>withdraw frequency: <small>every </small>{_operatorSettings[1][0]} <small>days </small> <br/><small>how often can this operator withdraw (in days)</small></p>
                    
                    </div>
                </div>
                
              </div>
            </Modal>
        
        )}
        {isOperatorWithdawModalOpen &&  (
            <Modal onClose={() => closeModal(4)} title="Withdraw">
              <div className="cs-single_post">
              <form onSubmit={handleSetWithdraw}>
                    <label className="cs-form_label">select one:</label>
                    <div className="cs-form_field_wrap">
                        <select
                            name="withdrawalOption"
                            id="withdrawalOption"
                            className="form-input mt-3 rounded-full w-full"
                            value={withdrawalOption}
                            onChange={(e) => setWithdrawalOption(e.target.value)}
                        >
                            <option value="">Select an option</option>
                            <option value="bnb">Withdraw BNB</option>
                            <option value="token">Withdraw Token</option>
                            <option value="nftea">Withdraw NFTea</option>
                        </select>                    
                    </div>
                    <p>what do you want to withdraw</p>  
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    {withdrawalOption === "token" && (
                        <>
                            <label className="cs-form_label">Token Address:</label>
                            <input type="hidden" id="type" value="2" />
                            <div className="cs-form_field_wrap">
                                <input type="text" className="cs-form_field" placeholder="1" name="tokenAddress" id="tokenAddress" required />
                            </div>
                            <p>Leave blank for Tea Tokens</p>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Token Amount:</label>
                            <input type="hidden" id="type" value="2" />
                            <div className="cs-form_field_wrap">
                                <input type="text" className="cs-form_field" placeholder="1" name="amount" id="amount" required />
                            </div>
                        </>
                    
                    )}
                    {withdrawalOption === "nftea" && (
                        <>
                            <label className="cs-form_label">Contract Address:</label>
                            <input type="hidden" id="type" value="3" />
                            <div className="cs-form_field_wrap">
                                <input type="text" className="cs-form_field" placeholder="1" name="contractAddress" id="contractAddress" required />
                            </div>
                            <p>Leave blank for NFTea</p>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">NFT ID:</label>
                            <div className="cs-form_field_wrap">
                                <input type="number" className="cs-form_field" placeholder="1" name="nftid" id="nftid" required />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Quantity:</label>
                            <div className="cs-form_field_wrap">
                                <input type="number" className="cs-form_field" placeholder="1" name="quantity" id="quantity" required />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Withdraw to address:</label>
                            <div className="cs-form_field_wrap">
                                <input type="text" className="cs-form_field" placeholder="0x.." name="withdrawAddress" id="withdrawAddress" required />
                            </div>
                        </>
                    
                    )}
                    {withdrawalOption === "bnb" && (
                        <>
                            <label className="cs-form_label">BNB Amount:</label>
                            <input type="hidden" id="type" value="1" />
                            <div className="cs-form_field_wrap">
                                <input type="text" className="cs-form_field" placeholder="1" name="bnbamount" id="bnbamount" required />
                            </div>
                        </>
                    
                    )}
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Withdraw</span></button>
                
                </form>
              </div>
            </Modal>
        
        )}
        {_showLockWallet &&  (
            <Modal onClose={() => closeModal(8)} title="Withdraw Settings">
              <div className="cs-single_post">
              <form onSubmit={handleLockWallet}>
                    <label className="cs-form_label">Unlock Date:</label>
                    <div className="cs-form_field_wrap">
                    <input type="hidden" id="type" value="1" />
                                        <DatePicker
                                            placeholderText='lock wallet until'
                                            className='form-input mt-3 rounded-full w-full'
                                            selected={selectedDateTime}
                                            onChange={handleDateTimeChange}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            dateFormat="dd/MM/yyyy HH:mm"
                                            minDate={new Date()}
                                            isClearable
                                            />                    
                    </div>                    
                    <div className="cs-height_20 cs-height_lg_20"></div>
                                  
                    <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Lock</span></button>
                
                </form>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        </>
    )
}
    export default Operate;