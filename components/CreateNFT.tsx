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
import loadinggif from '../assets/images/loading1.gif'
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';
import Modal from './Modal';
import dotenv from 'dotenv';
dotenv.config();

const BLANK = '0x0000000000000000000000000000000000000000';

const Createnft = () => {
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [_nftImage, setNFTImage]:any = React.useState("")
    const [_nftAttributes, setNFTAttributes]:any = useState({});
    const [_nfteaType, setNfTeaype]:any = React.useState(8)
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
    const [_tag, setTag]:any = useState('')
    const [_uploading, setUploading]:any = useState(false)
    const [_showImage, setShowImage]:any = useState(false)
    
    const projectId = "2HjsI8oUMBvpRZQrpMAt4xfc8JR";
    const projectSecret = "b1ae3d41e6c91d02503de73814b9907a";
    const authorization = "Basic " + btoa(projectId + ":" + projectSecret);
    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
            authorization
        }
    })
    React.useEffect(() => {
        if (_nftImage) {
          // Render the component here
          setShowImage(true)
        }
      }, [_nftImage]);

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
      
      const handleNfteaImage = async (event:any)=> {
        setUploading(true)
        event.preventDefault()
        const toFile = event.target.files[0];
        let ipfs_:any = await handleIPFS(toFile)
        ipfs_ = 'https://nftea.infura-ipfs.io/ipfs/' + ipfs_.path
        // console.log(ipfs_)
        if (toFile.type.startsWith('image')) {
            alert("image uploaded")
            setNFTImage(ipfs_)
        } else {
            alert("media file uploaded")
            
            setMedia(ipfs_)
            setMediaType(toFile.type)
            handleError('media uploaded')
        }
        console.log(ipfs_)
        setNfTeaype(8)
        setNfTeaypeName('NfTea')
        setUploading(false)
    }

    async function handleIPFS(toFile:any){
        let result;
        // setUploading(true)
        // setShowUploading(true)
        
        if(toFile.type=='image/heic'){
            
            alert('heic format not allowed')
        
        }else {

            result = await ipfs.add(toFile);
            // setUploading(false)
            // setShowUploading(false)
        
        }
        
        return result;
    }
    const handleMint = async (event:any) => {
        let years_ = 0
        let linkedto;
        // alert(event.target.title.value)
        if(_nfteaType!=1){
            linkedto = event.target.linkto.value || 0
        }

        let _mintForm:any = new Object();
        _mintForm.title = event.target.title.value
        _mintForm.linkto = linkedto || 0
        _mintForm.years = 0
        _mintForm.supply = event.target.supply.value
        _mintForm.description = event.target.story.value
        _mintForm.licenseterm =  0
        _mintForm.labelsplit = 0
        _mintForm.animation_url = null
        _mintForm.labelsplit = 0
        _mintForm.extcontract = null
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
            
        }
        if(pass>0){

            handleipfsUpload(event)
        }
      
      }
    
      const handleipfsUpload = async (event:any)=> {
        let _image:any;
        let name:any = _mintData.title
        if(!name){
            name = _label
        }
            _image = _nftImage

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
                    external_url: "https://nftea.app",
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
            if (result_) {
    
                setIPFS('https://nftea.infura-ipfs.io/ipfs/' + result_.path)
    
                let pass = true;
                let transfer_ = 1

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
                    addresses_.push(account) // 0 creator
                    addresses_.push(account) // 1 minter
                    addresses_.push(_labelwallet) // 2 wallet
                    addresses_.push(BLANK) //3 label owner
                    addresses_.push(BLANK) //4 external nft contract address
                        
                    let strings_ = []
                    strings_.push(_label.toLowerCase())
                    strings_.push('https://nftea.infura-ipfs.io/ipfs/' + result_.path)
                    strings_.push(_tag)
                    
                    let result = await servMint(account,strings_,settings_,addresses_)
                    if(result.status){
                        handleError('congrats, your nft is minting')
                        settings_ = []
                        addresses_ = []
                    }
                }
            }
        }
      }
    return(
        <>
            <form className="row" id="nft" onSubmit={handleMint}>
                        <div className="col-lg-4 cs-white_bg cs-general_box_5 mb-2 p-0">
                            {_showImage && (
                                <img
                                src={_nftImage}
                                alt="NFTea"
                                className="cs-zoom_item"
                                width='400'
                                height='400'
                                style={{borderRadius:'5px'}}

                                // onLoad={handleImageLoad}
                            />
                            )}
                            {!_showImage && (
                                <Image
                                src="/assets/images/minttea.gif"
                                alt="Image"
                                className="cs-zoom_item"
                                width='800'
                                height='1200'
                                style={{borderRadius:'5px'}}
                                // onLoad={handleImageLoad}
                            />
                            )}
                        </div>  
                <div className="col-lg-8 cs-white_bg cs-general_box_5 mb-2 mr-3">
                    <div className="cs-file_wrap">
                        {!_uploading && (
                            <>
                            <div className="cs-file_in">
                                <svg width="46" height="47" viewBox="0 0 46 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M44.125 36.5H39.25V31.625C39.25 31.194 39.0788 30.7807 38.774 30.476C38.4693 30.1712 38.056 30 37.625 30C37.194 30 36.7807 30.1712 36.476 30.476C36.1712 30.7807 36 31.194 36 31.625V36.5H31.125C30.694 36.5 30.2807 36.6712 29.976 36.976C29.6712 37.2807 29.5 37.694 29.5 38.125C29.5 38.556 29.6712 38.9693 29.976 39.274C30.2807 39.5788 30.694 39.75 31.125 39.75H36V44.625C36 45.056 36.1712 45.4693 36.476 45.774C36.7807 46.0788 37.194 46.25 37.625 46.25C38.056 46.25 38.4693 46.0788 38.774 45.774C39.0788 45.4693 39.25 45.056 39.25 44.625V39.75H44.125C44.556 39.75 44.9693 39.5788 45.274 39.274C45.5788 38.9693 45.75 38.556 45.75 38.125C45.75 37.694 45.5788 37.2807 45.274 36.976C44.9693 36.6712 44.556 36.5 44.125 36.5Z" fill="#737A99"></path>
                                    <path d="M24.625 36.5H5.125C4.69402 36.5 4.2807 36.3288 3.97595 36.024C3.67121 35.7193 3.5 35.306 3.5 34.875V5.625C3.5 5.19402 3.67121 4.7807 3.97595 4.47595C4.2807 4.17121 4.69402 4 5.125 4H34.375C34.806 4 35.2193 4.17121 35.524 4.47595C35.8288 4.7807 36 5.19402 36 5.625V25.125C36 25.556 36.1712 25.9693 36.476 26.274C36.7807 26.5788 37.194 26.75 37.625 26.75C38.056 26.75 38.4693 26.5788 38.774 26.274C39.0788 25.9693 39.25 25.556 39.25 25.125V5.625C39.25 4.33207 38.7364 3.09209 37.8221 2.17785C36.9079 1.26361 35.6679 0.75 34.375 0.75H5.125C3.83207 0.75 2.59209 1.26361 1.67785 2.17785C0.763615 3.09209 0.25 4.33207 0.25 5.625V34.875C0.25 36.1679 0.763615 37.4079 1.67785 38.3221C2.59209 39.2364 3.83207 39.75 5.125 39.75H24.625C25.056 39.75 25.4693 39.5788 25.774 39.274C26.0788 38.9693 26.25 38.556 26.25 38.125C26.25 37.694 26.0788 37.2807 25.774 36.976C25.4693 36.6712 25.056 36.5 24.625 36.5Z" fill="#737A99"></path>
                                    <path d="M14.875 15.375C17.1187 15.375 18.9375 13.5562 18.9375 11.3125C18.9375 9.06884 17.1187 7.25 14.875 7.25C12.6313 7.25 10.8125 9.06884 10.8125 11.3125C10.8125 13.5562 12.6313 15.375 14.875 15.375Z" fill="#737A99"></path>
                                    <path d="M8.84625 20.7209L6.75 22.8334V33.2497H32.75V22.8334L25.7787 15.8459C25.6277 15.6936 25.448 15.5727 25.2499 15.4902C25.0519 15.4077 24.8395 15.3652 24.625 15.3652C24.4105 15.3652 24.1981 15.4077 24.0001 15.4902C23.802 15.5727 23.6223 15.6936 23.4713 15.8459L14.875 24.4584L11.1537 20.7209C11.0027 20.5686 10.823 20.4477 10.6249 20.3652C10.4269 20.2827 10.2145 20.2402 10 20.2402C9.78548 20.2402 9.57308 20.2827 9.37506 20.3652C9.17704 20.4477 8.99731 20.5686 8.84625 20.7209Z" fill="#737A99"></path>
                                </svg>
                                {!_showImage && (
                                <>
                                    <h3>Drag and drop an image or <span>Upload</span></h3>
                                    <p>high resulation image (jpeg, png, svg)</p>
                                </>
                                )}
                                {_showImage && (
                                <>
                                    <h3>change image or upload an <span>Audio</span> or <span>Video</span> file</h3>
                                    <p>high resulation image (jpeg, png, svg, mp3, mp4)</p>
                                </>
                                )}
                            </div>
                            </>
                        )}
                        {_uploading && (
                            <div className="loading-container">
                                <svg className="loading-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#3498db">
                                    <circle cx="50" cy="50" r="45"/>
                                </svg>
                                <div className="loading-text">uploading...</div>
                            </div>
                        )}
                    
                    <div className="cs-close_file" title="Close">
                        <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.421875" y="0.163086" width="32" height="32" rx="16" fill="url(#paint0_linear_1353_4256)"></rect>
                                <path d="M22.129 11.8702C22.5195 11.4797 22.5195 10.8465 22.129 10.456C21.7385 10.0655 21.1053 10.0655 20.7148 10.456L22.129 11.8702ZM10.7148 20.456C10.3242 20.8465 10.3242 21.4797 10.7148 21.8702C11.1053 22.2607 11.7385 22.2607 12.129 21.8702L10.7148 20.456ZM12.129 10.456C11.7385 10.0655 11.1053 10.0655 10.7148 10.456C10.3242 10.8465 10.3242 11.4797 10.7148 11.8702L12.129 10.456ZM20.7148 21.8702C21.1053 22.2607 21.7385 22.2607 22.129 21.8702C22.5195 21.4797 22.5195 20.8465 22.129 20.456L20.7148 21.8702ZM20.7148 10.456L10.7148 20.456L12.129 21.8702L22.129 11.8702L20.7148 10.456ZM10.7148 11.8702L20.7148 21.8702L22.129 20.456L12.129 10.456L10.7148 11.8702Z" fill="white"></path>
                                <defs>
                                    <linearGradient id="paint0_linear_1353_4256" x1="0.421875" y1="0.163086" x2="38.7886" y2="19.5877" gradientUnits="userSpaceOnUse">
                                        <stop offset="0" stopColor="#FC466B"></stop>
                                        <stop offset="1" stopColor="#3F5EFB"></stop>
                                    </linearGradient>
                                </defs>
                        </svg>
                    </div>
                    <input type="file" className="cs-file"  accept="image/*, audio/*, video/*"  onChange={handleNfteaImage} />
                    {/* <input type="file" className="cs-file" accept="image/*" /> */}

                    
                    {/* <img src="/" className="cs-preview" alt="Image" data-pagespeed-url-hash="2640054159" onload="pagespeed.CriticalImages.checkImageForCriticality(this);"> */}
                    </div>
                    <div className="cs-height_25 cs-height_lg_25"></div>
                </div>


                <div className="col-lg-6 cs-white_bg cs-box_shadow cs-general_box_5">
                    <label className="cs-form_label">Label ID</label>
                    <div className="cs-form_field_wrap">
                        <input type="number" className="cs-form_field" placeholder="#1" id="linkto" name="linkto" />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    <label className="cs-form_label">Item Name</label>
                    <div className="cs-form_field_wrap">
                        <input type="text" className="cs-form_field" placeholder="achme bunny" name="title" id="title" />
                    </div>
                    
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    <label className="cs-form_label">Supply</label>
                    <div className="cs-form_field_wrap">
                        <input name="supply" id="supply" type="number" className="cs-form_field" placeholder="1" />
                    </div>
                
                    <div className="cs-height_20 cs-height_lg_20"></div>
                </div>
                
                <div className="col-lg-6 cs-white_bg cs-box_shadow cs-general_box_5">
                    <label className="cs-form_label">Story</label>
                    <div className="cs-form_field_wrap">
                        <textarea cols={30} rows={5} placeholder="e. g. Item description" className="cs-form_field" name="story" id="story" ></textarea>
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    <label className="cs-form_label">Attributes (Json File)</label>
                    <div className="cs-form_field_wrap text-center">
                    <input type="file" className="cs-form_field" id="input-file2" name="input-file2" accept="application/json" onChange={handleAttributeUpload} hidden />
                    <label className="btn-upload btn bg-violet-400 hover:bg-violet-400 border-violet-400 hover:border-violet-400 text-white rounded-full w-full mt-6 cursor-pointer" htmlFor="input-file"   onClick={(e) => {e.preventDefault(); document.getElementById('input-file2')?.click()}}>Upload Attributes</label>
                    </div>

                    <div className="cs-height_20 cs-height_lg_20"></div>
                </div>
                
                <div className="col-lg-12">
                    <div className="cs-height_30 cs-height_lg_30"></div>
                    <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Mint NFT</span></button>
                </div>
            </form>
        </>
    )
}
export default Createnft;