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
    
    const handleSetPFP = async (event:any) => {
      event.preventDefault();
      let profilePic:any;
      if(event.target.pfp_id.value!=0){
          
          let pfp:any = await servBag(event.target.pfp_id.value, profile.account)
          console.log(pfp)
          let ipfs_:any = pfp[0];
          let nftData:any = await axios.get(ipfs_)
          if(pfp[2][2]>0){
              
              profilePic = nftData.data.image
          
          }else{
              
              handleError('you do not own this nftea')
          }
      
      }else{
          
          profilePic = "/assets/images/avatar/1.jpeg"
      }
      
      const formData:any = {
          account: account,
          name: event.target.name.value,
          email: event.target.email.value,
          story: event.target.story.value,
          twitter: event.target.twitter.value,
          profilePic: profilePic,
          pfp:event.target.pfp_id.value
        };
      
      try {
          if(account){
              // alert(account)
              let resp = await servSetProfile(formData);
              // alert(JSON.stringify(resp))
              // console.log(resp)
              if(resp.message){
                  handleError(resp.message)
              }else{
                  handleError('profile updated')
                  setProfile(resp)
                  setShowProfilePic(true)

              }
          }
      } catch (error) {
        // handle error
      }
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
                          src={profile.profilePic}
                          alt="Image"
                          className="cs-zoom_item"
                          width='200'
                          height='200'
                          // onLoad={handleImageLoad}
                          />
                        </div>
                        <h3 className="cs-profile_title">{profile.name}</h3>
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
                    <a href="#">
                    <i className="mdi mdi-account-key"></i>
                    <span>Profile Info</span>
                    </a>
                    </li> */}
                    {account== profile.account && (
                        <li>
                          <a href="#"onClick={handleOpenEditModal}>
                          <i className="mdi mdi-beaker"></i>
                          <span>Account Settings</span>
                          </a>
                        </li>
                    )}
                    <li>
                    <a href="/mint">
                    <i className="mdi mdi-auto-fix"></i>
                    <span>Create</span>
                    </a>
                    </li>
                    {/* <li>
                    <a href="#">
                    <i className="mdi mdi-apps"></i>
                    <span>My Activity</span>
                    </a>
                    </li> */}
                    <li>
                    <a href="/wallet/">
                    <i className="mdi mdi-wallet"></i>
                    <span>My Wallet</span>
                    </a>
                    </li>
                    <li>
                    <a href="/logout">
                    <i className="mdi mdi-logout"></i>
                    <span>Logout</span>
                    </a>
                    </li>
                    </ul>
                </div>
              </div>                  
                )}
            {_isEditModalOpen &&  
            <Modal onClose={handleCloseEditModal} title="Edit Profile">
            <form onSubmit={handleSetPFP}>         
              <div className="cs-height_20 cs-height_lg_20"></div>
              
              <label className="cs-form_label">Email</label>
              <div className="cs-form_field_wrap">
                  <input name="email" id="email" type="email" className="cs-form_field" placeholder="me@gmail.com" required />
              </div>
              <div className="cs-height_20 cs-height_lg_20"></div>
              
              <label className="cs-form_label">Name</label>
              <div className="cs-form_field_wrap">
                  <input name="name" id="name" type="text" className="cs-form_field" placeholder="metheartists" required />
              </div>
              <div className="cs-height_20 cs-height_lg_20"></div>
              
              <label className="cs-form_label">Avatar ID</label>
              <div className="cs-form_field_wrap">
                  <input name="pfp_id" id="pfp_id" type="number" className="cs-form_field" placeholder="1" />
              </div>
              <p className="text-center">use an nft you own as your avatar, leave blank if needed</p>

              <div className="cs-height_20 cs-height_lg_20"></div>
              
              <label className="cs-form_label">Twitter</label>
              <div className="cs-form_field_wrap">
                  <input name="twitter" id="twitter" type="text" className="cs-form_field" placeholder="metheartists" />
              </div>
              <div className="cs-height_20 cs-height_lg_20"></div>
              
              <label className="cs-form_label">Story</label>
              <div className="cs-form_field_wrap">
                <textarea cols={30} rows={5} placeholder="e. g. Item description" className="cs-form_field" name="story" id="story" ></textarea>              
              </div>
              
              <div className="cs-height_20 cs-height_lg_20"></div>
              
              <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Edit</span></button>
            </form>
            </Modal> } 
        
        </>
    )
}
export default Side;