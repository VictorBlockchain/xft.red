'use client';
import React, { Component } from 'react'
import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import {useCallback, useEffect, useState} from 'react'
import Modal from './Modal';

const About = () => {

    const [isVideoModalOpen, setIsVideoModalOpen]:any = React.useState(false)
    
    
    function handleVideoModal(event:any) {
        event.preventDefault();
        if(isVideoModalOpen){
          setIsVideoModalOpen(false);
        }else{
          setIsVideoModalOpen(true);
        }
      }
    return(
    <>
        <div className="cs-height_90 cs-height_lg_80"></div>
            <section className="cs-page_head cs-bg" style={{backgroundImage: "url(/img/page_head_bg.svg)"}}>
                <div className="container">
                    <div className="text-center">
                        <h1 className="cs-page_title" style={{fontFamily: 'Comfortaa'}}>About Us</h1>
                        <ol className="breadcrumb" style={{fontFamily: 'Comfortaa'}}>
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active">About</li>
                        </ol>
                    </div>
                </div>
            </section>
            <div className="cs-height_100 cs-height_lg_70"></div>
            <div className="container">
                <div className="cs-cta cs-style1 cs-type1 cs-bg">
                    <div className="cs-cta_right">
                    <h2 className="cs-cta_title" style={{fontFamily: 'Comfortaa'}}>Our mission is global economic empowerment through the utilization of smart NFTs.</h2>
                    <div className="cs-cta_subtitle" style={{fontFamily: 'Comfortaa'}}>We will harness the power of web3, envisioning it as a domain of collateralized value. We empower individuals to utilize their smart NFTs as peer-to-peer collateral, transcending geographical boundaries for a truly global impact. </div>
                    {/* <a href="#" className="cs-btn cs-style1 cs-btn_lg"><span>Let’s Start</span></a> */}
                    </div>
                    <div className="cs-cta_img text-center">
                    <Image
                        src="/img/globe.jpeg"
                        alt="Image"
                        className="cs-zoom_item"
                        width='460'
                        height='460'
                        style={{ borderRadius: '5px',boxShadow: '0px 0px 10px 0px #000' }} 
                        
                        // onLoad={handleImageLoad}
                    /> 
                    </div>
                </div>
            </div>
            <div className="cs-height_95 cs-height_lg_70"></div>
            <div className="container">
                <h2 className="cs-section_heading cs-style1 text-center" style={{fontFamily: 'Comfortaa'}}>Created with forward thinking</h2>
                <div className="cs-height_45 cs-height_lg_45"></div>
                <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                        
                        <a href="#" onClick={handleVideoModal} className="cs-video_block cs-style1 cs-zoom_effect cs-video_open">
                        <div className="cs-video_block_in">
                            <div className="cs-video_block_bg cs-bg cs-zoom_item" style={{backgroundImage: "url('/img/gamerholic.png')"}}></div>
                        </div>
                        <div className="cs-play_btn cs-center">
                            <svg width="28" height="33" viewBox="0 0 28 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.98474 0.457254C2.24375 -0.616351 0 0.63608 0 2.68148V30.3185C0 32.3639 2.24375 33.6164 3.98474 32.5427L26.3932 18.7242C28.0485 17.7034 28.0485 15.2966 26.3932 14.2758L3.98474 0.457254Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        </a>
                    </div>
                </div>
            </div>

                <div className="cs-height_70 cs-height_lg_40"></div>
                <div className="container">
                <div className="cs-cta cs-style1 cs-bg">
                <div className="cs-cta_img">
                <Image
                        src="/img/web3.jpeg"
                        alt="Image"
                        className="cs-zoom_item"
                        width='460'
                        height='460'
                        style={{ borderRadius: '5px',boxShadow: '0px 0px 10px 0px #000' }} 
                    />                         
                    </div>
                <div className="cs-cta_right">
                <h2 className="cs-cta_title" style={{fontFamily: 'Comfortaa'}}>Web 3 = Web Us <br/> Art, Text, Music, Gaming, Culture, History, Society, Ai</h2>
                <div className="cs-cta_subtitle" style={{fontFamily: 'Comfortaa', lineHeight:'39px'}}>We believe text based NFTs will be as indemand as art nfts.<br/> We believe Ai will trade more nfts than humans.<br/>We believe every nft has value. <br/>We believe everything you create has the opportunity for value.<br/>
                We believe web 3 music will transform a predatory industry.<br/> We believe any character based nft can be used in a video game.</div>
                </div>
                </div>
                </div>
                <div className="cs-height_95 cs-height_lg_70"></div>
                
                {/* <div className="container">
                    <h2 className="cs-section_heading cs-style1 text-center">Meet Our Team</h2>
                    <div className="cs-height_45 cs-height_lg_45"></div>
                
                </div> */}
            
            {isVideoModalOpen &&  (
            <Modal onClose={handleVideoModal} title="Gamerholic">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                    Our founder Ibrahym 0x, (AKA Victor Blockchain), launched the very 1st crypto for video games "Gamerholic" in 2014.
                    He also has a passion for music, not only is he the 1st rapper to perform at the bitcoin conference, he also encrypts
                    bitcoin in his lyrics. 
                </p>
                <div className="text-center">
                    <div className="embed-responsive embed-responsive-16by9">
                        <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/Zvb_S-GnYtk?si=JhUgyv6a_aFsVUDs" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </div>
                </div>

                <div className="cs-height_20 cs-height_lg_20"></div>
              
              </div>
            </Modal>
            )}
    </>


    )
}
    export default About;