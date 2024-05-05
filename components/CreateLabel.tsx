import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import {create as ipfsHttpClient}  from "ipfs-http-client";
import { UltimateTextToImage, ICanvas} from "ultimate-text-to-image";
import moment from 'moment';
import axios from "axios";
import { BigNumber } from 'bignumber.js';
import { setWalletProvider, servActivate,servActivatePrice,servPrice,servMint,servOperator,servLabel,servFlames,servNFT2Label, servNFT,servBag,servContract2Label,servWrap,servURI,servApproveWrapper,servWrapApproveCheck,servRenew, servApproveToken,servCheckOperator } from '../services/web3Service';
import { servSetProfile } from '../services/profile';
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
import Modal from './Modal';

import dotenv from 'dotenv';
dotenv.config();
const BLANK = '0x0000000000000000000000000000000000000000';

interface SearchState {
    [key: number]: any[] | string;
  }
const CreateLabel = () => {
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [_nftImage, setNFTImage]:any = React.useState("")
    const [_nftAttributes, setNFTAttributes]:any = useState({});
    const [_nfteaType, setNfTeaype]:any = React.useState()
    let [_mintData, setMintForm]:any = useState({years:0,supply:0,linkto:0,mintpass:0,mintprice:0,animation_url:0,licenseterm:0,title:null,labelsplit:0,extcontract:null,description:'tell a cool story about why this label is important to you and if licensing is available'})
    const [_label, setLabel]:any = React.useState("")
    let [_labelwallet, setLabelWallet]:any = useState(0)
    const [_profile, setProfile]:any = useState('')
    const [_ipfs, setIPFS]:any = React.useState("")
    const [_error, setError]:any = React.useState("")
    const [_base64Image, setBase64]:any = React.useState("")
    const [_nfteaTypeName, setNfTeaypeName]:any = React.useState("")
    const [_tagTypeName, setTagTypeName]:any = React.useState("")
    const [_media, setMedia]:any = React.useState(null)
    const [_mediaType, setMediaType]:any = React.useState(null)
    let [_canTransfer, setCanTransfer]:any = useState(true)
    const [_userLicense, setUserLicense]:any = useState([0,0,0,0,0,0,0])
    const [_search, setSearch]:any = React.useState<SearchState>({});
    const [_goMint, setGoMint]:any = useState(true)
    const [_tag, setTag]:any = useState('')
    const [_labelprice, setLabelPrice]:any = React.useState([0,0,0,0,0,0])
    const [_labelImage, setLabelImage]:any = React.useState("")
    const [isHovered, setIsHovered] = useState(false);
    const [_renewModalOpen, setRenewModal]:any = React.useState(false)
    const [_showLabelTaken, setShowLabelTaken]:any = useState(false)
    const [_showLabelAvailable, setShowLabelAvailable]:any = useState(false)
    const [_showForm, setShowForm]:any = useState(false)
    const [_showLabelPrice, setShowLabelPrice]:any = React.useState(false)

    let [contractAddress, setContractAddress] = useState('');
    const projectId = "2HjsI8oUMBvpRZQrpMAt4xfc8JR";
    const projectSecret = "b1ae3d41e6c91d02503de73814b9907a";
    const authorization = "Basic " + btoa(projectId + ":" + projectSecret);
    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
            authorization
        }
    })
    // useEffect(() => {
    //     // console.log(user_)
    //     if(connected && account){
    //         setWalletProvider(provider);
    //     }
    
    // }, [account, connected]);
    
    useEffect(()=>{
    
        $('.cs-accordian').children('.cs-accordian-body').hide();
        $('.cs-accordian.active').children('.cs-accordian-body').show();
        $('.cs-accordian_head').on('click', function () {
          $(this)
            .parent('.cs-accordian')
            .siblings()
            .children('.cs-accordian-body')
            .slideUp(250);
          $(this).siblings().slideDown(250);
          /* Accordian Active Class */
          $(this).parents('.cs-accordian').addClass('active');
          $(this).parent('.cs-accordian').siblings().removeClass('active');
        });

    },[_nfteaType])
    
    React.useEffect(() => {
        if (_search && _search[0] && _search[0].nftea=="0") {
            setShowLabelTaken(false)
            setShowLabelAvailable(true)
        
        }
        if (_search && _search[0] && (_search[0].nftea!="0" && moment().isBefore(moment.unix(_search[0][2][7])))) {

            setShowLabelTaken(true)
            setShowLabelAvailable(false)
            
          }
          if (_search && _search[0] && (_search[0].nftea!="0" && moment().isAfter(moment.unix(_search[0][2][7])))) {
            setShowLabelTaken(false)
            setShowLabelAvailable(true)
            
          }
        //   console.log(_search)
      }, [_search]);

    const handleAttributeUpload = (event:any) => {
        const file = event.target.files[0];
        const reader:any = new FileReader();
        reader.onload = () => {
        const data = JSON.parse(reader.result);
        setNFTAttributes(data);
        };
        reader.readAsText(file);
    };

    const handleError = async (msg:any)=>{
        setError(msg)
      }
    const handleMint = async (event:any) => {
        event.preventDefault();
        let term_ = 0
        let split_ = 0
        // let entrysplit_ = 0
        let years_ = 0
        let linkedto;
        // alert(event.target.title.value)
        if(_nfteaType!=1){
            linkedto = event.target.linkto.value || 0
        }
        // if(_nfteaType==7){
        //     entrysplit_ = event.target.entrysplit.value
        // }
        if(_nfteaType==5 || _nfteaType==6){
            term_ = 0
        }
        if(_nfteaType==1){
            split_ = event.target.split.value
        }
        if(_nfteaType>=1 && _nfteaType<=6){
            years_ = event.target.years.value
        }
        let extcontract_ = null;
        if(_nfteaType==1){
            extcontract_ = event.target.extcontract.value
        }else{
            extcontract_ = BLANK
        }
        if(_labelprice==0){
            years_ = 1
        }
        console.log(_labelprice, years_)
        setContractAddress(extcontract_)
        let _mintForm:any = new Object();
        _mintForm.title = event.target.title.value
        _mintForm.linkto = linkedto || 0
        _mintForm.years = years_
        _mintForm.supply = event.target.supply.value
        _mintForm.description = event.target.story.value
        _mintForm.licenseterm =  term_
        _mintForm.labelsplit = split_
        _mintForm.animation_url = null
        _mintForm.labelsplit = split_
        _mintForm.extcontract = extcontract_
        _mintData = _mintForm
        setMintForm(_mintForm)
        let pass = 0;
        if(event.target.linkto.value>0){

            let resp_:any = await servCheckOperator(account,event.target.linkto.value)
            // console.log(resp_)
            if(resp_[5]>0){
                //there is an operator id... verify user owns this operator license
                let resp:any = await servBag(resp_[5],account)
                // console.log(resp)
                if(resp[2][2]>0){
                    //user is holding license
                    resp = await servLabel(event.target.linkto.value,'open');
                    setLabel(resp.label[2])
                    setLabelWallet(resp.label[0].addresses[2])
                    pass = 1
                }else{
                    handleError("you are not an operator, contact label owner")
                    
                    pass = 0
                }
            
            }else{
                handleError("invalid label operator")
            }
            
        }else{

            if(_nfteaType==1 || _nfteaType==2){
                setLabel(_label)
                pass = 1
            
            }else if(_nfteaType==7 || _nfteaType==8 || _nfteaType==11){
                setLabel(_label)
                pass = 1
            
            }else{
                handleError('please enter a label to link to')
            }
        
        }
        if(pass>0){
            if(!_profile.name){
            
            }else{

            }
            handleipfsUpload(event)
        }
      
      }
    
      const handleipfsUpload = async (event:any)=> {
        let _image:any;
        let name:any = _mintData.title
        if(!name){
            name = _label
        }
        if(_nfteaType<=6){
            
            let ipfs_:any = await ipfs.add(_base64Image);
            _image = 'https://nftea.infura-ipfs.io/ipfs/' + ipfs_.path
        
        }else{
            _image = _nftImage
        }
        // console.log(_image)
        if(_image==""){
            
            handleError('please upload an image as your nft')
        
        }else{
            
            const abi =
            {
                path: "metadata.json",
                content: {
                    amount: _mintData.supply,
                    name: name,
                    description: _mintData.description,
                    image: _image,
                    creator: account,
                    external_url: "https://xft.red",
                    type: _nfteaType,
                    typeName:_nfteaTypeName,
                    tagName:_tagTypeName,
                    licenseTerm: _mintData.licenseterm,
                    linkedTo: _mintData.linkto,
                    labelTerm: _mintData.years,
                    attributes: _nftAttributes,
                    media: _media,
                    mediaType: _mediaType,
                    nfteaType:_nfteaType
    
                }
            }
            const result_ = await ipfs.add(JSON.stringify(abi.content));
            let ipfs_ = null
            if (result_) {
    
                setIPFS('https://nftea.infura-ipfs.io/ipfs/' + result_.path)
    
                let expire_ = _mintData.years * 365
                let pass = true;
                if(_mintData.linkto>0){
                    expire_ = moment().add(expire_, 'days').unix();
    
                }else{
    
                    expire_ = 0
                }
                let transfer_ = 0
                if(_canTransfer){
                    transfer_ = 1
                }
                if(!_search[4]){
                    _search[4] = '0'
                }
                if(_nfteaType==1 || _nfteaType==2){
                    transfer_ = 0
                }
                if(_nfteaType==4){
                    transfer_ = 1
                }
                if(_nfteaType>6){
                    transfer_ = 1
                }
                if(_nfteaType==2 && _mintData.supply>1){
    
                    handleError('quantity 1 for profile labels')
                    pass = false;
                }
                if(_nfteaType==1 && _mintData.supply>1){
                    
                    handleError('quantity 1 for lead labels')
                    pass = false;
                }
                if(pass){
                    
                    let settings_:number[] = []
                    settings_.push(parseInt(_mintData.linkto)) //0 link to label
                    settings_.push(parseInt(_mintData.years)) // 1 registration in years
                    settings_.push(parseInt(_userLicense[0])) //2 minter license
                    settings_.push(parseInt(_nfteaType)) //3 nftea type
                    settings_.push(parseInt(_mintData.licenseterm)) //4 if type is license, license term
                    settings_.push(0) //5 0 false, 1 true // formerly mint pass
                    settings_.push(parseInt(_mintData.supply)) //6 quantity
                    settings_.push(0) //7 label registration expire
                    settings_.push(0) //8 unused.. use to be redeem days
                    settings_.push(transfer_) //9 transferable
                    settings_.push(0) // 10 wrapto
                    settings_.push(parseInt(_mintData.labelsplit)) //11 label split for marketplace license
                    settings_.push(0) // 12 open
    
                    let addresses_ = []
                    if(!_labelwallet){
                        _labelwallet = BLANK
                    }
                    if(contractAddress==""){
                        contractAddress = BLANK
                    }
                    addresses_.push(account) // 0 creator
                    addresses_.push(account) // 1 minter
                    addresses_.push(_labelwallet) // 2 wallet
                    addresses_.push(BLANK) //3 label owner
                    addresses_.push(contractAddress) //4 external nft contract address
                        
                    if(_goMint){
                        let strings_ = []
                        strings_.push(_label.toLowerCase())
                        strings_.push('https://nftea.infura-ipfs.io/ipfs/' + result_.path)
                        strings_.push(_tag)
                        // console.log(strings_,addresses_,settings_)
                        let pass = 0;
                        if(_nfteaType>0 && _nfteaType <7 && _labelprice>0){
                            let amount = _labelprice * _mintData.years;
                            let operator = process.env.mintLogic;
                            let resp:any = await servApproveToken(account, amount, operator )
                            if(resp.status){
                                pass = 1;
                            }
                        }else{
                            pass = 1
                        }
                        if(pass>0){
                            let result = await servMint(account,strings_,settings_,addresses_)
                            if(result.status){
                                handleError('congrats, your nft is minting')
                                settings_ = []
                                addresses_ = []
        
                            }
                        }
                    
    
                    }
                    // console.log(result)
                }
            }
        }
      }
      const handleLabelImage = async (label_:any) => {
        
        let LABEL = label_
        label_ = label_.toLowerCase()
        let cantransfer_ = true
        let tagType_ = '-open-'
        if(label_.startsWith('@')){
            tagType_ = 'contact';
            cantransfer_ = false;
            setTag("@")
        
        }else if(label_.startsWith('#')){
            tagType_ = 'social';
            cantransfer_ = false;
            setTag("#")
        
        }
        else if(label_.startsWith('~')){
            tagType_ = 'adult';
            cantransfer_ = false;
            setTag("~")
        
        }
        else if(label_.startsWith('$')){
            tagType_ = 'business';
            cantransfer_ = false;
            setTag("$")

        
        }else if(label_.startsWith('*')){
            tagType_ = 'identity';
            cantransfer_ = false;
            setTag("*")
        
        
        }else if(label_.startsWith('^')){
            tagType_ = 'travel';
            cantransfer_ = false;
            setTag("^")
        
        }else if(label_.startsWith('?')){
            tagType_ = 'class';
            cantransfer_ = false;
            setTag("?")

        
        }else if(label_.startsWith('()')){
            tagType_ = 'female';
            cantransfer_ = false;
            setTag("()")
        
        
        }else if(label_.startsWith('!')){
            tagType_ = 'male';
            cantransfer_ = false;
            setTag("!")
        
        }else if(label_.startsWith('%')){
            tagType_ = 'tea pass';
            cantransfer_ = false;
            setTag("%")
        
        }else if(label_.startsWith('=')){
            tagType_ = 'philosophy';
            cantransfer_ = false;
            setTag("=")
        
        }else if(label_.startsWith('+')){
            tagType_ = 'animation';
            cantransfer_ = false;
            setTag("+")
        
        }else if(label_.startsWith('&')){
            tagType_ = 'tickets/gaming';
            cantransfer_ = true;
            setTag("&")
        
        }else if(label_.startsWith('[')){
            tagType_ = 'operator';
            cantransfer_ = false;
            setTag("[")
        }else{
            setTag("null")
        }
        setCanTransfer(cantransfer_)
          const colors = [
            '#34326E',
            '#68316E',
            '#316E69',
            '#6E3C31',
            '#6E3161',
            '#BF0B99',
            '#D426AF',
            '#8026D4',
            '#9A4FBD',
            '#497B8C',
            '#8B8C49',
            '#2F709E',
            '#2F5A9E',
            '#2A52DE',
            '#2A78DE',
            '#E3204A',
            '#26060D',
            '#1A0207',
            '#1A0106',
            '#038250'
          ];
          const bg = colors[Math.floor(Math.random()*colors.length)];
          let img:any =  new UltimateTextToImage(LABEL,
            {
              width: 900,
              height:900,
              fontFamily: "Poiret One",
              backgroundColor: bg,
              margin:0,
              fontSize: 81,fontColor:'#FFFFFF',align:'center',valign:'middle',
              minFontSize: 12,
              lineHeight: 50,
              autoWrapLineHeightMultiplier: 2.2
            }).render()
            const base64Image = img.toDataUrl('image/jpeg', { quality: 100 }).split(',')[1];
            const imageBuffer = Buffer.from(base64Image, 'base64');
            img  = img.toDataUrl("image/jpeg", {quality: 100})
            setLabelImage(img)
            setBase64(imageBuffer)
            setTagTypeName(tagType_)
            setCanTransfer(cantransfer_)
      }
      const handleLabelSearch = async (event:any) => {
        event.preventDefault();
        
        try {
            
            if(account){
            
                let resp:any = await servLabel(0,event.target.query.value);
                let label = event.target.query.value
                console.log(resp)
                if(resp.label[0].addresses.length>0){
                    let operator_ = await servOperator(account,resp.label[0][0])
                    if(operator_[4]>0){
                        //minter is an operator
                        setUserLicense([operator_[4],resp.label[4]])
                    }else{
                        setUserLicense([0,0])
                    }
                }
                setSearch(resp.label)
                const number = new BigNumber(resp.price);
                let formattedNumber = number.dividedBy(1000000000).toFixed(9);   
                const formattedString = formattedNumber.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
        
                setLabelPrice(formattedString)
                setLabel(label.toLowerCase())
                setNfTeaype(0)
                handleLabelImage(event.target.query.value)
                // console.log(resp)

            }else{
                alert("login 1st")
            }

        } catch (err) {
          console.error(err);
        }
      }
    
      const handleSetType = (id: number) => {
        // console.log(`Setting type for accordion item ${id}`);
        setNfTeaype(id);
        if(id==1){
            setNfTeaypeName('Lead Label')
        }
        if(id==2){
            setNfTeaypeName('Profile')
        }
        if(id==3){
            setNfTeaypeName('Tags')
        }
        if(id==4){
            setNfTeaypeName('Book/Chapters')
        }
        if(id==5){
            setNfTeaypeName('Operator License')
        }
        if(id==6){
            setNfTeaypeName('Marketplace License')
        }
        if(id==7){
            setNfTeaypeName('Tickets/Gaming')
        }
        if(id==8){
            setNfTeaypeName('NfTea')
        }
        if(id==11){
            setNfTeaypeName('Wrapped NfTea')
        }
        if(id==0){
            setShowForm(false)

        }else{
            setShowForm(true)

        }
    };
    

    const openRenewModal = async () => {
        setRenewModal(true); 
    };
    const closeRenewModal = async () => {
        setRenewModal(false); 
    };
      const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };
    
    return(
        <>
          
          <div className="container">
            <div className="row">
                <div className="col-lg-6">
                    <div className="cs-faq">
                        <div className="cs-section_heading cs-style3">
                            <h2 className="cs-section_title">search labels</h2>
                            <div className="cs-section_seperator"></div>
                        </div>
                        <div className="cs-height_30 cs-height_lg_30"></div>   
                        <form className="cs-form_card cs-style1 cs-box_shadow cs-white_bg" onSubmit={handleLabelSearch}>
                            <div className="cs-form_card_in">
                            <div className="cs-height_30 cs-height_lg_30"></div>
                            <div className="cs-form_field_wrap">
                            <input type="text" className="cs-form_field" placeholder="Best Pizze NY, New Orleans NFT, Jazz Music:" name="query" id="query" />
                            </div>
                            
                            <div className="cs-height_15 cs-height_lg_15"></div>
                            <button className="cs-btn cs-style1 cs-btn_lg w-100">
                            <span>Search</span>
                            </button>
                            
                            </div>
                        </form>           
                    </div>

                    {_showLabelTaken && _search[0] && _search[0].addresses[0] && (
                        <>
                        <div className="cs-height_30 cs-height_lg_30"></div>   
                        <div className='cs-form_card cs-style1 cs-box_shadow cs-white_bg'>
                            <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}> <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                >
                                <path d="M18 6L6 18M6 6l12 12" />
                                </svg> label taken</h4>
                            <div style={{fontFamily: 'Comfortaa', padding:'10px'}}>
                                <p className="text-slate-600 dark:text-gray-400 text-center" style={{backgroundColor:'#f8f7f7', padding:'20px'}}><b>owner</b><br/> {`${_search[0].addresses[0].substring(0, 4)}...${_search[0].addresses[0].substring(_search[0].addresses[0].length - 4)}`} </p>
                                <p className="text-slate-600 dark:text-gray-400 text-center" style={{backgroundColor:'#f8f7f7', padding:'20px'}}><b>wallet</b><br/> {`${_search[0].addresses[2].substring(0, 4)}...${_search[0].addresses[2].substring(_search[0].addresses[2].length - 4)}`} </p>
                                <p className="text-slate-600 dark:text-gray-400 text-center" style={{backgroundColor:'#f8f7f7', padding:'20px'}}><b>expires</b><br/> {moment.unix(_search[0].settings[7]).format("MMMM Do YYYY, h:mm:ss a")}</p>
                                {moment() > moment.unix(_search[0].settings[7]) && _search[0].addresses[0] ==account && (
                                    <div className="text-center p-5"> 
                                        <button onClick={() => openRenewModal()} name="send" className="btn bg-violet-600 hover:bg-violet-300 border-violet-400 hover:border-violet-400 text-white rounded-full pt-3">renew</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        </>
                    )}
                
                {_showLabelAvailable && (
                        <>
                        <div className="cs-height_30 cs-height_lg_30"></div>   
                            <div className='cs-form_card cs-style1 cs-box_shadow cs-white_bg'>
                                <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}>
                                <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"  strokeWidth="2"  strokeLinecap="round" strokeLinejoin="round" ><path d="M20 6L9 17l-5-5" /></svg> label is available</h4>
                                <div className="text-center">
                                    <div className="cs-card cs-style4 cs-box_shadow cs-white_bg">
                                        <a href="#" className="cs-card_thumb cs-zoom_effect">
                                            <Image
                                                src={_labelImage}
                                                alt="Image"
                                                className="cs-zoom_item"
                                                width='200'
                                                height='200'
                                                // onLoad={handleImageLoad}
                                            />
                                        </a>
                                    </div>
                                </div>
                                <div style={{width: '100%', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)', marginTop:'23px'}}></div>

                                <p className="text-center" style={{paddingTop:'21px'}}>select the type of label you want to mint</p>
                            </div>
                        
                        </>
                )}
                    <div className="cs-height_30 cs-height_lg_30"></div>
                    <div className='p-10' style={{borderRadius: '10px', backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%237B61FFFF' stroke-width='3' stroke-dasharray='5%2c 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")` }}>
                        <p className="smallText text-center pt-5">** need more variations of your label? don&quot;t worry you can link them to a main label ** </p>
                        <p className="text-center p-3">
                            <span>**</span> <span>labels</span> <span>STA</span>RTING <span>wit</span>h
                            <span> spe</span>c<span>ial</span> <br />
                            <span>are</span> <span>tre</span>ated <span>as</span> <span> non</span>e
                            <span> tra</span>nsferable <span>(or</span> <span>lim</span>ited
                            <span> tran</span>sfers)<br /> <span>this</span> <span>means</span> <span>the</span>
                            <span> buy</span>er <span>will</span> <span>not</span> <span>be</span> <span>able</span>
                            <span> to</span> <span>trans</span>fer <br /><span>except</span> <span>back</span>
                            <span> to</span> <span>the</span> <span>cre</span>ator <span>or</span> <span>to</span>
                            <span> the</span> <span>burn</span> <span>ad</span>dress<br/><br/><span>this</span> <span>is</span>
                            <span>perfect</span> <span>for</span> <span>sub</span>scription <span>ser</span>vices,
                            <span>pro</span>duct <span>au</span>thencity <span>val</span>idation <br />
                            <span>and</span> <span>so</span>cial/<span>onl</span>ine <span>ac</span>cess.<br /><br />
                            * <small>identity/profile</small><br />
                            [ <small>label operator</small><br />
                            # <small>social/lingo/marketplace license </small><br /><small>ie: #onFleek, #acmeshoes etc </small><br />
                            ! <small>male</small><br />
                            @ <small>contract</small> <br /><small>ie: don&quot;t call or email unless you have this label</small><br />
                            $ <small>business</small><br />
                            % <small>n/a</small> <br />
                            ^ <small>travel</small> <br />
                            & <small>Tickets/Gaming </small><br />
                            ? <small>class/lessons</small> <br />
                            () <small>female</small><br />
                            ~ <small>adult</small><br />
                            = <small>philosophy</small><br />
                            + <small>animation</small><br />
                            </p>
                                
                                <style jsx>{`
                                    p:first-letter {
                                        font-weight: bold;
                                    }
                                    `}</style>
                    </div>
                </div>
                <div className="col-lg-6">
                    {!_showForm && (
                    <div className="cs-faq">
                        <div className="cs-section_heading cs-style3">
                            <h2 className="cs-section_title">select label to mint</h2>
                            <div className="cs-section_seperator"></div>
                        </div>
                        <div className="cs-height_30 cs-height_lg_30"></div>
                        <div className="cs-accordians">
                        <div className="cs-accordian active">
                        <div className="cs-accordian_head">
                        <h2 className="cs-accordian_title">Lead Label</h2>
                        <div style={{width: '100px', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                        <span className="cs-accordian_toggle">
                        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.62109 0.750977L6.95443 6.08431L12.2878 0.750977" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        </span>
                        </div>
                        <div className="cs-accordian-body">
                            Your lead label is a 1 of 1 smart nft. Think of it as your collection or album that nfts your mint are linked to. Funds from sales are held in the wallet of your lead label.<br/>
                            {_showLabelAvailable && (
                                <p className="text-center" style={{marginTop:'20px'}}>
                                    <a href="#mint" onClick={() => handleSetType(1)}  className="cs-btn cs-style3  cs-btn_lg w-100" > 
                                    <i className="fa fa-magic" aria-hidden="true"></i>{' '} Mint</a>
                                </p>
                            )}
                        </div>
                        </div>
                        <div className="cs-accordian">
                        <div className="cs-accordian_head">
                        <h2 className="cs-accordian_title">Label Operator License</h2>
                        <div style={{width: '200px', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                        <span className="cs-accordian_toggle">
                        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.62109 0.750977L6.95443 6.08431L12.2878 0.750977" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        </span>
                        </div>
                        <div className="cs-accordian-body" style={{display: 'none'}}>
                        <p>If you have already minted your lead label, you can mint operator licenses for your team members. An operators license allows team members to mint and or sell nfts under your label. Pay your team members from the label wallet.</p>
                        {_showLabelAvailable && (
                        <p className="text-center" style={{marginTop:'20px'}}>
                            <a href="#mint" onClick={() => handleSetType(5)}  className="cs-btn cs-style3  cs-btn_lg w-100" > 
                            <i className="fa fa-magic" aria-hidden="true"></i>{' '} Mint</a>
                            </p>)}
                        </div>
                        </div>
                        <div className="cs-accordian">
                        <div className="cs-accordian_head">
                        <h2 className="cs-accordian_title">Label Marketplace License</h2>
                        <div style={{width: '220px', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                        <span className="cs-accordian_toggle">
                        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.62109 0.750977L6.95443 6.08431L12.2878 0.750977" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        </span>
                        </div>
                        <div className="cs-accordian-body" style={{display: 'none'}}>
                        <p>If you have already minted your lead label, you can mint marketplace licenses, allowing artists and creators to sell their nfts under your label.</p>
                        {_showLabelAvailable && (

                        <p className="text-center" style={{marginTop:'20px'}}>
                            <a href="#mint" onClick={() => handleSetType(6)}  className="cs-btn cs-style3  cs-btn_lg w-100" > 
                            <i className="fa fa-magic" aria-hidden="true"></i>{' '} Mint</a>
                            </p> )}
                        </div>
                        </div>
                        <div className="cs-accordian">
                        <div className="cs-accordian_head">
                        <h2 className="cs-accordian_title">Profile Label</h2>
                        <div style={{width: '110px', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                        <span className="cs-accordian_toggle">
                        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.62109 0.750977L6.95443 6.08431L12.2878 0.750977" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        </span>
                        </div>
                        <div className="cs-accordian-body" style={{display: 'none'}}>
                        <p>Your profile label is a lead label, just for you. For example, create a profile label for your student profile, store all your nft grades under this label.</p>
                        {_showLabelAvailable && (

                        <p className="text-center" style={{marginTop:'20px'}}>
                            <a href="#mint" onClick={() => handleSetType(2)}  className="cs-btn cs-style3  cs-btn_lg w-100" > 
                            <i className="fa fa-magic" aria-hidden="true"></i>{' '} Mint</a>
                            </p>)}
                        </div>
                        </div>
                        <div className="cs-accordian">
                        <div className="cs-accordian_head">
                        <h2 className="cs-accordian_title">Tags Label</h2>
                        <div style={{width: '105px', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                        <span className="cs-accordian_toggle">
                        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.62109 0.750977L6.95443 6.08431L12.2878 0.750977" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        </span>
                        </div>
                        <div className="cs-accordian-body" style={{display: 'none'}}>
                        <p>Tag labels are limited transfer labels. After you send it to the recipient they will not be able to send it to anyone else. This is great if you are a teacher, consultant or general professional. Give your clients your tag label for completing your course or purchasing your product or service.</p>
                        {_showLabelAvailable && (

                        <p className="text-center" style={{marginTop:'20px'}}>
                            <a href="#mint" onClick={() => handleSetType(3)}  className="cs-btn cs-style3  cs-btn_lg w-100" > 
                            <i className="fa fa-magic" aria-hidden="true"></i>{' '} Mint</a>
                            </p>)}
                        </div>
                        </div>
                        
                        <div className="cs-accordian">
                        <div className="cs-accordian_head">
                        <h2 className="cs-accordian_title">Chapters Label</h2>
                        <div style={{width: '130px', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                        <span className="cs-accordian_toggle">
                        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.62109 0.750977L6.95443 6.08431L12.2878 0.750977" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        </span>
                        </div>
                        <div className="cs-accordian-body" style={{display: 'none'}}>
                        <p>Limited Edition prints, that are text based NfTea&quot;s. These are perfect for literature, poems, stories, recipes and more</p>
                        {_showLabelAvailable && (

                        <p className="text-center" style={{marginTop:'20px'}}>
                            <a href="#mint" onClick={() => handleSetType(4)} className="cs-btn cs-style3  cs-btn_lg w-100" > <i className="fa fa-magic" aria-hidden="true"></i>{' '} Mint</a>
                            </p>)}
                        </div>
                        </div>
                        
                        
                        </div>
                    </div>                    
                    )}
                    {_showForm && (
                        <>
                        <div className="cs-section_heading cs-style3" id="mint">
                            <h2 className="cs-section_title">Mint Your Label</h2>
                            <div className="cs-section_seperator"></div>
                        </div>
                        <div className="cs-height_20 cs-height_lg_20"></div>
                        <div className="cs-height_20 cs-height_lg_20"></div>
                        <div className='cs-form_card cs-style1 cs-box_shadow cs-white_bg'>
                        <h3 className='p-2 text-slate-600 dark:text-gray-400 text-center' style={{fontFamily: 'Comfortaa'}}>type: <b>{_nfteaTypeName}</b></h3>
                            {_showLabelPrice && (
                                <p className="text-slate-600 dark:text-gray-400">price: <b>{_labelprice/100000000} Tea</b> a year<br/></p>
                            )}
                        </div>
                        <div className="cs-height_20 cs-height_lg_20"></div>
                        <div className="cs-height_20 cs-height_lg_20"></div>

                        <form className="row" id="label" onSubmit={handleMint}>
                            <label className="cs-form_label">Registration Years</label>
                            <div className="cs-form_field_wrap">
                                <input type="number" className="cs-form_field" placeholder="2" name="years" id="years" />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>

                            <label className="cs-form_label">Title</label>
                            <div className="cs-form_field_wrap">
                                <input type="text" className="cs-form_field" placeholder="nft brooklyn" name="title" id="title" />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>

                            <label className="cs-form_label">Supply</label>
                            <div className="cs-form_field_wrap">
                                <input type="text" className="cs-form_field" placeholder="1" name="supply" id="supply" />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>

                            <label className="cs-form_label">Link To Label #</label>
                            <div className="cs-form_field_wrap">
                                <input type="number" className="cs-form_field" placeholder="0" name="linkto" id="linkto" />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>

                            {_nfteaType==6  && (
                            <>
                            <label className="cs-form_label">Label Marketplace License Term (in months)</label>
                            <div className="cs-form_field_wrap">
                                <input type="number" className="cs-form_field" placeholder="12" name="licenseterm" id="licenseterm" />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>

                            </>
                            )}
                            {_nfteaType==1 && (
                            <>
                            <label className="cs-form_label">Label Royalty % each sale</label>
                            <div className="cs-form_field_wrap">
                                <input type="number" className="cs-form_field" placeholder="10" name="split" id="split" />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>

                            <label className="cs-form_label">NFT Contract Address</label>
                            <div className="cs-form_field_wrap">
                                <input type="text" className="cs-form_field" placeholder="0x..." name="extcontract" id="extcontract" />
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>

                            </>
                            )}
                        
                             <label className="cs-form_label">Story</label>
                            <div className="cs-form_field_wrap">
                                <textarea cols={30} rows={5} placeholder="e. g. label story" className="cs-form_field" name="story" id="story" ></textarea>
                            </div>
                            <div className="cs-height_20 cs-height_lg_20"></div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <button type="submit" className="cs-btn cs-style1 cs-btn_lg"><span>Mint Label</span></button>
                                </div>
                                <div className="col-lg-6 text-right" style={{textAlign:'right'}}>
                                    <button onClick={() => handleSetType(0)} className="cs-btn cs-style1 cs-btn_lg" style={{ color: isHovered ? '#fff' : '#fff', backgroundColor: isHovered ? 'purple' : '#000', borderRadius:'50px' }}><span>Go back</span></button>
                                </div>
                            </div>
                        
                        
                        </form>
                        </>
                    )}
                </div>
            </div>
          </div>
        
        </>
    )
}
export default CreateLabel;