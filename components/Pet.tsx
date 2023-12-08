import React, { Component } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import Modal from './Modal';
import {useCallback, useEffect, useState} from 'react'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import axios from "axios";
import Web3 from 'web3';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSDK } from '@metamask/sdk-react';
import { useUser } from './UserContext';

const CONTRACT_ADDRESS = '0xAF73c709e66fe339beE5608477F9e7A589acAEC5';
const contractABI = require('./ahp.json');

const PET = () => {
    const router = useRouter()
    const { sdk, connected, connecting, provider, chainId }:any = useSDK();  
    const { user, setUser } = useUser();
    
    const [accounts, setAccounts] = useState();
    const [isLockTokenModalOpen, setIsLockTokenModalOpen]:any = useState(false);
    const [isLockBNBModalOpen, setIsLockBNBModalOpen]:any = useState(false);
    const [isLockNFTModalOpen, setIsLockNFTModalOpen]:any = useState(false);
    const [isWBNBModalOpen, setIsWBNBModalOpen]:any = useState(false);
    const [isWTOKENModalOpen, setIsWTOKENModalOpen]:any = useState(false);
    const [isWNFTModalOpen, setIsWNFTModalOpen]:any = useState(false);
    const [actionType, setActionType]:any = useState(0);
    const [selectedDateTime, setSelectedDateTime]:any = useState(null);
    const [isAgreed, setIsAgreed]:any = useState(false);
    const [userpets, setUserPets]:any = useState(null)
    const [userpet, setUserPet]:any = useState(null)
    const [petID, setPetID]:any = useState(null)
    const { pet }:any = useRouter().query;
    
  
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
}, [])
    
    
function handleOpenLockTokenModal() {
  setIsLockTokenModalOpen(true);
}
function handleCloseLockTokenModal() {
  setIsLockTokenModalOpen(false);
}
function handleOpenLockBNBModal() {
  setIsLockBNBModalOpen(true);
}
function handleCloseLockBNBModal() {
  setIsLockBNBModalOpen(false);
}
function handleOpenLockNFTModal() {
  setIsLockNFTModalOpen(true);
}
function handleCloseLockNFTModal() {
  setIsLockNFTModalOpen(false);
}
    
function handleOpenWBNBModal() {
  setIsWBNBModalOpen(true);
}
function handleCloseWBNBModal() {
  setIsWBNBModalOpen(false);
} 
function handleOpenWTOKENModal() {
  setIsWTOKENModalOpen(true);
}
function handleCloseWTOKENModal() {
  setIsWTOKENModalOpen(false);
}
function handleOpenWNFTModal() {
  setIsWNFTModalOpen(true);
}
function handleCloseWNFTModal() {
  setIsWNFTModalOpen(false);
}  
  
    // if (router.query.pet !== undefined && pet.length>1) {
    //     // setPet(pet[1])
    //     //setPetID(pet[1])
    // }
    useEffect(() => {
      if(user){
        setAccounts(user)
      }
    }, [user]);
    
    useEffect(() => {
      const getPetID = () => {
        if (router.isReady && router.query.pet !== undefined && pet.length>1) {
          setPetID(pet[1])
          if(user){
            start(pet[1])
          }
          // console.log(pet[1])
        }
      }
      getPetID()
    }, [router.isReady, user])
      
    
      async function start(pet_:any){
        
        if (user) {
            
            const w3 = new Web3(provider);
            if(pet_>0){
              let contract = new w3.eth.Contract(contractABI, CONTRACT_ADDRESS);
              contract.methods.getPET(pet_).call()
              .then(async(res:any) => {
                  
                  const response = await axios.get(res[5]);
                  // console.log(response.data)
                  let pet_data:any = {
                    owner:res[0],
                    bag:res[1],
                    bnb:res[2],
                    bnblocked:res[3],
                    bnbunlockdate:res[4],
                    image:response.data.image,
                    description:response.data.description,
                    attributes:response.data.attributes
                  }
                  // console.log(pet_data)
                  setUserPet(pet_data );
              
              })
            }else{
              alert('no pet id')
            }
        }
  
      
      }

      
      const lockBNB = async (timestamp:any) => {
        try {
          
          if (accounts && router.isReady) {
                
                const w3 = new Web3(provider);
                const contract = new w3.eth.Contract(contractABI, CONTRACT_ADDRESS);
                contract.methods.lockBNB(petID, timestamp)
                .send({ from: accounts, gas: 304000 })
                .then((receipt:any) => {
                  alert('bnb locked')
                }).catch((error:any) => {
                console.log(error)
              })
      };
    }catch(error){
      console.log(error)
    }
  }

      const lockToken = async (token:any,timestamp:any) => {
        try {
          
          if (accounts && router.isReady) {
  
                const w3 = new Web3(provider);
                const contract = new w3.eth.Contract(contractABI, CONTRACT_ADDRESS);
                contract.methods.lockToken(petID, timestamp, token)
                .send({ from: accounts, gas: 304000 })
                .then((receipt:any) => {
                  alert('token locked')
                }).catch((error:any) => {
                console.log(error)
              })
          };
        }catch(error){
          console.log(error)
        }
      };
      
      const lockNFT = async (nftcontract:any,nft:any,timestamp:any) => {
        try {
  
          if (accounts && router.isReady) {
  
                const w3 = new Web3(provider);
                const contract = new w3.eth.Contract(contractABI, CONTRACT_ADDRESS);
                contract.methods.lockNFT(nftcontract,nft,petID,timestamp)
                .send({ from: accounts, gas: 304000 })
                .then((receipt:any) => {
                    alert('nft locked')
                }).catch((error:any) => {
                console.log(error)
              })
          };
        }catch(error){
          console.log(error)
        }
      };
      

      const handleAgreeChange = (event:any) => {
        setIsAgreed(event.target.value === "0");
      };
      const handleDateTimeSubmit = (event:any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
            const now = new Date();
            const minDate = new Date(now.getTime() + 5 * 60 * 1000);
            if (selectedDateTime < minDate) {
                alert("Selected date and time must be at least 5 minutes in the future.");
                return;
              }
        if (isAgreed) {
            
            const timestamp = Math.floor(selectedDateTime.getTime() / 1000);
            // Do something with the Unix timestamp, such as storing it in a Solidity contract
            // console.log("Selected Unix timestamp: ", timestamp);
            const type_ = formData.get('type_');
            // alert(type_)
            if(!timestamp){
                alert("Please select a date and time.");
                return;
            }else{
                
                if(type_ === "1"){
                    
                    lockBNB(timestamp)
                }
                if(type_ === "2"){
                    
                    const contractAddress = formData.get('contractAddress');
                    if(!contractAddress){
                        alert("whats the token address?");
                        return;
                    }else{
                        lockToken(contractAddress,timestamp)
                    
                    }
                }
                if(type_ === "3"){
                    const contractAddress = formData.get('contractAddress');
                    const nftid = formData.get('nftid');
                    if(!contractAddress){
                        alert("whats the token address?");
                        return;
                    }else if(!nftid){
                        alert("whats the nft id?");
                        return;
                     }else{
                        lockNFT(contractAddress,nftid,timestamp)
                     }
                }
            }
          

          } else {
            alert("Please agree to the terms before submitting the form.");
          }
      }

      const handleWithdrawBNB = (event:any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const amount = formData.get('amount');
        if(!amount){
            alert("whats the bnb amount?");
            return;
        }else{
          if (accounts && router.isReady) {
  
                const w3 = new Web3(provider);
                const contract = new w3.eth.Contract(contractABI, CONTRACT_ADDRESS);
                contract.methods.withdrawBNB(amount,petID)
                .send({ from: accounts, gas: 304000 })
                .then((receipt:any) => {
                    alert('nft withdrawn')
                }).catch((error:any) => {
                console.log(error)
              })
          };
        }
  
      }
      const handleWithdrawToken = (event:any) => {
        event.preventDefault();
        
        try {
          
          const formData = new FormData(event.target);
          const contractAddress = formData.get('contractAddress');
          const amount = formData.get('amount');
          if(!contractAddress){
              alert("whats the token address?");
              return;
          }else if(!amount){
              alert("whats the amount?");
              return;
          }else{

            if (accounts && router.isReady) {

                  const w3 = new Web3(provider);
                  const contract = new w3.eth.Contract(contractABI, CONTRACT_ADDRESS);
                  contract.methods.withdrawToken(petID,contractAddress, amount)
                  .send({ from: accounts, gas: 304000 })
                  .then((receipt:any) => {
                      alert('token withdrawn')
                  }).catch((error:any) => {
                  console.log(error)
                })
            };
          
          }
        
        }catch(error){
          console.log(error)
        }
      }
      const handleWithdrawNFT = (event:any) => {
        event.preventDefault();
        const formData:any = new FormData(event.target);
        const contractAddress = formData.get('contractAddress');
        const nftid = formData.get('nftid');
        const amount = formData.get('amount');
        if(!contractAddress){
            alert("whats the token address?");
            return;
        }else if(!nftid){
            alert("whats the nftid?");
            return;
        }else if(!amount){
            alert("whats the amount?");
            return;
        }else{

          if (accounts && router.isReady) {

                const w3 = new Web3(provider);
                const contract = new w3.eth.Contract(contractABI, CONTRACT_ADDRESS);
                contract.methods.withdrawNFT(petID,contractAddress,nftid, amount)
                .send({ from: accounts, gas: 304000 })
                .then((receipt:any) => {
                    alert('nft withdrawn')
                }).catch((error:any) => {
                console.log(error)
              })
          };
        }
  
      }
  
      const handleDateTimeChange = (dateTime:any) => {
        setSelectedDateTime(dateTime);
      }
  //     async function setActions(type:any){
  //       setActionType(type);
  //     }

      return (
        <>
          <div className="cs-height_90 cs-height_lg_80"></div>
          <section className="cs-page_head cs-bg" style={{backgroundImage: "url('/img/page_head_bg.svg')"}}>
            <div className="container">
              <div className="text-center">
                <h1 className="cs-page_title">Pet Details</h1>
                <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Pet Details</li>
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
                    <Image
                      src="/img/pets/435.png"
                      alt="Image"
                      className="cs-zoom_item"
                      width='600'
                      height='600'
                      
                  />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="cs-height_0 cs-height_lg_40"></div>
                <div className="cs-single_product_head">
                  {pet && pet[1] && ( <h2>#{pet[1]}</h2>)}
                  {userpet && userpet.owner && (<p><span className="cs-accent_color">Wallet</span> · {`${userpet.bag.slice(0, 4)}...${userpet.bag.slice(-5)}`}</p>)}
                  {userpet && userpet.owner && ( <span className="cs-card_like cs-primary_color cs-box_shadow">
                  <i className="fab fa-btc"></i>
                    {userpet.bnb}
                  </span>)}
                </div>
                <div className="cs-height_0 cs-height_lg_40"></div>

                <div className="row">
                  <div className="col-xl-6">
                  <div className="cs-height_25 cs-height_lg_25"></div>
                  <div className="cs-author_card cs-white_bg cs-box_shadow">

                  <div className="cs-author_right">
                  <h3>Owner</h3>
                  {userpet && userpet.owner && (  <p>{`${userpet.owner.slice(0, 4)}...${userpet.owner.slice(-5)}`}</p>)}
                  </div>
                  </div>
                  <div className="cs-height_25 cs-height_lg_25"></div>
                  </div>
                  {/* <div className="col-xl-6">
                  <div className="cs-height_25 cs-height_lg_25"></div>
                  <div className="cs-author_card cs-white_bg cs-box_shadow">
                  <div className="cs-author_img">
                  <Image
                      src="/img/avatar_14.png"
                      alt="Image"
                      className="cs-zoom_item"
                      width='50'
                      height='50' 
                  /> 
                    </div>
                  <div className="cs-author_right">
                  <h3>Audiography</h3>
                  <p>@Stanford V. McCutcheon</p>
                  </div>
                  </div>
                  <div className="cs-height_25 cs-height_lg_25"></div>
                  </div> */}
                </div>
              
                <div className="cs-tabs cs-fade_tabs cs-style1">
                  <div className="cs-medium">
                  <ul className="cs-tab_links cs-style1 cs-medium cs-primary_color cs-mp0 cs-primary_font">
                  <li className="active"><a href="#Description">Pet Attributes</a></li>
                  <li className=""><a href="#Details">Wallet Actions</a></li>
                  </ul>
                  </div>
                  <div className="cs-height_20 cs-height_lg_20"></div>
                  <div className="cs-tab_content">
                  <div id="Description" className="cs-tab active" style={{}}>
                  <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                  {userpet && userpet.owner && (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '8px', backgroundColor: '#080326' }}>Trait Type</th>
                          <th style={{ textAlign: 'left', padding: '8px', backgroundColor: '#080326' }}>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ backgroundColor: '##080326' }}>
                          <td style={{ textAlign: 'left', padding: '8px' }}>BNB Balance</td>
                          <td style={{ textAlign: 'left', padding: '8px' }}>{userpet.bnb}</td>
                        </tr>
                        <tr style={{ backgroundColor: '#080326' }}>
                          <td style={{ textAlign: 'left', padding: '8px' }}>BNB Unlocked Date</td>
                          <td style={{ textAlign: 'left', padding: '8px' }}>{userpet.bnbunlockdate}</td>
                        </tr>
                        {userpet.attributes.map((attribute:any, index:any) => (
                          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#341138' : '#080326' }}>
                            <td style={{ textAlign: 'left', padding: '8px' }}>{attribute.trait_type}</td>
                            <td style={{ textAlign: 'left', padding: '8px' }}>{attribute.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  </div>
                  </div>
                  <div id="Details" className="cs-tab" style={{display: 'none'}}>
                  <div className="cs-white_bg cs-box_shadow cs-general_box_5">
                  <div className="row">
                      <div className="col-6">
                        <a href="#" className="cs-btn cs-style1 cs-btn_lg w-100 text-center" onClick={handleOpenLockTokenModal}><span>Lock Token</span></a>
                      </div>
                      <div className="col-6">
                        <a href="#" className="cs-btn cs-style1 cs-btn_lg w-100 text-center" onClick={handleOpenLockBNBModal}><span>Lock BNB</span></a>
                      </div>
                    </div>
                    <div className="cs-height_30 cs-height_lg_30"></div>
                    <div className="row">
                      <div className="col-6">
                        <a href="#" className="cs-btn cs-style1 cs-btn_lg w-100 text-center" onClick={handleOpenLockNFTModal}><span>Lock NFT</span></a>
                      </div>
                      <div className="col-6">
                        <a href="#" className="cs-btn cs-style1 cs-btn_lg w-100 text-center" onClick={handleOpenWBNBModal}><span>W/BNB</span></a>
                      </div>
                    </div>
                    <div className="cs-height_30 cs-height_lg_30"></div>
                    
                    <div className="row">
                      <div className="col-6">
                        <a href="#" className="cs-btn cs-style1 cs-btn_lg w-100 text-center" onClick={handleOpenWTOKENModal}><span>W/Token</span></a>
                      </div>
                      <div className="col-6">
                        <a href="#" className="cs-btn cs-style1 cs-btn_lg w-100 text-center" onClick={handleOpenWNFTModal}><span>W/NFT</span></a>
                      </div>
                    </div>
                  </div>
                  </div>
                  </div>
                </div>
                <div className="cs-height_70 cs-height_lg_70"></div>
                <div className="row">
                  <div className="col-6">
                  <a href="#" className="cs-btn cs-style1 cs-btn_lg w-100 text-center"><span>Sell On NFTea</span></a>
                  </div>
                  <div className="col-6">
                    {userpet && userpet.owner && (<a href={`https://bscscan.com/address/${userpet.bag}`} target='_blank' className="cs-btn cs-style1 cs-btn_lg w-100 text-center"><span>View Wallet</span></a>)}
                  </div>
                </div>
              

              </div>
            </div>
          </div>
      
          {isLockTokenModalOpen &&  
            <Modal onClose={handleCloseLockTokenModal} title="Lock Token">
            <p className="text-center">Enter token contract address</p>
            <div className="cs-bid_input_group2 text-center">
            <form onSubmit={handleDateTimeSubmit}>
                
                <input type="text" className="cs-form_field" placeholder="token contract" name="contractAddress" />
                <div className="cs-height_25 cs-height_lg_25"></div>
                <p className="text-center">Select date to unlock</p>
                
                <DatePicker
                  placeholderText='lock until'
                  className='cs-form_field'
                  selected={selectedDateTime}
                  onChange={handleDateTimeChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  minDate={new Date()}
                  isClearable
                  />
                  <input type="hidden" name="type_" value="2"></input>
                  <div className="cs-height_25 cs-height_lg_25"></div>
                  <p className="text-center">You will not be able to change the unlock date</p>
                  <div className="cs-form_field_wrap cs-select_arrow">
                    <select className="cs-form_field">
                      <option value="1">I Agree</option>
                      <option value="2">No</option>
                    </select>
                  </div>
            </form>
            </div>  
            <div className="cs-height_25 cs-height_lg_25"></div>          
            <button className="cs-btn cs-style1 cs-btn_lg w-100" onClick={handleDateTimeSubmit}><span>Lock Token</span></button>
            </Modal> } 

            {isLockBNBModalOpen &&  
            <Modal onClose={handleCloseLockBNBModal} title="Lock BNB">
            <p className="text-center">Select date to unlock</p>
            <div className="cs-bid_input_group2 text-center">
            <form onSubmit={handleDateTimeSubmit}>

              <DatePicker
                  placeholderText='lock until'
                  className='cs-form_field'
                  selected={selectedDateTime}
                  onChange={handleDateTimeChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  minDate={new Date()}
                  isClearable
                  />
                  <input type="hidden" name="type_" value="2"></input>
                  <div className="cs-height_25 cs-height_lg_25"></div>
                  <p className="text-center">You will not be able to change the unlock date</p>

                  <div className="cs-form_field_wrap cs-select_arrow">
                    <select className="cs-form_field">
                      <option value="1">I Agree</option>
                      <option value="2">No</option>
                    </select>
                  </div>
                </form>
            </div>
            <div className="cs-height_25 cs-height_lg_25"></div>            
            <button className="cs-btn cs-style1 cs-btn_lg w-100"  onClick={handleDateTimeChange}><span>Lock BNB</span></button>
            </Modal> } 
            
            {isLockNFTModalOpen &&  
            <Modal onClose={handleCloseLockNFTModal} title="Lock NFT">
            <p className="text-center">Enter NFT contract address</p>
            <div className="cs-bid_input_group2 text-center">
            <form onSubmit={handleDateTimeSubmit}>
                
                <input type="text" className="cs-form_field" placeholder="token contract" name="contractAddress" />
                <div className="cs-height_25 cs-height_lg_25"></div>
                <p className="text-center">NFT ID</p>
                <input type="text" className="cs-form_field" placeholder="token contract" name="contractAddress" />
                <div className="cs-height_25 cs-height_lg_25"></div>
                
                <p className="text-center">Select date to unlock</p>
                
                <DatePicker
                  placeholderText='lock until'
                  className='cs-form_field'
                  selected={selectedDateTime}
                  onChange={handleDateTimeChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  minDate={new Date()}
                  isClearable
                  />
                  <input type="hidden" name="type_" value="2"></input>
                  <div className="cs-height_25 cs-height_lg_25"></div>
                  <p className="text-center">You will not be able to change the unlock date</p>
                  <div className="cs-form_field_wrap cs-select_arrow">
                    <select className="cs-form_field">
                      <option value="1">I Agree</option>
                      <option value="2">No</option>
                    </select>
                  </div>
            </form>            
            <div className="cs-height_25 cs-height_lg_25"></div>
            
            <button className="cs-btn cs-style1 cs-btn_lg w-100"  onClick={handleDateTimeChange}><span>Lock NFT</span></button>
            </div>
            
            </Modal> } 

            {isWBNBModalOpen &&  
            <Modal onClose={handleCloseWBNBModal} title="Withdraw BNB">
            <p className="text-center">Enter withdraw amount</p>
            <div className="cs-bid_input_group2 text-center">
              <form onSubmit={handleWithdrawBNB}>
                <input type="text" className="cs-form_field" placeholder="withdraw amount" name="amount" />
              </form>
            </div>            
            <div className="cs-height_20 cs-height_lg_20"></div>
            <p className="text-center">You must own Pet to withdraw from it's wallet.<br/> If you have this nft wrapped on NFTea.app<br/> unwrap it 1st</p>
            <div className="cs-height_25 cs-height_lg_25"></div>
            
            <button className="cs-btn cs-style1 cs-btn_lg w-100" onClick={handleWithdrawBNB}><span>Withdraw</span></button>
            </Modal> } 

            {isWTOKENModalOpen &&  
            <Modal onClose={handleCloseWTOKENModal} title="Withdraw Token">
            <p className="text-center">Enter token contract address</p>
            <div className="cs-bid_input_group2 text-center">
            <form onSubmit={handleWithdrawToken}>
              <input type="text" className="cs-form_field" placeholder="contract address" name="contractAddress" />

              <div className="cs-height_25 cs-height_lg_25"></div>
              <p className="text-center">Enter withdraw amount</p>
                <input type="text" className="cs-form_field" placeholder="withdraw amount" name="amount" />

              </form>            
            </div>            
            <div className="cs-height_20 cs-height_lg_20"></div>
            <p className="text-center">You must own Pet to withdraw from it's wallet.<br/> If you have this nft wrapped on NFTea.app<br/> unwrap it 1st</p>
            <div className="cs-height_25 cs-height_lg_25"></div>
            
            <button className="cs-btn cs-style1 cs-btn_lg w-100" onClick={handleWithdrawToken}><span>Withdraw</span></button>
            </Modal> } 

            {isWNFTModalOpen &&  
            <Modal onClose={handleCloseWNFTModal} title="Withdraw NFT">
            <p className="text-center">enter contract address of the nft to withdraw</p>
            <div className="cs-bid_input_group2 text-center">
              <form onSubmit={handleWithdrawNFT}>
                <input type="text" className="cs-form_field"  placeholder="contract address" name="contractAddress" />
                <div className="cs-height_20 cs-height_lg_20"></div>
                <p className="text-center">enter nft id</p>
                
                <input type="number" className="cs-form_field"  placeholder="nft #id" name="nftid" />
                <div className="cs-height_20 cs-height_lg_20"></div>
                <p className="text-center">enter amount</p>
                <input type="number" className="cs-form_field"  placeholder="amount" name="amount" />
            
            <div className="cs-height_20 cs-height_lg_20"></div>
            <p className="text-center">You must own Pet to withdraw from it's wallet.<br/> If you have this nft wrapped on NFTea.app<br/> unwrap it 1st</p>
            <div className="cs-height_25 cs-height_lg_25"></div>
            
            <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100" onClick={handleWithdrawNFT}><span>Withdraw</span></button>

              </form>
            </div>
            
            </Modal> } 
        </>
      )

}
export default PET;
