'use client';
import React, { Component } from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import { useSDK } from '@metamask/sdk-react';
import Modal from './Modal';
import { useUser } from './UserContext';
import axios from "axios";
import { setWalletProvider, servBag} from '../services/web3Service';

const Admins = () => {

    const router:any = useRouter()
    const { sdk, connected, connecting, provider, chainId } = useSDK();  
    const { account, setAccount } = useUser();
    const [activeTab, setActiveTab] = useState('stats'); 
    const [_msg, setMessage]:any = useState()
    const [_profile, setProfile]:any = useState([])
    const [_stats, setStats]:any = useState([])

    useEffect(() => {
        if (connected && account) {
            // console.log(walletProvider.provider)
            setWalletProvider(provider);
            handleGetProfile()
            // handleStart(play)
                
        }
      }, [account, connected]);
    
      const handleTabClick = async(tab:any) => {
        let type:any = 0;
        if(tab=="stats"){
            type = 1
        }
        if(tab=="edituser"){
            type = 2
        }
        if(tab=="editgrabbi"){
            type = 3
        } 
        if(tab=="addtoken"){
            type = 4
        }   
        setActiveTab(tab);
    };
    
    const handleGetProfile = async () => {
        try {
           let data = await axios.get(`/api/getProfile?account=${account}`)
           console.log(data.data)
           if(data.data){
            // data.data.account = account
            setProfile(data.data)
            if(data.data.admin>0){
                handleStart()
            }
           }
        } catch (err) {
          console.error(err);
        }
      };

      const handleStart = async () => {
        try {
           let data = await axios.get(`/api/getAdmin`)
           console.log(data.data)
           if(data.data){
            setStats(data.data)
           }
        } catch (err) {
          console.error(err);
        }
      };

    const handleCreate = async (event:any) => {
        
        event.preventDefault();
        let play:any = event.target.game.value
        let title:any = event.target.title.value
        let type:any = event.target.type.value
        let story:any = event.target.story.value
        let nft2play:any = event.target.nft2play.value
        let nft2playlabel:any = event.target.nft2playlabel.value
        let nft2playcontract:any;
        let grabs:any = event.target.grabs.value
        let slaps:any = event.target.slaps.value
        let sneaks:any = event.target.sneaks.value
        let playersMin:any = event.target.playersMin.value
        let playersMax:any = event.target.playersMax.value
        let prize:any = event.target.prize.value
        let prizeValue:any = event.target.prizeValue.value
        let prizeNftea:any = event.target.prizeNftea.value
        let token2playcontract:any = event.target.token2playcontract.value
        let token2playbalance:any = event.target.token2playbalance.value
        let ahpreferralcount:any = event.target.ahpreferralcount.value
        let image:any = event.target.image.value
        let prizecontract:any;
        let lat = 0;
        let long = 0
        
        if(event.target.prizeNftea.value!=0){
            
            let pfp:any = await servBag(event.target.prizeNftea.value, account)
            let ipfs_:any = pfp[0];
            let nftData:any = await axios.get(ipfs_)
            if(pfp[2][2]>0){
                
                image = nftData.data.image
            
            }else{
                
                setMessage('you do not own this nftea')
            }
        
        }else{
            if(type==1){
                image = "/grabbit/9.jpeg"

            }else{
                const rand = Math.floor(Math.random() * 3) + 6;
                image = '/grabbit/'+rand+'.jpeg'
            }
        }
        
        let data_ = {
            play,
            title,
            type,
            story,
            image,
            nft2play,
            nft2playcontract,
            nft2playlabel,
            token2playcontract,
            token2playbalance,
            ahpreferralcount,
            grabs,
            slaps,
            sneaks,
            playersMax,
            playersMin,
            prize,
            prizeValue,
            prizeNftea,
            prizecontract,
            lat,
            long,
            account
          }
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/updateGrabbit'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        // console.log(result)
        setMessage(result.msg)
    }
    
    const handleSetAdmin = async (event:any) => {
        event.preventDefault();
        let user:any = event.target.account.value
        let admin:any = event.target.admin.value
        if(admin>0){
            admin = true
        }else{
            admin = false
        }
        // if(_profile.admin<1){
        //     setMessage("you are not an admin")
        // }else{
        
            let data_ = {
                user,
                admin
            }
        
            const JSONdata = JSON.stringify(data_)
            const endpoint = '/api/setAdmin'
            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSONdata,
            }
            const response = await fetch(endpoint, options)
            const result = await response.json()
            setMessage("admin updated")
        // }
    }
    
    const handleSetToken = async (event:any) => {
        event.preventDefault();
        let address:any = event.target.token.value
        let name:any = event.target.name.value
        let ticker:any = event.target.ticker.value
        let decimals:any = event.target.decimals.value
        let website:any = event.target.website.value
        let twitter:any = event.target.twitter.value

        let data_ = {
            address,
            name,
            ticker,
            decimals,
            website,
            twitter
        }
    
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/esports/setToken'
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        console.log(result)
        if(result.success){
            setMessage("token added")
        }else{
            setMessage("error adding token")
        }
    }
    return(
    <>
            <div className="cs-height_90 cs-height_lg_80"></div>
        <section className="cs-page_head cs-bg" style={{backgroundImage: "url(/img/page_head_bg.svg)"}}>
            <div className="container">
            <div className="text-center">
            <h1 className="cs-page_title" style={{fontFamily: 'Comfortaa'}}>Admin</h1>
            <ol className="breadcrumb">
            <li className="breadcrumb-item" style={{fontFamily: 'Comfortaa'}}><Link href="/">Home</Link></li>
            <li className="breadcrumb-item active" style={{fontFamily: 'Comfortaa'}}><Link href="/xmash/0">Admin</Link></li>
            </ol>
            </div>
            </div>
        </section>
        <div className="cs-height_30 cs-height_lg_30"></div>
        <div className="container">
            <>
                <div className="cs-isotop_filter cs-style1 cs-center">
                    <ul className="cs-mp0 cs-center">
                        <li className={activeTab === 'stats' ? 'active' : ''}>
                            <Link href="#" onClick={() => handleTabClick('stats')}>
                                <span>Stats</span>
                            </Link>
                        </li>
                        <li className={activeTab === 'edituser' ? 'active' : ''}>
                            <Link href="#" onClick={() => handleTabClick('edituser')}>
                                <span>Edit User</span>
                            </Link>
                        </li>
                        <li className={activeTab === 'editgrabbit' ? 'active' : ''}>
                            <Link href="#" onClick={() => handleTabClick('editgrabbit')}>
                                <span>Edit xMash</span>
                            </Link>
                        </li>
                        <li className={activeTab === 'addtoken' ? 'active' : ''}>
                            <Link href="#" onClick={() => handleTabClick('addtoken')}>
                                <span>Add Token</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="cs-height_30 cs-height_lg_30"></div>
                {activeTab=='stats' && (
                <>
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 cs-style4 cs-box_shadow cs-white_bg">
                            <h5 className="text-center p-3" style={{fontFamily: 'Comfortaa'}}>Stats</h5>
                            <p className="text-center">users: {_stats.count}</p>
                        </div>
                    </div>
                </>
                )}
                {activeTab=='edituser' && (
                <>
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 cs-style4 cs-box_shadow cs-white_bg">
                            <h5 className="text-center p-3" style={{fontFamily: 'Comfortaa'}}>Edit User</h5>
                            <div className="p3 mb-3">
                            <form onSubmit={handleSetAdmin}>         
                                <div className="cs-height_20 cs-height_lg_20"></div>
                            
                                
                                <label className="cs-form_label">Account</label>
                                <div className="cs-form_field_wrap">
                                    <input name="account" id="account"  type="text" className="cs-form_field" placeholder="0x.." required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                <label className="cs-form_label">Admin</label>
                                <div className="cs-form_field_wrap">
                                    <input name="admin" id="admin"  type="text" className="cs-form_field" placeholder="0" required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Update</span></button>
                                {_msg && (
                                    <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                                    )}
                            </form>
                            </div>
                        </div>
                    </div>
                </>
                )}
                {activeTab=='addtoken' && (
                <>
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 cs-style4 cs-box_shadow cs-white_bg">
                            <h5 className="text-center p-3" style={{fontFamily: 'Comfortaa'}}>Add Token</h5>
                            <div className="p3 mb-3">
                            <form onSubmit={handleSetToken}>         
                                <div className="cs-height_20 cs-height_lg_20"></div>
                            
                            
                                <label className="cs-form_label">Token Address</label>
                                <div className="cs-form_field_wrap">
                                    <input name="token" id="token"  type="text" className="cs-form_field" placeholder="0x.." required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>

                                <label className="cs-form_label">Name</label>
                                <div className="cs-form_field_wrap">
                                    <input name="name" id="name"  type="text" className="cs-form_field" placeholder="NFTEA" required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Ticker</label>
                                <div className="cs-form_field_wrap">
                                    <input name="ticker" id="ticker"  type="text" className="cs-form_field" placeholder="NFTEA" required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Decimals</label>
                                <div className="cs-form_field_wrap">
                                    <input name="decimals" id="decimals"  type="number" className="cs-form_field" placeholder="18." required />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>

                                <label className="cs-form_label">Website</label>
                                <div className="cs-form_field_wrap">
                                    <input name="website" id="website"  type="text" className="cs-form_field" placeholder="https://" />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>

                                <label className="cs-form_label">Twitter</label>
                                <div className="cs-form_field_wrap">
                                    <input name="twitter" id="twitter"  type="text" className="cs-form_field" placeholder="https://" />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>

                                
                                <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Add Token</span></button>
                                {_msg && (
                                    <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                                    )}
                            </form>
                            </div>
                        </div>
                    </div>
                </>
                )}
                {activeTab=='editgrabbit' && (
                <>
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 cs-style4 cs-box_shadow cs-white_bg">
                            <h5 className="text-center p-3 mt-3" style={{fontFamily: 'Comfortaa'}}>Edit xMash</h5>
                            <div className="p3 mb-3">
                            <form onSubmit={handleCreate}>         
                            <div className="cs-height_20 cs-height_lg_20"></div>
                                <label className="cs-form_label">Game ID</label>
                                <div className="cs-form_field_wrap">
                                    <input name="game" id="game"  type="text" className="cs-form_field" placeholder="5647..." required />
                                </div>

                                <div className="cs-height_20 cs-height_lg_20"></div>
                                <label className="cs-form_label">Title</label>
                                <div className="cs-form_field_wrap">
                                    <input name="title" id="title"  type="text" className="cs-form_field" placeholder="win 20% off"  />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                <label className="cs-form_label">Image</label>
                                <div className="cs-form_field_wrap">
                                    <input name="image" id="image"  type="text" className="cs-form_field" placeholder="/grabbit/" />
                                </div>
                                <p className="text-center">if the prize is an nft, whats the nft id?</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>

                                <label className="cs-form_label">Prize Type</label>
                                <div className="cs-form_field_wrap">
                                    <input name="type" id="type"  type="number" className="cs-form_field" placeholder="1"  />
                                </div>
                                <p className="text-center p-0">enter 1 for nft or 2 if it&quot;s a crypto prize</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">NFT 2 Play</label>
                                <div className="cs-form_field_wrap">
                                    <input name="nft2play" id="nft2play"  type="number" className="cs-form_field" placeholder="2"  />
                                </div>
                                <p className="text-center p-0">if a player has one of these nfts they can play</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">NFT 2 Play Contract</label>
                                <div className="cs-form_field_wrap">
                                    <input name="nft2playcontract" id="nft2playcontract"  type="text" className="cs-form_field" placeholder="0x..." />
                                </div>
                                <p className="text-center">if a player has an nft from this contract (on BNB) they can play</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">NFT 2 Play Label</label>
                                <div className="cs-form_field_wrap">
                                    <input name="nft2playlabel" id="nft2playlabel"  type="number" className="cs-form_field" placeholder="3" />
                                </div>
                                <p className="text-center">if a player has an nft from this label they can play</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Token 2 Play Contract</label>
                                <div className="cs-form_field_wrap">
                                    <input name="token2playcontract" id="token2playcontract"  type="text" className="cs-form_field" placeholder="0x..." />
                                </div>
                                <p className="text-center">if a player needs to hold a token to play</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Token Balance</label>
                                <div className="cs-form_field_wrap">
                                    <input name="token2playbalance" id="token2playbalance"  type="number" className="cs-form_field" placeholder="10"  />
                                </div>
                                <p className="text-center">how many tokens should the player have in their wallet?</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                                                
                                <label className="cs-form_label">AHP Referral Count</label>
                                <div className="cs-form_field_wrap">
                                    <input name="ahpreferralcount" id="ahpreferralcount"  type="number" className="cs-form_field" placeholder="10"  />
                                </div>
                                <p className="text-center">this game is to reward the top AHP referrer</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>

                                <label className="cs-form_label">Grabs</label>
                                <div className="cs-form_field_wrap">
                                    <input name="grabs" id="grabs"  type="number" className="cs-form_field" placeholder="10"  />
                                </div>
                                <p className="text-center">how many grabs will each player get</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Slaps</label>
                                <div className="cs-form_field_wrap">
                                    <input name="slaps" id="slaps"  type="number" className="cs-form_field" placeholder="15"  />
                                </div>
                                <p className="text-center">how many slaps will each player get</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Sneaks</label>
                                <div className="cs-form_field_wrap">
                                    <input name="sneaks" id="sneaks"  type="number" className="cs-form_field" placeholder="5"  />
                                </div>
                                <p className="text-center">how many sneaks will each player get</p>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Max Players</label>
                                <div className="cs-form_field_wrap">
                                    <input name="playersMax" id="playersMax"  type="number" className="cs-form_field" placeholder="20" />
                                </div>
                                <p className="text-center">whats the max number of players for this game?</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Min Players</label>
                                <div className="cs-form_field_wrap">
                                    <input name="playersMin" id="playersMin"  type="number" className="cs-form_field" placeholder="3"  />
                                </div>
                                <p className="text-center">whats the minimum number of players to start the game?</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Prize</label>
                                <div className="cs-form_field_wrap">
                                    <input name="prize" id="prize"  type="text" className="cs-form_field" placeholder="coupon nft"  />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Prize Value</label>
                                <div className="cs-form_field_wrap">
                                    <input name="prizeValue" id="prizeValue"  type="number" className="cs-form_field" placeholder="$10" />
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">NFT Prize ID</label>
                                <div className="cs-form_field_wrap">
                                    <input name="prizeNftea" id="prizeNftea"  type="number" className="cs-form_field" placeholder="104" />
                                </div>
                                <p className="text-center">if the prize is an nft, whats the nft id?</p>
                                
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                
                                <label className="cs-form_label">Game Story</label>
                                <div className="cs-form_field_wrap">
                                    <textarea name="story" id="story" className="cs-form_field" placeholder="win this awesome.." ></textarea>
                                </div>
                                <div className="cs-height_20 cs-height_lg_20"></div>
                                <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Edit Game</span></button>
                                {_msg && (
                                    <p className="text-center mt-2 p-2" style={{fontFamily: 'Comfortaa', color:'#000', backgroundColor:'red', borderRadius:'10px'}}>{_msg}</p>
                                )}
                            </form>

                            </div>
                        </div>
                    </div>
                </>
                )}
            </>    
        </div>    
    </>
    )
}
export default Admins;