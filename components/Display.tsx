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

dotenv.config();
const BLANK:any = '0x0000000000000000000000000000000000000000';
const teaToken = process.env.teaToken;
const shopLogic = process.env.shopLogic;
const teaPot = process.env.teaPot;
const mintLogic = process.env.mintLogic;

const Display = ({ nftea, sellid, seller, isConnected, url, type }:any) => {
    const router:any = useRouter()
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [_operators, setops]:any = useState([])
    const [_operator, setOperatorSettings]:any = useState([])
    const [_media, setMedia]:any = React.useState(null)
    const [_mediaAdd, setAddMedia]:any = React.useState(null)
    const [_mediaUpload, setAddUpload]:any = React.useState(false)
    // const [_mediaActive, setMediaActive]:any = React.useState(null)
    const [_mediaTracks, setMediaTracks]:any = React.useState([])
    const [_sale, setSale]:any = React.useState(router.query["s"])
    const [_unsale, setUnSell]:any = React.useState(false)
    const [_nftea, setNfTea]:any = React.useState(router.query["n"])
    const [_seller, setSeller]:any = React.useState(router.query["u"])
    let [_display, setDisplay]:any = React.useState([])
    const [_showDisplay, setShowDisplay]:any = React.useState(false)
    const [_profile, setProfile]:any = useState([])
    const [_routers, setRoutes ]:any = React.useState([]);
    const [isSellModalOpen, setSellModalOpen] = useState(false);
    const [isCollateralModalOpen, setCollateralModalOpen] = useState(false);
    const [isDisplayModalOpen, setDisplayModalOpen] = useState(false);
    const [isDisplayOffModalOpen, setDisplayOffModalOpen] = useState(false);
    const [isTradeModalOpen, setTradeModalOpen] = useState(false);
    const [isTransferModalOpen, setTransferModalOpen] = useState(false);
    const [isBagModalOpen, setBagModalOpen] = useState(false);
    const [isMediaModalOpen, setMediaModalOpen] = useState(false);
    const [isLoveModalOpen, setLoveModalOpen] = useState(false);
    const [isBuyModalOpen, setBuyModalOpen] = useState(false);
    const [isUnWrapModalOpen, setUnWrapModalOpen] = useState(false);
    const [isEditLinkedToModalOpen, setEditLinkedToModalOpen] = useState(false);
    const [_trade, setTrade]:any = React.useState(0)
    const[_labelStats, setLabelStats]:any = React.useState([])
    const [_showMedia, setShowMedia]:any = React.useState(true);
    const [_showTracks, setShowTracks]:any = React.useState(true);
    const [_showBag, setShowBag]:any = React.useState(true);
    const [_showLabelStats, setShowLabelStats]:any = React.useState(false);
    const [_error, setError]:any = React.useState("")
    const [_errorModalOpen, setErrorModal]:any = React.useState(false)
    const [_uploading, setUploading]:any = React.useState(false)
    const [_showUploading, setShowUploading]:any = React.useState(false)
    const [activeTab, setActiveTab]:any = useState();
    const [_teaPot, setTeaPot]:any = React.useState(false)
    const [_mediaActive, setMediaActive] = React.useState<string | null>(null);
    
    const projectId = "2HjsI8oUMBvpRZQrpMAt4xfc8JR";
    const projectSecret = "b1ae3d41e6c91d02503de73814b9907a";
    const authorization = "Basic " + btoa(projectId + ":" + projectSecret);
    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
            authorization
        }
    })

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
    
    const openModal = async (type_:any) => {
        if(type_==1){

            setTradeModalOpen(false)
            setSellModalOpen(true);
        }
        if(type_==2){
            setDisplayModalOpen(true);
        }
        if(type_==3){
            setTradeModalOpen(true);
        }
        if(type_==4){
            setTradeModalOpen(false);
            setCollateralModalOpen(true) 
        }  
        if(type_==5){
            setTransferModalOpen(true);
        } 
        if(type_==6){
            setBagModalOpen(true);
        }  
        if(type_==7){
            setMediaModalOpen(true);
        } 
        if(type_==8){
            setLoveModalOpen(true);
        }
        if(type_==9){
            setBuyModalOpen(true);
        }  
        if(type_==10){
            let balances_:any = await servBalances(account)
            const number = new BigNumber(balances_.teapot);
            let formattedNumber = number.dividedBy(1000000000).toFixed(9);   
            const formattedString = parseFloat(formattedNumber).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 9
            });            
            setTeaPot(formattedString)
            setLoveModalOpen(true);
        }  
        if(type_==11){
            setUnWrapModalOpen(true);
        } 
        if(type_==12){
            setEditLinkedToModalOpen(true);
        } 
        if(type_==13){
            setDisplayOffModalOpen(true);
        }
    };
  
    const closeModal = (type_:any) => {
        if(type_==1){
            setSellModalOpen(false);

        }
        if(type_==2){
            setDisplayModalOpen(false);
        } 
        if(type_==3){
            setTradeModalOpen(false);
        }  
        if(type_==4){
            setCollateralModalOpen(false)
            
        } 
        if(type_==5){
            setTransferModalOpen(false)
            
        }    
        if(type_==6){
            setBagModalOpen(false);
        }
        if(type_==7){
            setMediaModalOpen(false);
        } 
        if(type_==8){
            setLoveModalOpen(false);
        }
        if(type_==9){
            setBuyModalOpen(false);
        } 
        if(type_==10){
            setLoveModalOpen(false);
        } 
        if(type_==11){
            setUnWrapModalOpen(false);
        } 
        if(type_==12){
            setEditLinkedToModalOpen(false);
        } 
        if(type_==13){
            setDisplayOffModalOpen(false);
        } 

    };
    React.useEffect(()=>{
        setShowMedia(true)
    }, [_mediaActive])
    React.useEffect(() => {
        if(_error!=""){
         setErrorModal(true)
        }else{
            setErrorModal(false)
        }
    }, [_error]);

    React.useEffect(() => {
        if(_mediaAdd!=""){
            
            setAddUpload(true)

        }else{

            setAddUpload(false)

        }
    }, [_mediaAdd]);
    React.useEffect(() => {
        if(_labelStats.length>0){

            setShowLabelStats(true);

        }
    }, [_labelStats]);

    const handleError = async (msg:any)=>{
        setError(msg)
      }
      const closeErrorModal = async () => {
        setErrorModal(false);
        setError("")
 
    };
    const handleMedia = (type_:any) => {
        setActiveTab(type_);
        if(type_==1){
            setShowTracks(false);
            // setShowLabelStats(false);
            setShowBag(true);
        
        }
        if(type_==2){
            setShowTracks(true);
            // setShowLabelStats(true);
            setShowBag(false);

            handleLabelInfo()
        } 
        if(type_==3){
            setShowMedia(false);
            // setShowLabelStats(false);
            setShowBag(true);
        }    
    };
    useEffect(() => {
        if (connected && account) {
            // console.log(walletProvider.provider)
            setWalletProvider(provider);
            if(nftea>0){
                
                setNfTea(nftea)
                setSale(sellid)
                setSeller(seller)
                if(nftea>0){
                    handleStart(nftea,sellid,seller, account)
                
                }
            }
        }
      }, [account, connected]);
    // useEffect(() => {
    //     if(nftea>0){
    //         let user_ = localStorage.getItem("account")
    //         setAccount(user_);
            
    //         setNfTea(nftea)
    //         setSale(sellid)
    //         setSeller(seller)
    //         if(nftea>0 && isConnected){
    //             handleStart(nftea,sellid,seller, user_)
    //             // console.log(user_)
            
    //         }
    //     }
    // }, []);

    useEffect(() => {
        if(_display.id>0){
            setShowDisplay(true)
            handleLabelInfo()
            // console.log(_display)
        }
    }, [_display]);


    async function handleStart(nftea_:any,sale_:any,seller_:any, user_:any){

        let forsale_:any = []
        let othersforsale_:any = []
        let _content:any = []
        let _transfer= "yes"
        let resp_:any = await servBag(nftea_, user_)
        // console.log(resp_)
        let holders_ = await servHolders(nftea_)
        // console.log(resp_)
        let ipfs_:any = resp_[0]
        axios.get(ipfs_)
        .then(async(resp)=>{
            // console.log(resp.data)
            if(resp.data){
                if(resp_[2][4]<1){
                    _transfer = "no"
                }
                let _nftData:any = await handleNFT(nftea_)
                // console.log(_nftData)
                // console.log(_nftData[0].settings[3])
                _content.nftea = _nftData
                _content.holders = holders_
                _content.id = nftea_
                _content.holding = resp_[2][2]
                _content.brewdate = resp_[2][3]
                _content.transferable = _transfer
                _content.ondisplay = resp_[3]
                _content.name = resp.data.name
                _content.image = resp.data.image
                _content.creator = _nftData[0].addresses[0]
                _content.media = resp.data.media
                _content.attributes = resp.data.attributes
                _content.description = resp.data.description
                resp.data.amount = _nftData[0].settings[6]
                if(resp.data.amount==1 && _nftData[0].settings[3]!=11){
                    _content.bag = resp_[1]
                    _content.amount = parseInt(resp.data.amount)

                }else if(resp.data.amount>1 && _nftData[0].settings[3]==11){
                    _content.bag = resp_[1]
                    _content.amount = 1
                
                }else if(resp.data.amount==1 && _nftData[0].settings[3]==11){
                    _content.bag = resp_[1]
                    _content.amount = parseInt(resp.data.amount)
                }else{
                    _content.bag = BLANK
                    _content.amount = parseInt(resp.data.amount)

                }
                _content.nfteatype=resp.data.nfteaType
                _content.bnb = parseInt(resp_[2][0])
                if(resp_[1]==BLANK){
                    _content.bnb = 0
                }
                _content.tea = parseInt(resp_[2][1])
                _content.type = resp.data.type
                _content.typeName = resp.data.typeName
                _content.tagName = resp.data.tagName
                _content.licenseterm = resp.data.licenseTerm
                _content.labelterm = resp.data.labelTerm
                _content.linkedto = resp.data.linkedTo
                _content.wrappedto = _nftData[0].settings[10]

                if(seller_!=BLANK && !_unsale){

                    forsale_ = await servSale(sellid)
                    const number = new BigNumber(forsale_[2][1]);
                    let formattedNumber = number.dividedBy(1000000000).toFixed(9);   
                    const formattedString = formattedNumber.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
                    _content.sellprice = formattedString
                    _content.sell = forsale_
                    _content.sellSettings = forsale_.settings
                    _content.sellAddresses = forsale_.addresses

                }else{

                    _content.sell = []
                    _content.sellSettings = []
                    _content.sellAddresses = []
                
                }
                console.log(_content)
                let L:any = _content.nftea[0][2][0]
                if(L<1 && forsale_.length> 0 && _seller!=BLANK){
                   L = forsale_[2][6]
                }

                let labell_ = await servNFT2Label(L)
                if(labell_ !=""){
                    _content.label = labell_
                
                }else{
                    _content.label = 'N/A'
                }
                _content.othersell = othersforsale_
                let displayEarnings = await servDisplayEarnings(nftea_)
                _content.displayEarnings = displayEarnings
                // console.log(_content)
                setDisplay(_content)
                if (resp.data.media != null) {
                    // Check if _content.media is a valid URL string
                    if (typeof _content.media === 'string' && _content.media.trim().length > 0) {
                      setMediaActive(_content.media);
                    }
                  }
                // if(resp.data.media!=null){
                //    setMediaActive(_content.media)
                // }
                if(_content.nftea[1].length>0){
                    getMedia(nftea);
                }
                // if(_content[0][2][3]==11){
                
                //     _content.amount = 1
                // }
            }
        })
        setActiveTab(1)

    }

    async function handleLabelInfo(){
        let labelstats:any;
        let stats = []
        if(sellid>0){
            
            labelstats = await servLabelStats(_display.sell[2][6],account)
        
        }else{

            if(_display.linkedto>0){
                labelstats = await servLabelStats(_display.linkedto,account)
            }else{
                // alert(nftea)
                labelstats = await servLabelStats(nftea,account)

            }

        }
        // console.log(labelstats)
        let walletBalance:any = new BigNumber(labelstats[0][0]);
        walletBalance = walletBalance.dividedBy(1000000000).toFixed(9);   
        walletBalance = walletBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
        stats[0] = walletBalance || 0

        let royalteasPaid:any = new BigNumber(labelstats[0][1]);
        royalteasPaid = royalteasPaid.dividedBy(1000000000).toFixed(9);   
        royalteasPaid = royalteasPaid.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
        stats[1] = royalteasPaid || 0

        let royalteasCollected:any = new BigNumber(labelstats[0][2]);
        royalteasCollected = royalteasCollected.dividedBy(1000000000).toFixed(9);   
        royalteasCollected = royalteasCollected.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
        stats[2] = royalteasCollected || 0

        let buyerRoyalteas:any = new BigNumber(labelstats[0][3]);
        buyerRoyalteas = buyerRoyalteas.dividedBy(1000000000).toFixed(9);   
        buyerRoyalteas = buyerRoyalteas.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
        stats[3] = buyerRoyalteas || 0

        let volume:any = new BigNumber(labelstats[0][5]);
        volume = volume.dividedBy(1000000000).toFixed(9);   
        volume = volume.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
        stats[5] = volume || 0

        stats[4] = labelstats[0][4]
        setLabelStats(stats)
        // console.log(labelstats)

    
    }
    async function handleShopApprove(type:any){
        let operator = shopLogic
        if(type==1){
            operator = mintLogic
        }
        let approved = await servSellApproveCheck(account,operator)
        // console.log(approved)
        if(!approved){
            setSellModalOpen(false)

            handleError('please approve the shop to sell your nftea')
            let resp_ = await servApproveNFT(account,operator)
            if(resp_.status){
                approved = true
            }
        }
        return approved;
    }

    async function handleTransfer(event:any){
        event.preventDefault();
        let to_:any = event.target.to.value
        let supply_:any = event.target.supply.value
        let resp_ = await servTransfer(account,to_,_nftea,supply_)
        if(resp_.status){
            handleError('NfTea transfered')
            setTransferModalOpen(false)
        }
       
    }

    async function handleSell(event:any){
        event.preventDefault();
        //1 approve shop to handle nftea's
        let approved = await handleShopApprove(0)
        if(event.target.labelToOperate.value>0 && event.target.marketLicense.value>0){
            handleError("use marketplace license or label operator, you can't use both")
            approved = false;
            setSellModalOpen(false)
        }
        if(approved){

            let marketplace:any = 0;
            let okay_ = false;
            
            ///seller has marketplace license
            let marketLicense_:any = event.target.marketLicense.value
            if(!marketLicense_){
                marketLicense_ = 0
            }

            if(marketLicense_>0){
                //check license
                // console.log(_display.nftea[0].settings[0])
                let hasLicense = await servNFTbalance(account, marketLicense_)
                if(_display.nftea[0].settings[0]>0 && hasLicense<1){
                    marketLicense_ = _display.nftea[0].settings[0];
                    marketplace = _display.nftea[0].settings[0]
                    okay_ = true;
                
                }else if(hasLicense<1){

                    handleError('you do not own this license')
                    setSellModalOpen(false)
                
                }else{
                    ///user has license to sell in this market place
                    if(marketLicense_==_display.nftea[0].settings[0]){
                        marketplace = marketLicense_
                        okay_ = true;

                    }else{
                        let data_ = await servNFT(marketLicense_)
                        console.log(data_)
                        marketplace = data_[0][2][0]
                        okay_ = true;
    
                    }
                            
                }
            }

            ///seller has operator licnese
            let labelToOperate:any = event.target.labelToOperate.value
            if(!labelToOperate){
                labelToOperate = 0
            }
            if(labelToOperate>0){
                //check operator license
                let canOperate = await servOperator(account,labelToOperate)
                if(canOperate[2]>0){
                    marketplace = labelToOperate
                    okay_ = true
                    //to do check operator license not expired
                    //check operator label not expired
                    //check label not expired
                }else{
                    handleError('you are not an operator for this label')
                    setSellModalOpen(false)

                }
            }
            ///seller is selling in a market they bought the nfte from
            if(marketLicense_==0 && labelToOperate==0){
                //get last market the user bought this nft from
                let resp_:any = await servLastMarket(account,_nftea)
                if(resp_[1]>0){
                    marketplace = resp_[1]
                    okay_ = true          
                }else{
                    setSellModalOpen(false)
                    handleError('must sell to a marketplace or your own label')
                    okay_ = false
 
                }
            }
            ///seller is selling in the open market

            //sell
            let price_:any = event.target.price.value
            let priceType_:any = 1
            let supply_:any = event.target.supply.value
  
            let settings:any = []
            settings.push(parseInt(_nftea)); //0
            settings.push(0);//1 price
            settings.push(parseInt(priceType_)); //2 price type
            settings.push(parseInt(supply_)); //3 quantity
            settings.push(parseInt(marketLicense_)); //4 marketplacelicense
            settings.push(0);//5 label license royaltea %
            settings.push(parseInt(marketplace));///6 marketplace
            settings.push(0);///7 opid
            settings.push(parseInt(_display.type));/// 8 nftea type
            settings.push(0);/// 9 fees
            settings.push(0);/// 10 sale expire
        
            console.log(settings)
            
            let addresses:any = []
            addresses.push(account); //0 seller
            addresses.push(BLANK); //1 buyer
            addresses.push(teaToken); //2 paytoken
            addresses.push(BLANK); //3 labelwallet
            addresses.push(account); //4 sellerprofilewallet
            addresses.push(BLANK); //5 labelowner
            // console.log(addresses)
            if(supply_>_display.amount && okay_) {
                handleError('you do not own that many nftea\'s')
                okay_ = false;        
            }
            if(okay_){
                
                let response_:any = await servSell(account,settings, price_, addresses)       
                if(response_.status){
                    
                    setSellModalOpen(false)
                    handleError('nftea listed')
                    // console.log(response_)
                    // router.push('/view/'+_nftea+'/0/0x0000000000000000000000000000000000000000');
                }
            }
        
        }
        
    }

    async function handleUnSell(){

    let response = await servUnsell(sellid,account)
    if(response.status){
        router.push('/view/'+_nftea+'/0/0x0000000000000000000000000000000000000000');
        handleStart(_nftea,0,BLANK,account)
    }
    }
    async function handleBuy(event:any){
        event.preventDefault()
        let quantity_ = event.target.quantity.value
        if(!quantity_){
            quantity_ = 1
        }
        let value = (_display.sellSettings[1]*quantity_);
        
        // console.log(value)
        let pass = 0;
        let operator = process.env.shopLogic
        let resp_:any =await servTokenAllowance(account,operator)
            if(resp_<value){
                let operator = process.env.shopLogic
                resp_ =await servApproveToken(account,value/1000000000,operator)
                if(resp_.status){                    
                    handleError('token approved')
                    pass = 1
                }
            }else{
                pass = 1
            }
            if(pass>0){
                resp_ = await servBuy(account,sellid,nftea,quantity_)
                if(resp_.status){           
                    setBuyModalOpen(false)         
                    handleError('item purchased')
                    pass = 1
                }
                console.log(resp_)
    
            }

    }
    async function handleNFT(nftea_:any){
        
        let resp_ = await servNFT(nftea_)
        return resp_;
    
    }
    async function handleDisplay(event:any){
        event.preventDefault()
        let mplicense = event.target.license.value
        let label = event.target.label.value
        let frontpage = event.target.frontpage.value
        
        if(mplicense>0 && label>0){
            handleError('use either marketplace license or label operator license not both')
            setDisplayModalOpen(false)
        
        }else if(mplicense==0 && label==0){
            handleError('display to a marketplace or label you own')
            setDisplayModalOpen(false)

        }else{

            let show = true;  
            let pass = 0;  
            if(_display.ondisplay){
                show = false
            }
            if(frontpage>0){
                let operator = process.env.shopLogic
                let resp_:any =await servTokenAllowance(account, operator)
                if(resp_<1000000000000000000){
                    resp_ =await servApproveToken(account,1000000000000000000,operator)
                    if(resp_.status){                    
                        handleError('token approved')
                        pass = 1
                    }
                }else{
                    pass = 1
                }
            }else{
                pass = 1
            }
            if(pass>0){
                
                console.log(label,nftea, mplicense,frontpage)
                let resp_ = await servDisplay(account,label,nftea, mplicense,frontpage)
                if(resp_.status){
                    let data_ = {
                        nftea,
                        show
                      }
                      const JSONdata = JSON.stringify(data_)
                      const endpoint = '/api/setDisplay'
                      const options = {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSONdata,
                      }
                      const response = await fetch(endpoint, options)
                      const result = await response.json()
                      setDisplayModalOpen(false)
                      handleError('display updated')
        
                }
            }
        
        }
    
    }

    const handleDisplayRemove = async ()=> {
        let resp_ = await servDisplayRemove(account,nftea)
        if(resp_.status){
            handleError('display removed')
            setDisplayModalOpen(false)
        
        }
    
    }

    const handleUnWrap = async ()=> {
       
        let approved = await handleShopApprove(1)
        if(approved){
            let resp_ = await servUnWrap(account,nftea)
            if(resp_.status){
                handleError('nftea unwrapped')
            
            }
        }
 
    
    }


    async function handleLoan(nftea_:any){
        let resp_ = await servBag(nftea,account);
        if(resp_[2][0]==0 && resp_[2][1]==0){
            setCollateralModalOpen(false)
            handleError('zero balances in nftea wallet')
        }else if(resp_[2][0] > resp_[2][1]){
            setCollateralModalOpen(false)
            handleError('getting loan for bnb tokens')
   
        }else if(resp_[2][0] < resp_[2][1]){
            setCollateralModalOpen(false)
            handleError('getting loan for tea tokens')
        
        }

    }

    async function getMedia(nftea_:any){

        let album_:any = []
        let resp = await servMediaAttributes(nftea_)
        // console.log(resp)
        if(resp[0].length>0){
            for (let i = 0; i < resp[0].length; i++) {
                let track = {
                    key:i,
                    url:resp[0][i],
                    title:resp[1][i]
                }
                album_.push(track)
            }
            // console.log(album_)
            setMediaTracks(album_)
            setShowMedia(true)
        }

    }

    const handlePlayMedia = async(media:any)=>{
        // _display.media = media
        setMediaActive(media)
        setShowMedia(true)
    }
    
    const handleMediaUpload = async (event:any)=> {
        event.preventDefault()
        const toFile = event.target.files[0];

        if (toFile.type.startsWith('image')) {
            // console.log(ipfs_)
            handleError('media files only')

        } else {
            
            setUploading(true)
            setShowUploading(true)
            let ipfs_:any =  await ipfs.add(toFile);

            ipfs_ = 'https://nftea.infura-ipfs.io/ipfs/' + ipfs_.path
            setAddMedia(ipfs_)
            handleError('media uploaded')
            setUploading(false)
            setShowUploading(false)
            
        }

    }

    const handleAddMedia = async(event:any)=> {
        event.preventDefault();
        let title_:any = event.target.title.value
        
        // console.log(title_, _mediaAdd)

        if(title_==""){

            handleError('whats the title?')

        }else if(_mediaAdd){
            let nfteas_:any = [];
            let medias_:any = [];
            let titles_:any = [];
            let resp_:any = await servMediaAdd(account,nftea,_mediaAdd,title_,nfteas_,medias_,titles_)
            if(resp_.status){
                setMediaModalOpen(false)
                handleError('media added')
            }
        }
    }
    
    const handleShowLove = async()=>{
        if(_teaPot>0){
            //get nft holder
            let holder:any = await servHolders(nftea)
            // console.log(holder)
            let resp:any = await servLove(account,nftea,holder[0])
            if(resp.status){
                handleError('love shown')
                setLoveModalOpen(false)
            
            }
        
        }else{
            handleError('teapot is low')
            closeModal(10)

        }
      
      }
      const handleEditLinkedTo = async(event:any)=> {
        event.preventDefault();
        let linkTo_:any = event.target.linkTo.value
        if(linkTo_>0){
            
            let resp:any = await servEditLinkedTo(account,nftea,linkTo_)
            if(resp.status){
                handleError('NfTea updated')
                closeModal(12)
            
            }
        
        }else{
            handleError('what nftea are you linking this one to?')
            closeModal(12)

        }
      
      }
      
      const handleTab = async (value_:any) => {
        if(value_==1){
            
            setActiveTab(1)
        }
        if(value_==2){

            setActiveTab(2)
        }
        if(value_==3){

            setActiveTab(3)
        }
        if(value_==4){
            
            setActiveTab(4)
        }
        if(value_==5){
            
            setActiveTab(5)
        }
        if(value_==6){
            
            setActiveTab(6)
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
        {_showDisplay && (
            <>
            <div className="cs-height_90 cs-height_lg_80"></div>
            <section className="cs-page_head cs-bg" style={{backgroundImage: "url(/img/page_head_bg.svg)"}}>
                <div className="container">
                    <div className="text-center">
                        <h1 className="cs-page_title" style={{fontFamily: 'Comfortaa'}}>Art Display</h1>
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item" style={{fontFamily: 'Comfortaa'}}><Link href="/">Home</Link></li>
                        <li className="breadcrumb-item active" style={{fontFamily: 'Comfortaa'}}>Display</li>
                        </ol>
                    </div>
                </div>
            </section>
            <div className="cs-height_100 cs-height_lg_70"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div style={{width: '100%', display: 'inline-block'}}>
                            <div className='cs-slider_thumb_lg'>
                                <img
                                src={_display.image}
                                alt="Image"
                                className="cs-zoom_item"
                                width='600'
                                height='600'
                            
                            />
                        
                            </div>
                        </div>
                        <div className="cs-height_25 cs-height_lg_25"></div>

                        <div style={{width: '100%', display: 'inline-block'}}>
                        <div className="cs-tabs cs-fade_tabs cs-style1">
                            <div className="cs-medium">
                                <ul className="cs-tab_links cs-style1 cs-medium cs-primary_color cs-mp0 cs-primary_font">
                                <li className="active" style={{fontFamily: 'Comfortaa'}}><Link href="#details" onClick={() => handleTab(3)}>Details</Link></li>
                                <li style={{fontFamily: 'Comfortaa'}}><Link href="#media" onClick={() => handleTab(4)}>Media</Link></li>
                                <li style={{fontFamily: 'Comfortaa'}}><Link href="#bag" onClick={() => handleTab(5)}>Vault</Link></li>
                                <li style={{fontFamily: 'Comfortaa'}}><Link href="#stats" onClick={() => handleTab(6)}>Label Stats</Link></li>
                                </ul>
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            <div className="cs-tab_content">
                            <div id="details" className="cs-tab active">
                                    <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                                    <div className="mt-4" style={{fontFamily: 'Comfortaa'}}>
                                        <span className="font-medium text-slate-400 block mb-1">Token ID: </span>
                                        <span className="font-medium block">#{_nftea}</span>
                                    </div>
                                    <div className="mt-4" style={{fontFamily: 'Comfortaa'}}>
                                        <span className="font-medium text-slate-400 block mb-1">Supply: </span>
                                        <span className="font-medium block">{_display.amount}</span>
                                    </div>
                                    <div className="mt-4" style={{fontFamily: 'Comfortaa'}}>
                                        <span className="font-medium text-slate-400 block mb-1">Transferable: </span>
                                        <span className="font-medium block">{_display.transferable}</span>
                                    </div>
                                    <div className="mt-4" style={{fontFamily: 'Comfortaa'}}>
                                        <span className="font-medium text-slate-400 block mb-1">Linked To Label: </span>
                                        {_display.nftea[0].settings[0] > 0 && (<span className="font-medium block">#{_display.nftea[0].settings[0]}</span>)}
                                        {_display.nftea[0].settings[0] < 1 && (<span className="font-medium block">not linked {_display.holders[0] == account && (<Link href="#" onClick={() => openModal(12)} >edit</Link>)}</span>)}
                                    </div>
                                    {_display.nftea[0].settings[3]<7 && (
                                    <div className="mt-4" style={{fontFamily: 'Comfortaa'}}>
                                        <span className="font-medium text-slate-400 block mb-1">Label Expires On: </span>
                                        <span className="font-medium block">{moment.unix(_display.nftea[0][2][7]).format("MMMM Do YYYY, h:mm:ss a")}</span>
                                    </div>
                                    )}
                                    <div className="mt-4" style={{fontFamily: 'Comfortaa'}}>
                                        <span className="font-medium text-slate-400 block mb-1">Type: </span>
                                        <span className="font-medium block">{_display.typeName}</span>
                                    </div>
                                    {_display.bag != BLANK && _display.holders[0]!=teaPot && (
                                        <div className="mt-4" style={{fontFamily: 'Comfortaa'}}>
                                            <Link href={`/operators/${_nftea}/${BLANK}`}className="btn rounded-full bg-violet-600 hover:bg-violet-700 border-violet-600 hover:border-violet-700 text-white w-full">Operators</Link>
                                        </div>
                                    )}
                                    {_display.bag != BLANK && _display.holders[0]==teaPot && (
                                        <div className="mt-4 text-center" style={{fontFamily: 'Comfortaa'}}>
                                            <span>loaned to teapot</span>
                                        </div>
                                    )}                               
                                    </div>
                                </div>
                                <div id="media" className="cs-tab">
                                    <div className="cs-white_bg cs-box_shadow cs-general_box_5" style={{fontFamily: 'Comfortaa'}}>
                                        {_showMedia && (
                                            <MediaComponent url={_mediaActive} type="video" />                                
                                        )}     
                                        {!_mediaActive && (
                                            <p className="text-center">no added media</p>
                                        )}                               
                                    </div>
                                    <div className="cs-height_20 cs-height_lg_20"></div>

                                    <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                                        {_mediaTracks.length<1 && (
                                        <p className="text-center" style={{fontFamily: 'Comfortaa'}}>no additional media</p>
                                        )}
                                        {_mediaTracks.length>0 && (
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <tbody className="bg-white divide-y divide-gray-200">
                                            {_mediaTracks.length>0 && (
                                                <>
                                                {_mediaTracks.map((item:any) => (
                                                <tr key={item.key}>
                                                    <td className="px-6 py-4 text-center">{item.title}</td>
                                                    <td className="px-6 py-4 text-center"><Link href="#" onClick={() => handlePlayMedia(item.url)} className="btn btn-sm rounded-full bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white">play</Link> </td>
                                                </tr>   
                                                ))}
                                                </>
                                            )}
                                            </tbody>
                                            </table> 
                                        )}
                                    </div>
                                </div>
                                <div id="bag" className="cs-tab">
                                    <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                                    {_showBag && (
                                        <>
                                        <div className="row">
                                            <div className="col-6">
                                                <p className="text-center" style={{fontFamily: 'Comfortaa'}}> BNB<br/> {_display.bnb/1000000000000000000}</p>
                                            </div>
                                            <div className="col-6">
                                            {_display.bag!=BLANK && (
                                                <p className="text-center" style={{fontFamily: 'Comfortaa'}}>XTHOS<br/>{formatNumber(_display.tea/1000000000)} </p> )}
                                            
                                            {_display.bag==BLANK && (
                                                <p className="text-center" style={{fontFamily: 'Comfortaa'}}>0 XTHOS </p> )}
                                            
                                            </div>
                                        </div>
                                        <div style={{width: '100%', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                                        <div className="cs-height_20 cs-height_lg_20"></div>
                                        
                                        <div className="row">
                                            <div className="col-6">
                                                <p className="text-center" style={{fontFamily: 'Comfortaa'}}>vault<br/>
                                                {_display.bag!=BLANK && (
                                                    <Link href={`https://testnet.bscscan.com/address/${_display.bag}`} className="font-medium text-violet-600 underline block">{`${_display.bag.substring(0, 6)}...${_display.bag.substring(_display.bag.length - 6)}`}</Link>
                                                    
                                                    )}
                                                    {_display.bag==BLANK && (
                                                    <>
                                                        <span>limited edition, no bag</span>
                                                    </>
                                                    
                                                    )}
                                                </p>
                                            </div>
                                            <div className="col-6">
                                                <p className="text-center">brew date<br/>
                                                    {_display.brewdate !=0 && (
                                                    <>
                                                        <span>{moment.unix(_display.brewdate).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                                    </>
                                                    )}
                                                    {_display.brewdate ==0 && ( 
                                                        <>
                                                        <span>wallet not locked</span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        </>
                                    )}                                    
                                    </div>
                                </div>
                                <div id="stats" className="cs-tab">
                                    <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                                    {_showLabelStats && (
                                    <table className="min-w-full divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                    
                                                    <th className="px-6 py-3 bg-gray-50 text-center">Royaltea Balance</th>
                                                    <th className="px-6 py-3 bg-gray-50 text-center">Royalteas Paid</th>
                                                    <th className="px-6 py-3 bg-gray-50 text-center">Your Royalteas</th>
                                                    
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    <tr>
                                                    
                                                    <td className="px-6 py-4 text-center">{_labelStats[0]}</td>
                                                    <td className="px-6 py-4 text-center">{_labelStats[1]}</td>
                                                    <td className="px-6 py-4 text-center">{_labelStats[3]}</td>
                                                    
                                                    </tr>
                                                </tbody>
                                                <thead>
                                                    <tr>
                                                    
                                                    <th className="px-6 py-3 bg-gray-50 text-center">Royalteas Collected</th>
                                                    <th className="px-6 py-3 bg-gray-50 text-center">Buyers</th>
                                                    <th className="px-6 py-3 bg-gray-50 text-center">Volume</th>
                                                    
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    <tr>
                                                    
                                                    <td className="px-6 py-4 text-center">{_labelStats[2]}</td>
                                                    <td className="px-6 py-4 text-center">{_labelStats[4] || 0}</td>
                                                    <td className="px-6 py-4 text-center">{_labelStats[5] || 0}</td>
                                                    
                                                    </tr>
                                                </tbody>
                                            </table>  
                                    )}
                                    </div>
                                </div>

                            </div>
                        </div>

                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="cs-height_0 cs-height_lg_40"></div>  
                        <div className="cs-single_product_head">
                            <h2 style={{fontFamily: 'Comfortaa'}}>{_display.name} #{_display.id}</h2>
                            { _display.nftea[2]!="" && (
                                <p style={{fontFamily: 'Comfortaa'}}>Label: <Link href="/" className="text-violet-600">{_display.nftea[2]}</Link></p>
                            )}
                            {_display.nftea[2]=="" && (
                                <p style={{fontFamily: 'Comfortaa'}}>Label: N/A</p>
                            )}
                            {sellid>0 && (<span className="font-medium text-slate-400 block mt-2 whiteText">Market: {_display.label}</span>)}
                            {sellid < 1 && (<span className="font-medium text-slate-400 block mt-2 whiteText">you own: {_display.holding}/{_display.amount} {_display.wrappedto>0 && ( <small>(wrapped to: #{_display.wrappedto})</small>)}</span>)}
                            {sellid > 0 && _display.sell && (<span className="font-medium text-slate-400 block mt-2 whiteText">Quantity: {_display.sell[2][3]}</span>)}
                            <span className="cs-card_like cs-primary_color cs-box_shadow">
                            <i className="fas fa-heart fa-fw"></i> 
                            0 
                            </span>
                        </div> 
                        <div className="cs-height_25 cs-height_lg_25"></div>
                        <div className="row">
                            <div className="col-xl-6">
                                <div className="cs-author_card cs-white_bg cs-box_shadow">
                                <div className="cs-author_img">
                                    {/* <img src="../assets/img/avatar/avatar_1.png" alt="" data-pagespeed-url-hash="344795896" onload="pagespeed.CriticalImages.checkImageForCriticality(this);"> */}
                                    
                                    </div>
                                <div className="cs-author_right">
                                <h3 style={{fontFamily: 'Comfortaa'}}>Owner</h3>
                                {_display.holders[0] != teaPot && (
                                    <p><Link href={`/profile/${_display.holders[0]}`}>{`${_display.holders[0].substring(0, 6)}...${_display.holders[0].substring(_display.holders[0].length - 6)}`}</Link></p>
                                )}
                                {_display.holders[0] == teaPot && (
                                    <p style={{fontFamily: 'Comfortaa'}}>Teapot</p>
                                )}
                                </div>
                                </div>
                                <div className="cs-height_25 cs-height_lg_25"></div>
                            </div>
                            <div className="col-xl-6">
                                <div className="cs-author_card cs-white_bg cs-box_shadow">
                                <div className="cs-author_img">
                                    {/* <img src="../assets/img/avatar/avatar_1.png" alt="" data-pagespeed-url-hash="344795896" onload="pagespeed.CriticalImages.checkImageForCriticality(this);"> */}
                                    
                                    </div>
                                <div className="cs-author_right">
                                <h3 style={{fontFamily: 'Comfortaa'}}>Creator</h3>
                                <p style={{fontFamily: 'Comfortaa'}}>{`${_display.creator.substring(0, 6)}...${_display.creator.substring(_display.creator.length - 6)}`}</p>
                                </div>
                                </div>
                                <div className="cs-height_25 cs-height_lg_25"></div>
                            </div>
                        </div>
                        <div className="cs-tabs cs-fade_tabs cs-style1">
                            <div className="cs-medium">
                                <ul className="cs-tab_links cs-style1 cs-medium cs-primary_color cs-mp0 cs-primary_font">
                                <li className="active" style={{fontFamily: 'Comfortaa'}}><Link href="#story" onClick={() => handleTab(1)}>Story</Link></li>
                                <li style={{fontFamily: 'Comfortaa'}}><Link href="#attributes" onClick={() => handleTab(2)}>Attributes</Link></li>
                                </ul>
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            <div className="cs-tab_content">
                                <div id="story" className="cs-tab active">
                                    <div className="cs-white_bg cs-box_shadow cs-general_box_5" style={{fontFamily: 'Comfortaa'}}>
                                        <DisplayDescription
                                        description={_display.description}
                                        initialExpanded={_display.description.length <= 500}
                                        />                                    
                                    </div>
                                </div>
                                <div id="attributes" className="cs-tab">
                                    <div className="cs-white_bg cs-box_shadow cs-general_box_5" style={{fontFamily: 'Comfortaa'}}>
                                    no attributes
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cs-height_25 cs-height_lg_25"></div>
                        <div className="row">
                            <div className="col-6">
                                {_display.sell.length>0 && (
                                    <p className="text-center">price<br/> {_display.sellprice || 0} XTHOS</p>
                                )}
                                {_display.sell.length<1 && (
                                    <p className="text-center">price<br/> 0 XTHOS</p>
                                )}
                            </div>
                            <div className="col-6">
                                    <p className="text-center">display earnings<br/> {_display.displayEarnings/1000000000} XTHOS</p>
                            </div>
                        </div>
                        <div className="cs-height_25 cs-height_lg_25"></div>
                        
                        <div className="row">
                            {_display.holding>0 && (
                                <>        
                                        {!_display.ondisplay && sellid < 1 && (
                                        <div className="col-lg-4">
                                         <Link href="#" onClick={() => openModal(3)}  className="cs-btn cs-style1 cs-btn_lg w-100 text-center"><i className="mdi mdi-swap-horizontal"></i> Trade</Link>

                                        </div>)}

                                        {!_display.ondisplay && !_display.sell.active && sellid<1 && _display.amount==1 && (
                                        <div className="col-lg-4">
                                        <Link href="#" onClick={() => openModal(2)}  className="cs-btn cs-style1 cs-btn_lg w-100 text-center"><i className="mdi mdi-spotlight"></i> Display</Link>
                                        
                                        </div>)}
                                        {!_display.ondisplay && sellid < 1 && (
                                        <div className="col-lg-4">
                                            <Link href="#" onClick={() => openModal(5)}  className="cs-btn cs-style1 cs-btn_lg w-100 text-center"><i className="mdi mdi-send"></i> Send</Link>
                                        
                                        </div>)}
                                

                                        {!_display.ondisplay && sellid < 1 && _display.holding>0 && _display.wrappedto>0 && (
                                        <div className="col-lg-4">
                                        
                                        <Link href="#" onClick={() => openModal(11)}  className="cs-btn cs-style1 cs-btn_lg w-100 text-center"><i className="mdi mdi-refresh"></i> UnWrap</Link>
                                        </div>
                                        )}
                                        {_display.ondisplay && (
                                        <div className="col-lg-4">
                                        
                                        <Link href="#" onClick={() => openModal(13)}  className="cs-btn cs-style1 cs-btn_lg w-100 text-center"><i className="mdi mdi-spotlight"></i> Remove Display</Link>
                                        </div>
                                        )}
                                    {/* {sellid>0 && (
                                        <>
                                        {_display.sell[3][0] == account && _display.sell.active && ( <Link href="#" onClick={() => handleUnSell()}  className="btn rounded-full bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-white ml-1"><i className="mdi mdi-close-outline"></i> End Sale</Link>)}
                                        </>
                                    )} */}
                                </>
                            )}
                            {_display.holding <1 && (
                                <div className="col-12">
                                    {!_display.ondisplay && sellid <1 && ( <p className="text-center"><i className="mdi mdi-swap-horizontal"></i> Not On Display or Sale</p>)}
                                    {_display.ondisplay && (<Link href="#" onClick={() => openModal(10)}  className="cs-btn cs-style1 cs-btn_lg w-100 text-center"><i className="mdi mdi-spotlight"></i> Show Love</Link>)}
                                </div>
                            )}
                            {seller==account && (
                                <div className="col-12">
                                {_display.sell[3][0] == account && _display.sell.active && ( <Link href="#" onClick={() => handleUnSell()}  className="cs-btn cs-style1 cs-btn_lg w-100 text-center"><i className="mdi mdi-close-outline"></i> End Sale</Link>)}
                                </div>
                            )}
                        </div>
                        <div className="row">
                        <div className="col-12">
                            {sellid>0 && (
                                <div className="">
                                    {_display.sell[3][0] != account && (<Link href="#" onClick={() => openModal(9)}  className="cs-btn cs-style1 cs-btn_lg w-100 text-center"><i className="mdi mdi-tag-faces"></i> Buy Item</Link>)}
                                
                                </div>
                            )}
                            </div>
                        </div>
                        

                    
                    </div>
                </div>
            </div>

            {_errorModalOpen && (
                <>
                    <Modal onClose={closeErrorModal} title="Error!">
                        <div className="p-4 text-center" style={{borderRadius: '10px', backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%237B61FFFF' stroke-width='3' stroke-dasharray='5%2c 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")` }}>
                            <div className="text-center">
                                <h3 className="font-semibold text-center"> {_error}</h3>
                            </div>
                        </div>
                    </Modal>
                </>
            )}
            {isSellModalOpen && (
                <>
                    <Modal onClose={() => closeModal(1)}  title="Sell Item">
                        <form onSubmit={handleSell}>         
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Asking Price</label>
                            <div className="cs-form_field_wrap">
                                <input name="price" id="price" type="number" className="cs-form_field" placeholder="10000" required />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Supply</label>
                            <div className="cs-form_field_wrap">
                                <input name="supply" id="supply" type="number" className="cs-form_field" placeholder="1" required />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Marketplace License</label>
                            <div className="cs-form_field_wrap">
                                <input name="marketLicense" id="marketLicense" type="number" className="cs-form_field" placeholder="10" />
                            </div>
                            <p className="text-center">Are you using a marketplace license? Enter the marketplace license you are sellign this under. Enter 0 if needed</p>
                            
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            <label className="cs-form_label">Label</label>
                            <div className="cs-form_field_wrap">
                                <input name="labelToOperate" id="labelToOperate" type="number" className="cs-form_field" placeholder="1" />
                            </div>
                            <p className="text-center">Are you a label operator? Enter the label marketplace to sell this under? Enter 0 if needed</p>
                                                        
                            <div className="cs-height_20 cs-height_lg_20"></div>

                            <div className="pt-4 border-t dark:border-t-gray-800 text-center">
                            <div className="flex justify-between text-center">
                                <p className="font-semibold text-sm"> For now fixed price sells only:</p>
                            </div>
                            <div className="flex justify-between mt-1">
                                <p className="font-semibold text-sm"> Item will be listed for sale for 90 days:</p>
                            </div>
                            <div className="flex justify-between mt-1">
                                <p className="font-semibold text-sm"> Service Fee:</p>
                                <p className="text-sm text-violet-600 font-semibold"> 3% </p>
                            </div>
                        </div>
                        <div className="cs-height_20 cs-height_lg_20"></div>

                            <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Sell</span></button>
                        </form>
                    </Modal>
                </>
            )}
            {isDisplayModalOpen && (
                <>
                    <Modal onClose={() => closeModal(2)}  title="Display Item">
                        <form onSubmit={handleDisplay}>         
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Marketplace License</label>
                                <div className="cs-form_field_wrap">
                                    <input name="license" id="license"  type="number" className="cs-form_field" placeholder="10" required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Label</label>
                                <div className="cs-form_field_wrap">
                                    <input name="label" id="label" type="number" className="cs-form_field" placeholder="0" />
                                    <input name="nftea" id="nftea" type="hidden" className="cs-form_field" value={_display.id} />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Frontpage Display?</label>
                                <div className="cs-form_field_wrap">
                                    <select name="frontpage" id="frontpage" className="cs-form_field">
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>                            
                                </div>
                                <p className="text-center">Display on home page?</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Display</span></button>
                            </form>
                    </Modal>
                </>
            )}
                        {isDisplayOffModalOpen && (
                <>
                    <Modal onClose={() => closeModal(13)}  title="Remove Display">
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <p className="text-center">Remove this xFt from display.</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <div className="mt-4">
                                    <Link href="#" onClick={() => handleDisplayRemove()} className="cs-btn cs-style1 cs-btn_lg w-100"><i className="mdi mdi-star-circle"></i> Remove</Link>
                                
                                </div>                    
                        </Modal>
                </>
            )}
            {isTradeModalOpen && (
                <>
                     <Modal onClose={() => closeModal(3)}  title="Trade Your NFT">
                                
                                <p className="text-center">sell or collateralize your nft. Your collateral value is based on the amount of BNB or NFTea tokens locked in your NFT.</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <div className="pt-4 border-t dark:border-t-gray-800 text-center">
                                    <div className="mb-2">
                                        <p className="font-semibold text-sm text-center"> <Link href="#" onClick={() => openModal(1)}   className="btn rounded-full bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white w-full"><i className="mdi mdi-tag-plus"></i> Sell</Link></p>
                                        <p className="font-semibold text-sm text-center pt-3"> <Link href="#" onClick={() => openModal(4)}    className="btn rounded-full bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white w-full"><i className="mdi mdi-basket-fill"></i> Collateralize</Link></p>
                                    </div>
                                </div>                    
                        </Modal>               
                </>
            )}

            {isUnWrapModalOpen && (
                <>
                     <Modal onClose={() => closeModal(11)}  title="Unwrap">
                                
                                <p className="text-center">Unwrap this nftea and get the original nft back in your wallet. <br/><b>be sure to empty the wallet of this nft before unwrapping</b></p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <div className="pt-4 border-t dark:border-t-gray-800 text-center">
                                    <div className="mb-2">
                                        <p className="font-semibold text-sm text-center"> <Link href="#" onClick={() => handleUnWrap()}   className="btn rounded-full bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white w-full"><i className="mdi mdi-tag-plus"></i> UnWrap</Link></p>
                                    </div>
                                </div>                    
                        </Modal>               
                </>
            )}
            
            {isEditLinkedToModalOpen && (
                <>
                    <Modal onClose={() => closeModal(12)}  title="Update Link To Label">
                        <form onSubmit={handleEditLinkedTo}>         
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Linked To</label>
                                <div className="cs-form_field_wrap">
                                    <input name="linkTo" id="linkTo"   type="number" className="cs-form_field" placeholder="10" required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <p className="text-center">To update what NFTea this one is linked to, you must be the minter of this NFTea and the one you want to link it to</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Update</span></button>
                            </form>
                    </Modal>
                </>
            )}
            {isTransferModalOpen && (
                <>
                    <Modal onClose={() => closeModal(5)}  title="Transfer NFT">
                        <form onSubmit={handleTransfer}>         
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">To</label>
                                <div className="cs-form_field_wrap">
                                    <input name="to" id="to"  type="text" className="cs-form_field" placeholder="0x..." required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Supply</label>
                                <div className="cs-form_field_wrap">
                                    <input name="supply" id="supply"  type="number" className="cs-form_field" placeholder="1" required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <p className="text-center">Some NFTea&apos;s have limited transfer rights<br/>check to be sure this is transferable</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Send</span></button>
                            </form>
                    </Modal>
                </>
            )}
        {isCollateralModalOpen && (
                <>
                    <Modal onClose={() => closeModal(4)}  title="Get A Loan">
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <p className="text-center">Get a 0% interest loan for your NFTea from the Tea Pot. The loan amount is based on the bnb or nftea tokens locked in your wallet.<br/><br/> Get upto 85% of the value of your tokens on loan for 30 days. <br/><br/>If the loan is not repaid within 30 days, you or other members can buy your NFTea from the Tea Pot. 5% service fee applies.</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <Link href={`/loans/${_display.id}`}className="cs-btn cs-style1 cs-btn_lg w-100"><span>Get A Loan</span></Link>
                    </Modal>
                </>
            )}
        {isBagModalOpen && (
                <>
                    <Modal onClose={() => closeModal(6)}  title="Bag">
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <p className="text-center">Lock the bag of this nftea for a period of time, or withdraw assets from bag</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <div className="mt-4">
                                    {_display.bag != BLANK && (<Link href="#" onClick={() => handleDisplay(_display.id)}   className="cs-btn cs-style1 cs-btn_lg w-100"><i className="mdi mdi-spotlight"></i> Lock Bag</Link>)}
                                    {_display.bag != BLANK && (<Link href="#" onClick={() => handleDisplay(_display.id)}   className="cs-btn cs-style1 cs-btn_lg w-100"><i className="mdi mdi-spotlight"></i> Withdraw From Bag</Link>)}
                                
                                </div>                    
                        </Modal>
                </>
            )}
            
            {isMediaModalOpen && (
                <>
                    <Modal onClose={() => closeModal(7)}  title="Add Media">
                        <form onSubmit={handleAddMedia}>         
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Title</label>
                                <div className="cs-form_field_wrap">
                                    <input name="title" id="title"  type="text" className="cs-form_field" placeholder="song name" required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Upload Media</label>
                                <div className="cs-form_field_wrap">
                                    <input type="file" id="input-file3" name="input-file3" accept="audio/*, video/*"  onChange={handleMediaUpload} hidden />
                                    <label className="btn-upload btn bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white rounded-full w-full mt-6 cursor-pointer" onClick={(e) => {e.preventDefault(); document.getElementById('input-file3')?.click()}}>Upload Media</label>
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                {_showUploading && (
                                <p className="text-center">uploading...</p>
                                )}
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Add Media</span></button>
                            </form>
                    </Modal>
                </>
            )}
            {isLoveModalOpen && (
                <>
                    <Modal onClose={() => closeModal(10)}  title="Show Love">
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <p className="text-center">Show Love to awesome art works.<br/>When you show love a sip is taken from the teapot and added to the wallet of this nftea.</p>
                                <p className="text-center">Teapot: {_teaPot}</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <div className="mt-4">
                                    <Link href="#" onClick={() => handleShowLove()} className="cs-btn cs-style1 cs-btn_lg w-100"><i className="mdi mdi-star-circle"></i> Show Love</Link>
                                
                                </div>                    
                        </Modal>
                </>
            )}
            {isBuyModalOpen && (
                <>
                    <Modal onClose={() => closeModal(9)}  title="Transfer NFT">
                        <form onSubmit={handleBuy}>         
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Quantity</label>
                                <div className="cs-form_field_wrap">
                                    <input name="quantity" id="quantity"  type="number" className="cs-form_field" placeholder="0x..." required />
                                </div>                                                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Buy</span></button>
                            </form>
                    </Modal>
                </>
            )}
            </>
        )}
      </>
      )
}
export default Display;