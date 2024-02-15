import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
// import { UltimateTextToImage, ICanvas} from "ultimate-text-to-image";
import {create as ipfsHttpClient}  from "ipfs-http-client";
import moment from 'moment';
import axios from "axios";
import { BigNumber } from 'bignumber.js';
import { setWalletProvider, servActivate,servActivatePrice,servPrice,servMint,servOperator,servLabel,servFlames,servNFT2Label, servNFT,servBag,servContract2Label,servWrap,servURI,servApproveWrapper,servWrapApproveCheck,servRenew, servApproveToken,servCheckOperator } from '../services/web3Service';
// import { getProfile } from '../services/profile';
import { servSetProfile } from '../services/profile';
import loadinggif from '../assets/images/loading1.gif'
// import Accordion from './Accordion';
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
import Side from "./ProfileSide";
import Modal from './Modal';
import CreateNFT from './CreateNFT';
import CreateLabel from './CreateLabel';
import CreateWrap from './CreateWrap';

import dotenv from 'dotenv';
dotenv.config();

const BLANK = '0x0000000000000000000000000000000000000000';

const items = [
    { id: 1, title: 'Lead Label: 1 of 1', content: 'Limited transfers, 1 of 1 ideal as your web3 dating, gaming, student profile', isActive: false },
    { id: 2, title: 'Profile: 1 of 1', content: 'Limited transfers, 1 of 1 ideal as your web3 dating, gaming, student profile', isActive: false },
    { id: 6, title: 'Marketplace License: 1+', content: 'Limited transfers, limited edition prints allowing others to sell under your profile/lead label', isActive: false },
    { id: 5, title: 'Operator License: 1+', content: 'Limited transfers, limited edition prints allowing operators to access label wallet and or mint and sell NfTea\'s on your label\'s behalf', isActive: false },
    { id: 3, title: 'Tags (social, class, training...etc): 1+', content: 'Limited transfers, limited edition prints with social access utility. use as class/training certificates, right to contact vouchers and more', isActive: false },
    { id: 4, title: 'Chapter\'s (books, poems, recipes..etc): 1+', content: 'Limited Edition prints, that are text based NfTea\'s. These are perfect for literature, poems, stories, recipes and more', isActive: false },
    { id: 8, title: 'Art/Tickets/Gaming: 1+', content: 'Mint your art work into an NFTea. 1 of 1\'s get a smart contract wallet', isActive: false },
    { id:11, title: 'Wrap to nftea: 1+', content: 'Wrap an external nft you own into a smart nftea, with a wallet. Unwrap to get your original nft back. Do not you will lose the wallet when you unwrap.', isActive: false },
  
  ];
  
interface SearchState {
    [key: number]: any[] | string;
  }

const Create = () => {
    
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    let [_type, setType]:any = useState(null)
    let [_canTransfer, setCanTransfer]:any = useState(true)
    let [_showCreateProfile, setCreateProfile]:any = useState(false)
    let [_showCreateLabel, setCreateLabel]:any = useState(false)
    let [_showCreateNFT, setCreateNFT]:any = useState(false)
    let [_showCreateWrap, setCreateWrap]:any = useState(false)
    const [_search, setSearch]:any = React.useState<SearchState>({});
    const [_showNFTImage, setShowNFTImage]:any = useState(false)
    const [_nftImage, setNFTImage]:any = React.useState("")
    const [_nftAttributes, setNFTAttributes]:any = useState({});
    const [_showLabelAvailable, setShowLabelAvailable]:any = useState(false)
    const [_showLabelTaken, setShowLabelTaken]:any = useState(false)
    const [_showLabelImage, setShowLabelImage]:any = useState(false)
    const [_label, setLabel]:any = React.useState("")
    const [_labelprice, setLabelPrice]:any = React.useState([0,0,0,0,0,0])
    const [_showLabelPrice, setShowLabelPrice]:any = React.useState(false)
    const [_nfteaType, setNfTeaype]:any = React.useState(0)
    const [_nfteaTypeName, setNfTeaypeName]:any = React.useState("")
    const [_labelImage, setLabelImage]:any = React.useState("")
    const [_base64Image, setBase64]:any = React.useState("")
    let [_labelwallet, setLabelWallet]:any = useState(0)
    const [_tagTypeName, setTagTypeName]:any = React.useState("")
    const [_media, setMedia]:any = React.useState(null)
    const [_mediaType, setMediaType]:any = React.useState(null)
    const [_ipfs, setIPFS]:any = React.useState("")
    const [_error, setError]:any = React.useState("")
    const [_errorModalOpen, setErrorModal]:any = React.useState(false)
    const [_renewModalOpen, setRenewModal]:any = React.useState(false)
    const [_userLicense, setUserLicense]:any = useState([0,0,0,0,0,0,0])
    const [_tag, setTag]:any = useState('')
    const [_profile, setProfile]:any = useState('')
    const [_profilePic, setProfilePicture]:any = useState('/assets/images/avatar/1.jpeg')
    const [_profileFile, setProfileFile]:any = useState('/assets/images/avatar/1.jpeg')
    const [_showProfile, setShowProfile]:any = useState('')
    const [_showProfilePic, setShowProfilePic]:any = useState(false)
    const [_goMint, setGoMint]:any = useState(true)
    let [contractAddress, setContractAddress] = useState('');
    const [_uploading, setUploading]:any = React.useState(false)
    const [_showUploading, setShowUploading]:any = React.useState(false)
    const [_allowMint, setAllowMint]:any = React.useState(false)
    const [activeTab, setActiveTab] = useState(3);
    // const [linkToValue, setLinkToValue] = useState('');
    let [_mintData, setMintForm]:any = useState({years:0,supply:0,linkto:0,mintpass:0,mintprice:0,animation_url:0,licenseterm:0,title:null,labelsplit:0,extcontract:null,description:'tell a cool story about why this label is important to you and if licensing is available'})
    const projectId = "2HjsI8oUMBvpRZQrpMAt4xfc8JR";
    const projectSecret = "b1ae3d41e6c91d02503de73814b9907a";
    const authorization = "Basic " + btoa(projectId + ":" + projectSecret);
    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
            authorization
        }
    })
    
    useEffect(() => {
      if(account && connected){
        setWalletProvider(provider);
        handleGetProfile(account)
      }
      }, [connected,account]);
    
      React.useEffect(() => {
        if (_search && _search[0] && _search[0].nftea=="0") {
          // Render the component here
          setShowLabelAvailable(true)
          setShowLabelTaken(false)
        //   alert("working")
        
        }
        if (_search && _search[0] && (_search[0].nftea!="0" && moment().isBefore(moment.unix(_search[0][2][7])))) {
            // Render the component here
            // alert("working 2")
            
            setShowLabelAvailable(false)
            setShowLabelTaken(true)
            
          }
          if (_search && _search[0] && (_search[0].nftea!="0" && moment().isAfter(moment.unix(_search[0][2][7])))) {
            // Render the component here
            // alert("working 3")
            
            setShowLabelAvailable(true)
            setShowLabelTaken(false)
            
          }
        //   console.log(_search)
      }, [_search]);

      React.useEffect(() => {
        if(_labelImage!=""){
            setShowLabelImage(true)

        }
      }, [_base64Image]);

      React.useEffect(() => {
        if (_nftImage!="") {
          // Render the component here
          setShowNFTImage(true)
        }
      }, [_nftImage]);

      React.useEffect(() => {
        if (_profile!="") {
          // Render the component here
          // console.log(_profile)
          setShowProfile(true)
        }
      }, [_profile]);

      React.useEffect(() => {
        if (_profile!="") {
          // Render the component here
            setShowProfilePic(true)
        }
      }, [_profilePic]);

      React.useEffect(() => {
        if (_profileFile!="") {
          // Render the component here
            setProfileFile(_profileFile)
        }
      }, [_profileFile]);

      React.useEffect(() => {
        if (_label!="") {
          // Render the component here
          setGoMint(true)
            
        }
      }, [_label]);

      React.useEffect(()=>{
        if(_labelprice>0){
            setShowLabelPrice(true)
        }
      }, [_labelprice])

      React.useEffect(()=>{
        setAllowMint(true)
      }, [contractAddress])

      const handleError = async (msg:any)=>{
        setError(msg)
      }
      const closeErrorModal = async () => {
        setErrorModal(false);
        setError("")
 
    };
    const openRenewModal = async () => {
        setRenewModal(true); 
    };
    const closeRenewModal = async () => {
        setRenewModal(false); 
    };
    
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
  };

  const handleActivate = async () => {
      try {
      if(!account){
          //handleGetAccount()
          alert('connect your wallet')
      }else{
          const resp = await servActivate(account);
          const resp2 = await servActivatePrice(account)
          console.log(resp);
        }
      }catch (err) {
          console.error(err);
      }

    };

    const handleFlames = async () => {
      try {
      if(!account){
          //handleGetAccount()
          alert('connect your wallet')

      }else{
          const resp = await servFlames(account);
          // console.log(resp);
        }
      }catch (err) {
          console.error(err);
      }

    };
  

  const handleGetProfile = async (user:any) => {
      try {
         let data = await axios.get(`/api/getProfile?account=${user}`)
         if(data.data){
          data.data.account = user
          setProfile(data.data)
          setShowProfilePic(true)
         }else{
          handleError('to get started, create your artist profile')
          setCreateProfile(true)
          setCreateLabel(false)
         }
      //   console.log(profileData);
      } catch (err) {
        console.error(err);
      }
    };

    const handleLabelSearch = async (event:any) => {
      event.preventDefault();

      try {

          let resp:any = await servLabel(0,event.target.query.value);
          let label = event.target.query.value
          // console.log(resp)
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

      } catch (err) {
        console.error(err);
      }
    }

    async function handleIPFS(toFile:any){
      let result;
      setUploading(true)
      setShowUploading(true)

      if(toFile.type=='image/heic'){

          alert('heic format not allowed')

      }else {

          result = await ipfs.add(toFile);
          setUploading(false)
          setShowUploading(false)

      }

      return result;
  }
    const handleNfteaImage = async (event:any)=> {

      event.preventDefault()
      const toFile = event.target.files[0];
      let ipfs_:any = await handleIPFS(toFile)
      ipfs_ = 'https://nftea.infura-ipfs.io/ipfs/' + ipfs_.path
      // console.log(ipfs_)
      if (toFile.type.startsWith('image')) {
          setNFTImage(ipfs_)
      } else {
          setMedia(ipfs_)
          setMediaType(toFile.type)
          handleError('media uploaded')
      }
      setNfTeaype(8)
      setNfTeaypeName('NfTea')
  }

  const handleAttributeUpload = (event:any) => {
      const file = event.target.files[0];
      const reader:any = new FileReader();
      reader.onload = () => {
      const data = JSON.parse(reader.result);
      setNFTAttributes(data);
      };
      reader.readAsText(file);
  };

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
      console.log("uploading..")
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

    const handleSetWrapContract = () => {
      const newContractAddress:any = process.env.mint; // Set the desired value here
      setContractAddress(newContractAddress);
    };
    const handleSetLabelContract = (event:any) => {
      setContractAddress(event.target.value);
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
                      handleError("wrap completed")
                      settings_ = []
                      addresses_ = []

                  }
      
          }else{
              alert('no pass')
          }
    }

    async function handleRenew(event:any){
      event.preventDefault();

      let result = await servRenew(account,event.target.years.value,_search[2])
      if(result.status){
          handleError('congrats, your nft is minting')
      }
    
    }

  async function handleShowCreate(value_ :any) {
    
      if(value_==1){
          setCreateProfile(false)
          setCreateLabel(true)
          setCreateNFT(false)
          setCreateWrap(false)

      }else if(value_==2){
          setCreateProfile(false)
          setCreateLabel(false)
          setCreateNFT(true)
          setCreateWrap(false)

      }else if(value_==3){
          setCreateProfile(false)
          setCreateLabel(false)
          setCreateNFT(false)
          setCreateWrap(true)

      }else if(value_==4){
          setCreateProfile(false)
          setCreateLabel(false)
          setCreateNFT(false)
          setCreateWrap(true)
      }
      setActiveTab(value_);
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
              <Side profile={_profile} />
              <div className="cs-profile_right">
                <div className="cs-height_30 cs-height_lg_30"></div>
                <h2 className="cs-section_heading cs-style1">Create</h2>
                <div className="cs-height_25 cs-height_lg_25"></div>
                <div className="row">
                  <div className="col-xl-4 col-sm-6">
                    <div className="cs-iconbox cs-style3 cs-box_shadow cs-white_bg">
                      <div className="cs-iconbox_img">
                      <h4>Label</h4>
                      <div className="cs-iconbox_text">Create a label or label license for brand, nft collection or nft curation.</div>
                        <a href="#label" className="cs-iconbox_btn cs-primary_font" onClick={() => handleShowCreate(1)}>
                        Mint
                        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5303 6.75396C16.8232 6.46107 16.8232 5.9862 16.5303 5.6933L11.7574 0.920332C11.4645 0.627439 10.9896 0.627439 10.6967 0.920332C10.4038 1.21323 10.4038 1.6881 10.6967 1.98099L14.9393 6.22363L10.6967 10.4663C10.4038 10.7592 10.4038 11.234 10.6967 11.5269C10.9896 11.8198 11.4645 11.8198 11.7574 11.5269L16.5303 6.75396ZM0 6.97363H16V5.47363H0V6.97363Z" fill="currentColor"></path>
                        </svg>
                        </a>
                      </div>
                    <div className="cs-height_30 cs-height_lg_30"></div>
                  </div>
                  </div>
                  <div className="col-xl-4 col-sm-6">
                    <div className="cs-iconbox cs-style3 cs-box_shadow cs-white_bg">
                      <div className="cs-iconbox_img">
                      <h4>NFT</h4>
                      <div className="cs-iconbox_text">Create limited edition prints (smart nft's) or music, blog nfts. Link your nft to your label.</div>
                        <a href="#nft" className="cs-iconbox_btn cs-primary_font" onClick={() => handleShowCreate(2)}>
                        Mint
                        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5303 6.75396C16.8232 6.46107 16.8232 5.9862 16.5303 5.6933L11.7574 0.920332C11.4645 0.627439 10.9896 0.627439 10.6967 0.920332C10.4038 1.21323 10.4038 1.6881 10.6967 1.98099L14.9393 6.22363L10.6967 10.4663C10.4038 10.7592 10.4038 11.234 10.6967 11.5269C10.9896 11.8198 11.4645 11.8198 11.7574 11.5269L16.5303 6.75396ZM0 6.97363H16V5.47363H0V6.97363Z" fill="currentColor"></path>
                        </svg>
                        </a>
                      </div>
                    <div className="cs-height_30 cs-height_lg_30"></div>
                  </div>
                  </div>
                  
                  <div className="col-xl-4 col-sm-6">
                    <div className="cs-iconbox cs-style3 cs-box_shadow cs-white_bg">
                      <div className="cs-iconbox_img">
                      <h4>Wrap</h4>
                      <div className="cs-iconbox_text">Wrap an NFT to a smart NFTea. You can even wrap an NFT from ETH to a smart NFTea</div>
                        <a href="#wrap" className="cs-iconbox_btn cs-primary_font" onClick={() => handleShowCreate(3)}>
                        Mint
                        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5303 6.75396C16.8232 6.46107 16.8232 5.9862 16.5303 5.6933L11.7574 0.920332C11.4645 0.627439 10.9896 0.627439 10.6967 0.920332C10.4038 1.21323 10.4038 1.6881 10.6967 1.98099L14.9393 6.22363L10.6967 10.4663C10.4038 10.7592 10.4038 11.234 10.6967 11.5269C10.9896 11.8198 11.4645 11.8198 11.7574 11.5269L16.5303 6.75396ZM0 6.97363H16V5.47363H0V6.97363Z" fill="currentColor"></path>
                        </svg>
                        </a>
                      </div>
                    <div className="cs-height_30 cs-height_lg_30"></div>
                  </div>
                  </div>
                  
                
                </div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                
                {_showCreateNFT && (
                  <CreateNFT />
                  )}
                  {_showCreateLabel && (
                  <CreateLabel />
                  )}
                  {_showCreateWrap && (
                  <CreateWrap />
                  )}
              </div>
            </div>
            
            </div>

            {_errorModalOpen && (
                <Modal onClose={closeErrorModal} title="Error">
                <div className="cs-single_post">
                  <p className='text-cetnter'>{_error}
                  </p>
                
                </div>
              </Modal>
            )}
            {_renewModalOpen && (
              <Modal onClose={closeRenewModal} title="Renew Expired Label">
              <div className="cs-single_post">
              <div className="cs-bid_input_group2 text-center">
                <form onSubmit={handleRenew}>
                  <input type="number" className="cs-form_field"  placeholder="2" name="years" id="years" />
                  <div className="cs-height_20 cs-height_lg_20"></div>
                
                  <div className="cs-height_20 cs-height_lg_20"></div>
                  <p className="text-center">Renew your label</p>
                  <div className="cs-height_25 cs-height_lg_25"></div>
                  
                  <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100" onClick={handleRenew}><span>Renew Label</span></button>
                
                </form>
              </div>
              
              </div>
            </Modal>
            )}
      
      </>
    )
}

export default Create;
