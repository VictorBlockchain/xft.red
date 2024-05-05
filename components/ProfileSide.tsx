// CustomSlider.js
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';
import { useUser } from './UserContext';
import { useRouter } from 'next/router';
import { setWalletProvider, servActivate,servActivatePrice,servPrice,servMint,servOperator,servLabel,servFlames,servNFT2Label, servNFT,servBag,servContract2Label,servWrap,servURI,servApproveWrapper,servWrapApproveCheck,servRenew, servApproveToken,servCheckOperator } from '../services/web3Service';
import axios from "axios";
import { servSetProfile } from '../services/profile';
import Link from 'next/link'

const Side = ({profile}:any) => {
    const router = useRouter();
    const { sdk, connected, connecting, provider, chainId }:any = useSDK();  
    const { account, setAccount} = useUser();
    const currentRoute = router.pathname;
    const routeParts = currentRoute.split('/');
    const lastPart = routeParts[routeParts.length - 1];
    const [_showSide, setShowSide]:any = useState(false)
    const [_profile, setProfile]:any = useState([])
    const [_isEditModalOpen, setEditModalOpen]:any = useState(false)
    const [_errorMsg, setErrorMsg]:any = useState(false)
    const [_showProfilePic, setShowProfilePic]:any = useState(false)
    const [_msg, setMessage]:any = useState()

  
    useEffect(() => {
      if(account && connected){
        setWalletProvider(provider);
        // console.log(account, profile.account)
      }
      }, [connected,account]);
        
    useEffect(()=>{
      if(router.asPath){
        setShowSide(true)
      }
    },[router.asPath])
    
    const handleGetProfile = async () => {
      try {
         let data = await axios.get(`/api/getProfile?account=${profile.account}`)
         if(data.data){
          setProfile(data.data)
          setShowProfilePic(true)
         }else{
          handleError('to get started, create your artist profile')
         }
      //   console.log(profileData);
      } catch (err) {
        console.error(err);
      }
    };

    const handleProfile = async (event:any) => {
      event.preventDefault();
      let name:any = event.target.name.value
      let name2:any = event.target.name2.value
      let email:any = event.target.email.value
      let avatar:any = event.target.avatar.value
      let twitter:any = event.target.twitter.value
      let tiktok:any = event.target.tiktok.value
      let story:any = event.target.story.value
      let phone:any;
      let cover:any;
      
      if(event.target.avatar.value!=0){
          
          let pfp:any = await servBag(event.target.avatar.value, account)
          let ipfs_:any = pfp[0];
          let nftData:any = await axios.get(ipfs_)
          if(pfp[2][2]>0){
              
              avatar = nftData.data.image
          
          }else{
              
              setMessage('you do not own this nftea')
          }
      
      }else{
          
          avatar = "/assets/images/avatar/1.jpeg"
      }
      
      let data_ = {
          email,
          phone,
          account,
          name,
          name2,
          avatar,
          twitter,
          tiktok,
          story,
          cover
        }
      const JSONdata = JSON.stringify(data_)
      const endpoint = '/api/setProfile'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSONdata,
      }
      const response = await fetch(endpoint, options)
      const result = await response.json()
      setMessage(result.msg)
  
  }
    

    const handleError = async (msg:any)=>{
      setErrorMsg(msg)
    }
    const handleEdit = async (event:any) => {
      event.preventDefault();
    
    
    }

    function handleOpenEditModal() {
      setEditModalOpen(true);
    }
    
    function handleCloseEditModal() {
      setEditModalOpen(false);
    }
        return(
        <>  
                {_showSide &&  (
                <div className="cs-profile_left">
                <div className="cs-profile_sidebar cs-white_bg cs-box_shadow">
                  {profile && (
                  
                      <>
                      <div className="cs-profile_info">
                        <div className="cs-profile_pic">
                          <img
                          src={profile.avatar}
                          alt="Image"
                          className="cs-zoom_item"
                          width='200'
                          height='200'
                          // onLoad={handleImageLoad}
                          />
                        </div>
                        <h3 className="cs-profile_title">{profile.name2}</h3>
                        <p className="text-center p-1">{`${profile.account.substring(0, 6)}...${profile.account.substring(profile.account.length - 6)}`}<br/>@{profile.twitter}</p>
                        {/* <ul className="cs-profile_meta cs-mp0">
                          <li>Followers (560)</li>
                          <li>Following (56)</li>
                        </ul> */}
                      </div>
                      <div className="mb-2" style={{width: '100%', height: '2px', background: 'linear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)'}}></div>
                      </>
                  
                  )}
                  <ul className="cs-profile_nav cs-mp0">
                    {/* <li>
                    <Link href="#">
                    <i className="mdi mdi-account-key"></i>
                    <span>Profile Info</span>
                    </Link>
                    </li> */}
                    {account== profile.account && (
                        <li>
                          <Link href="#"onClick={handleOpenEditModal}>
                          <i className="mdi mdi-beaker"></i>
                          <span>Account Settings</span>
                          </Link>
                        </li>
                    )}
                    <li>
                    <Link href="/mint">
                    <i className="mdi mdi-auto-fix"></i>
                    <span>Create</span>
                    </Link>
                    </li>
                    {/* <li>
                    <Link href="#">
                    <i className="mdi mdi-apps"></i>
                    <span>My Activity</span>
                    </Link>
                    </li> */}
                    <li>
                    <Link href="/wallet/">
                    <i className="mdi mdi-wallet"></i>
                    <span>My Wallet</span>
                    </Link>
                    </li>
                    <li>
                    <Link href="/logout">
                    <i className="mdi mdi-logout"></i>
                    <span>Logout</span>
                    </Link>
                    </li>
                    </ul>
                </div>
              </div>                  
                )}
            {_isEditModalOpen &&  
            <Modal onClose={handleCloseEditModal} title="Edit Profile">
                <form onSubmit={handleProfile}>         
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Real Name</label>
                    <div className="cs-form_field_wrap">
                        <input name="name" id="name"  type="text" className="cs-form_field" placeholder="john picasso" required />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">User Name</label>
                    <div className="cs-form_field_wrap">
                        <input name="name2" id="name2"  type="text" className="cs-form_field" placeholder="picasso" required />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Email</label>
                    <div className="cs-form_field_wrap">
                        <input name="email" id="email"  type="email" className="cs-form_field" placeholder="picasso@gmail.com" required />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Avatar</label>
                    <div className="cs-form_field_wrap">
                        <input name="avatar" id="avatar"  type="number" className="cs-form_field" placeholder="1" required />
                    </div>
                    <p className="text-center">must be an nftea you own, enter 0 to otherwise</p>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Twitter</label>
                    <div className="cs-form_field_wrap">
                        <input name="twitter" id="twitter"  type="text" className="cs-form_field" placeholder="picasso"/>
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Tiktok</label>
                    <div className="cs-form_field_wrap">
                        <input name="tiktok" id="tiktok"  type="text" className="cs-form_field" placeholder="picassotiktok" />
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    
                    <label className="cs-form_label">Your Story</label>
                    <div className="cs-form_field_wrap">
                        <textarea name="story" id="story" className="cs-form_field" placeholder="I love nfteas..." required></textarea>
                    </div>
                    <div className="cs-height_20 cs-height_lg_20"></div>
                    <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Update</span></button>
                    {_msg && (
                        <p className="text-center">{_msg}</p>
                    )}
                </form>
            </Modal> } 
        
        </>
    )
}
export default Side;