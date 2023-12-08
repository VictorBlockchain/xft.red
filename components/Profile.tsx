import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import { setWalletProvider, servMyNFTeas,servUserSales, servSale,servMyDisplays,servMyLoans, servIPFS, servBalances,servRepayLoan,servTokenAllowance,servApproveToken,servURI } from '../services/web3Service';
import { useRouter } from 'next/router';
import axios from 'axios'
import moment from 'moment';
import dotenv from 'dotenv';
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
import Side from "./ProfileSide";
import Modal from './Modal';


dotenv.config();
const mint = process.env.mint
const BLANK = '0x0000000000000000000000000000000000000000';

const Profile = ({creator}:any) => {
    
    const router = useRouter();
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [_profile,setProfile]:any = React.useState('')
    const [_creator,setCreator]:any = React.useState('')
    const[_profileNfTeas,setProfileNFTeas]:any = React.useState([])
    const[_saleNfTeas,setSaleNFTeas]:any = React.useState([])
    const[_loanNfTeas,setLoanNFTeas]:any = React.useState([])
    const[_displayNfTeas,setDisplayNFTeas]:any = React.useState([])
    const[_showProfileNfTeas, setShowProfileNfTeas]:any = React.useState(false)
    const[_showSaleNfTeas, setShowSaleNfTeas]:any = React.useState(false)
    const[_showLoanNfTeas, setShowLoanNfTeas]:any = React.useState(false)
    const[_showDisplayNfTeas, setShowDisplayNfTeas]:any = React.useState(false)
    const[_showRepayModal, setShowRepayModal]:any = React.useState(false)
    const [_showProfile, setShowProfile]:any = useState(false)
    const [isRepayModalOpen, setRepayModalOpen]:any = useState(false)
    const [_loanID, setLoanID]:any = useState(0)
    const [_loanAmount, setLoanAmount]:any = useState(0)
    const [_loanExpire,setLoanExpire]:any = useState(0)
    const [_error, setError]:any = React.useState("")
    const [_loading, setLoading]:any = React.useState(false)
    
    const [_profilePic, setProfilePicture]:any = useState('/assets/images/avatar/1.jpeg')
    const [activeTab, setActiveTab] = useState(1);
    
    useEffect(() => {
      if (connected && account) {
            // console.log(walletProvider.provider)
            setWalletProvider(provider);
            if(creator!=account){
                setCreator(creator)
                handleGetProfile(creator)
            }else{
                setCreator(account)
                handleGetProfile(account)
            
            }
        }
      }, [account, connected]);
      
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
      },[])
      React.useEffect(() => {
        if (_profile!="") {
          // Render the component here
            setShowProfile(true)
            // console.log(_profile)
        }
      }, [_profilePic]);
    
    React.useEffect(() => {
      if(account){
        start()
      }
      }, [_creator, account]);
      
      React.useEffect(() => {
        
        setShowProfileNfTeas(true)
        // console.log(_profileNfTeas)
      }, [_profileNfTeas]);

      React.useEffect(() => {
        
        setShowDisplayNfTeas(true)
        // console.log(_displayNfTeas)
      }, [_displayNfTeas]);
      
      React.useEffect(() => {
        
        setShowLoanNfTeas(true)
        
        // console.log(_loanNfTeas)
      }, [_loanNfTeas]);
      
      React.useEffect(() => {
        if(_loanID>0){
            console.log(_loanNfTeas)
            setShowRepayModal(true)
        }else{
            // console.log(_loanID)
        }
        // console.log(_loanID)
      
      }, [_loanID]);
      const handleError = async (msg:any)=>{
        setError(msg)
      }
    
      const handleHexToString = async (hex:any) => {
        let string = '';
        for (let i = 2; i < hex.length; i += 2) {
          const byte = parseInt(hex.substr(i, 2), 16);
          string += String.fromCharCode(byte);
        }
        return string;
      }
      
      const handleGetProfile = async (_creator:any) => {
        try {
           let data = await axios.get(`/api/getProfile?account=${_creator}`)
           if(data.data){
            data.data.account = _creator
            setProfile(data.data)
            setShowProfile(true)
           }
        } catch (err) {
          console.error(err);
        }
      };
    const start = async () => {
        try {
            setLoading(true)
            let uri = await servURI(mint,1)
            let data_:any = []
            const resp:any = await servMyNFTeas(_creator); 
            if(resp && resp[0]){
                for (let i = 0; i < resp[0].length; ++i) {
                    // console.log(resp[1][i])
                    let bnb:any = parseInt(resp[2][i])/1000000000000000000
                    let tea:any = parseInt(resp[2][i])/1000000000000000000
                    let ipfs_:any = resp[1][i]
                    await axios.get(ipfs_)
                    .then(async(response)=>{
                        // console.log(response)
                        if(!response.data.amount){
                            response.data.amount = 1
                        }
                        response.data.key = i
                        response.data.bnb = bnb
                        response.data.tea= tea
                        response.data.id = resp[0][i]
                        response.data.sellid = 0
                        response.data.seller = BLANK
                        data_.push(response.data)
                    })
                }
            }
            
            setProfileNFTeas(data_)
            setLoading(false)

        }catch (err) {
            console.error(err);
        }
      };
      
      const handleGetSale = async () => {
        try {
          setLoading(true)

            let data_:any = []
            const resp = await servUserSales(_creator);
            
            for (let i = 0; i < resp[0].length; ++i) {
                let ipfs_:any =resp[2][i]
                await axios.get(ipfs_)
                .then(async(response)=>{
                    let saleData:any = await servSale(resp[1][i])
                    // console.log(saleData)
                    response.data.amount = saleData[2][3]
                    response.data.id = resp[0][i]
                    response.data.sellid = resp[1][i]
                    response.data.seller = _creator
                    response.data.key = i
                    data_.push(response.data)
                
                })
            }
            
            setSaleNFTeas(data_)
            setLoading(false)

        }catch (err) {
            console.error(err);
        }
      };
      
      const handleGetDisplay = async () => {
        try {
          setLoading(true)

            let data_:any = []
            const resp = await servMyDisplays(_creator);
            console.log(resp)
            for (let i = 0; i < resp[0].length; ++i) {
                let tea:any = parseInt(resp[1][i])/1000000000
                tea = formatNumber(tea);
                let ipfs_:any =resp[2][i]
                await axios.get(ipfs_)
                .then(async(response)=>{
                    response.data.key = i
                    response.data.tea= tea
                    response.data.id = resp[0][i]
                    data_.push(response.data)
                })
            }
            
            setDisplayNFTeas(data_)
            setLoading(false)

        }catch (err) {
            console.error(err);
        }
      };

      const handleGetLoans = async () => {
        try {
          setLoading(true)

            let data_:any = []
            const resp:any = await servMyLoans(_creator);
            // console.log(resp)
            //get ipfs
            for (let i = 0; i < resp[0].length; ++i) {
                const uri_:any = await servIPFS(resp[0][i])
                let balance:any = await servBalances(resp[1][i])
                let ipfs_:any = uri_
                await axios.get(ipfs_)
                .then(async(response)=>{
                    response.data.key = i
                    response.data.tea= balance.tea/1000000000
                    response.data.bnb= resp[2][0][3]
                    response.data.id = resp[0][i]
                    response.data.loan = parseInt(resp[2][0][2])
                    response.data.maturedate = resp[2][0][1]
                    data_.push(response.data)
                })
            }
            setLoanNFTeas(data_)
            setLoading(false)

        }catch (err) {
            console.error(err);
        }
      };
      const handleOpenRepayModal = async (id:any, amount:any, expire:any) => {
        // alert(value)
        setLoanID(id)
        setLoanAmount(amount)
        setLoanExpire(expire)
        setRepayModalOpen(true)
      }
      
      const handleRepayLoan = async (nftea:any) => {
        try {
            let pass = 0;
            let operator = process.env.teaPot
            let resp_:any =await servTokenAllowance(account, operator)
                if(resp_<_loanAmount){
                    resp_ =await servApproveToken(account,_loanAmount,operator)
                    if(resp_.status){                    
                        handleError('token approved')
                        pass = 1
                    }
                }else{
                    pass = 1
                }
                if(pass>0){
                    let resp:any = await servRepayLoan(account,nftea);
                    console.log(resp)
        
                }
        }catch(err){
        
        }
    }
      
      const handleShow = async(value:any) => {
        if(value==1){
            
            setShowProfileNfTeas(true)
            setShowSaleNfTeas(false)
            setShowDisplayNfTeas(false)
            setShowLoanNfTeas(false)
        
        }
        if(value==2){
            
            handleGetSale()
            setShowSaleNfTeas(true)
            setShowProfileNfTeas(false)
            setShowDisplayNfTeas(false)
            setShowLoanNfTeas(false)
        
        }
        if(value==3){
            
            handleGetDisplay()
            setShowSaleNfTeas(false)
            setShowProfileNfTeas(false)
            setShowDisplayNfTeas(true)
            setShowLoanNfTeas(false)
        
        }
        if(value==4){
            
            handleGetLoans()
            setShowSaleNfTeas(false)
            setShowProfileNfTeas(false)
            setShowDisplayNfTeas(false)
            setShowLoanNfTeas(true)
        
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
    return (
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
              <Side   profile={_profile} />
              <div className="cs-profile_right">
              <div className="cs-height_30 cs-height_lg_30"></div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                <div className="cs-tabs cs-fade_tabs cs-style1">
                  <div className="cs-medium">
                  <ul className="cs-tab_links cs-style1 cs-medium cs-primary_color cs-mp0 cs-primary_font">
                    <li className="active" style={{fontFamily: 'Comfortaa'}}><a href="#nfteas" onClick={() => handleShow(1)}>My NFTeas</a></li>
                    <li className="" style={{fontFamily: 'Comfortaa'}}><a href="#forsale" onClick={() => handleShow(2)}>For Sale</a></li>
                    <li className="" style={{fontFamily: 'Comfortaa'}}><a href="#display" onClick={() => handleShow(3)}>On Display</a></li>
                    <li className="" style={{fontFamily: 'Comfortaa'}}><a href="#loans" onClick={() => handleShow(4)}>Loans</a></li>
                  </ul>
                  </div>
                  <div className="cs-height_20 cs-height_lg_20"></div>
                  <div className="cs-tab_content">
                    <div id="nfteas" className="cs-tab active">
                    {_showProfileNfTeas && _profileNfTeas.length<1 && !_loading && (
                      <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                        account has not minted
                      </div>
                    )}
                    {_showProfileNfTeas && _profileNfTeas.length<1 && _loading && (
                      <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                        loading nfteas....
                      </div>
                    )}
                    </div>
                    
                    {_showProfileNfTeas && (
                      <>
                      <div className="row">
                      {_profileNfTeas.map((item:any) => (
                        <>
                       <div className="col-xl-3 col-lg-4 col-sm-6 mb-3" key={item.key}>
                        <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                          <span className="cs-card_like cs-primary_color">
                            <i className="fas fa-heart fa-fw"></i>
                            0
                          </span>
                          <a href={`/view/${item.id}/${item.sellid}/${item.seller}`} className="cs-card_thumb cs-zoom_effect">
                                <Image
                                src={item.image}
                                alt="Image"
                                className="cs-zoom_item"
                                width='200'
                                height='200'
                                // onLoad={handleImageLoad}
                              />
                          </a>
                          <div className="cs-card_button">
                              <a href={`/view/${item.id}/${item.sellid}/${item.seller}`} className="cs-btn cs-style1 cs-btn_lg w-100">
                                <span>View</span>
                              </a>
                            </div>
                          <div className="cs-card_info">
                          <a href="#" className="cs-avatar cs-white_bg">
                          <Image
                                src="/img/avatar_12.png"
                                alt="Image"
                                className="cs-zoom_item"
                                width='200'
                                height='200'
                                // onLoad={handleImageLoad}
                            />

                            
                            <span>{`${_creator.substring(0, 6)}...${_creator.substring(_creator.length - 6)}`}</span>
                            </a>
                            <h3 className="cs-card_title text-center"><a href={`/view/${item.id}/${item.sellid}/${item.seller}`}>{item.name} #{item.id}</a></h3>
                            <div className="cs-card_price text-center"><b className="cs-primary_color">{item.typeName}</b></div>
                            <hr/>
                            <div className="cs-card_footer">
                              <div className="row">
                              {item.amount==1 && (
                                <>
                                  <div className="col-6 text-center">
                                    <span> {item.bnb} <small> BNB</small></span>
                                  
                                  </div>
                                  <div className="col-6 text-center">
                                    <span> {item.tea} <small> TEA</small></span>
                                  
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
                      </div>
                      </>
                    )}
                    
                    <div id="forsale" className="cs-tab">
                    {_showSaleNfTeas && _saleNfTeas.length<1 && !_loading && (
                      
                      <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                        you have nothing for sale
                      </div>
                    )}
                    {_showSaleNfTeas && _saleNfTeas.length<1 && _loading && (
                      
                      <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                        loading for sale..
                      </div>
                    )}
                    {_showSaleNfTeas && _saleNfTeas.length>0 && (
                    <>                    
                    {_saleNfTeas.map((item:any) => (
                      <>
                      <div className="col-xl-3 col-lg-4 col-sm-6" key={item.key}>
                          <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                          <span className="cs-card_like cs-primary_color">
                              <i className="fas fa-heart fa-fw"></i>
                              0
                          </span>
                          <a href={`/view/${item.id}/${item.sellid}/${item.seller}`} className="cs-card_thumb cs-zoom_effect">
                                      <Image
                                  src={item.image}
                                  alt="Image"
                                  className="cs-zoom_item"
                                  width='200'
                                  height='200'
                                  // onLoad={handleImageLoad}
                              />
                          </a>
                          <div className="cs-card_button">
                              <a href={`/view/${item.id}/${item.sellid}/${item.seller}`} className="cs-btn cs-style1 cs-btn_lg w-100">
                                <span>View</span>
                              </a>
                            </div>
                          <div className="cs-card_info">
                          <a href="#" className="cs-avatar cs-white_bg">
                          <Image
                                  src={_profile.profilePic}
                                  alt="Image"
                                  className="cs-zoom_item"
                                  width='200'
                                  height='200'
                                  // onLoad={handleImageLoad}
                              />
                              <span>{`${account.substring(0, 6)}...${account.substring(account.length - 6)}`}</span>
                              </a>
                              <h3 className="cs-card_title text-center"><a href={`/view/${item.id}/${item.sellid}/${item.seller}`} >{item.name} #{item.id}</a></h3>
                              <div className="cs-card_price text-center"><b className="cs-primary_color">{item.typeName}</b></div>
                              <hr/>
                              <div className="cs-card_footer">
                              <div className="row">
                              <div className="col-12">
                                  <table className="text-center mb-0 pb-0">
                                      <tbody><tr><td>0 BNB</td><td>{item.tea || 0} TEA</td></tr></tbody>
                                  </table>
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
                    </div>
                    
                    <div id="display" className="cs-tab">
                    {activeTab==3 && _displayNfTeas.length<1 && !_loading && (
                      
                      <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                        you have nothing on display
                      </div>
                    )}
                    {activeTab==3 && _displayNfTeas.length<1 && _loading && (
                      
                      <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                        loading displays
                      </div>
                    )}
                    {activeTab==3 && _displayNfTeas.length>0 && (
                      <>
                        {_displayNfTeas.map((item:any) => (
                          <>
                          <div className="col-xl-3 col-lg-4 col-sm-6" key={item.key}>
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
                              <div className="cs-card_button">
                              <a href={`/view/${item.id}/0/${BLANK}`}  className="cs-btn cs-style1 cs-btn_lg w-100">
                                <span>View</span>
                              </a>
                            </div>
                              <div className="cs-card_info">
                              <a href="#" className="cs-avatar cs-white_bg">
                              <Image
                                      src={_profile.profilePic}
                                      alt="Image"
                                      className="cs-zoom_item"
                                      width='200'
                                      height='200'
                                      // onLoad={handleImageLoad}
                                  />
                                  <span>{`${account.substring(0, 6)}...${account.substring(account.length - 6)}`}</span>
                                  </a>
                                  <h3 className="cs-card_title text-center"><a href={`/view/${item.id}/0/${BLANK}`}>{item.name} #{item.id}</a></h3>
                                  <div className="cs-card_price text-center"><b className="cs-primary_color">{item.typeName}</b></div>
                                  <hr/>
                                  <div className="cs-card_footer">
                                  <div className="row">
                                  <div className="col-12">
                                      <table className="text-center mb-0 pb-0">
                                          <tbody><tr><td>0 BNB</td><td>{item.tea || 0} TEA</td></tr></tbody>
                                      </table>
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
                    </div>

                    <div id="loans" className="cs-tab">
                    {activeTab==4 && _loanNfTeas.length<1 && !_loading && (
                      
                      <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                        you have no loans out
                      </div>
                    )}
                    {activeTab==4 && _loanNfTeas.length<1 && _loading && (
                      
                      <div className="cs-white_bg cs-box_shadow cs-general_box_5 text-center">
                        loading loans
                      </div>
                    )}
                    {activeTab==4 && _loanNfTeas.length>0 && (
                      <>
                      {_loanNfTeas.map((item:any) => (
                          <>
                          <div className="col-xl-3 col-lg-4 col-sm-6" key={item.key}>
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
                              <div className="cs-card_button">
                              <a href={`/view/${item.id}/0/${BLANK}`}  className="cs-btn cs-style1 cs-btn_lg w-100">
                                <span>View</span>
                              </a>
                            </div>
                              <div className="cs-card_info">
                              <a href="#" className="cs-avatar cs-white_bg">
                              <Image
                                      src={_profile.profilePic}
                                      alt="Image"
                                      className="cs-zoom_item"
                                      width='200'
                                      height='200'
                                      // onLoad={handleImageLoad}
                                  />
                                  <span>{`${account.substring(0, 6)}...${account.substring(account.length - 6)}`}</span>
                                  </a>
                                  <h3 className="cs-card_title text-center"><a href={`/view/${item.id}/0/${BLANK}`}>{item.name} #{item.id}</a></h3>
                                  <div className="cs-card_price text-center"><b className="cs-primary_color">{item.typeName}</b></div>
                                  <hr/>
                                  <div className="cs-card_footer">
                                  <div className="row">
                                    <div className="col-12">
                                    <button type="button"  onClick={() => handleOpenRepayModal(item.id, item.loan, item.maturedate)} className="cs-btn cs-style1 cs-btn_lg w-100"><span>Repay</span></button>

                                        {/* <table className="text-center mb-0 pb-0">
                                            <tbody><tr><td>0 BNB</td><td>{item.tea || 0} TEA</td></tr></tbody>
                                        </table> */}
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
                    </div>

                  </div>
                </div>
              </div>
            </div>
          
          </div>
        </>
    )

}
export default Profile;