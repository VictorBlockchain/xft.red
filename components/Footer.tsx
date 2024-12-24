import React, {useEffect, useState} from 'react'
import Modal from './Modal';
import Link from 'next/link'

const Footer = () => {
    const [isLabelModalOpen, setLabelModalOpen]:any = React.useState(false)
    const [isOperatorsModalOpen, setOperatorsModalOpen]:any = React.useState(false)
    const [isLicenseModalOpen, setLicenseModalOpen]:any = React.useState(false)
    const [isWalletModalOpen, setWalletModalOpen]:any = React.useState(false)
    const [isUseModalOpen, setUseModalOpen]:any = React.useState(false)
    const [isBagModalOpen, setBagModalOpen]:any = React.useState(false)
    const [isLockModalOpen, setLockModalOpen]:any = React.useState(false)
    
    function handleLabelModal(event:any) {
        event.preventDefault();
        
        if(isLabelModalOpen){
            setLabelModalOpen(false);
        }else{
            setLabelModalOpen(true);
        
        }
      }
      function handleOperatorModal(event:any) {
        event.preventDefault();

        if(isOperatorsModalOpen){
            setOperatorsModalOpen(false);
        }else{
            setOperatorsModalOpen(true);
        }
      }
      function handleLicenseModal(event:any) {
        event.preventDefault();

        if(isLicenseModalOpen){
            setLicenseModalOpen(false);
        }else{
            setLicenseModalOpen(true);
        }
      }
      function handleWalletModal(event:any) {
        event.preventDefault();

        if(isWalletModalOpen){
            setWalletModalOpen(false);
        }else{
            setWalletModalOpen(true);
        }
      }
      function handleUseModal(event:any) {
        event.preventDefault();

        if(isUseModalOpen){
            setUseModalOpen(false);
        }else{
            setUseModalOpen(true);
        }
      }
      function handleBagModal(event:any) {
        event.preventDefault();

        if(isBagModalOpen){
            setBagModalOpen(false);
        }else{
            setBagModalOpen(true);
        }
      }
      function handleLockModal(event:any) {
        event.preventDefault();

        if(isLockModalOpen){
            setLockModalOpen(false);
        }else{
            setLockModalOpen(true);
        }
      }

    return(
        <>
        <div className="cs-height_100 cs-height_lg_70"></div>
        <footer className="cs-footer cs-style1">
            <div className="cs-footer_bg"></div>
            <div className="cs-height_100 cs-height_lg_60"></div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                    <div className="row">
                    <div className="col-lg-4 col-sm-4">
                    <div className="cs-footer_widget">
                    <h2 className="cs-widget_title" style={{fontFamily: 'Comfortaa'}}>Labels</h2>
                    <ul className="cs-widget_nav">
                    <li style={{fontFamily: 'Comfortaa'}}><Link href="#" onClick={handleLabelModal}>Whats A Label?</Link></li>
                    <li style={{fontFamily: 'Comfortaa'}}><Link href="#" onClick={handleOperatorModal}>Label Operators</Link></li>
                    <li style={{fontFamily: 'Comfortaa'}}><Link href="#" onClick={handleLicenseModal}>Label License</Link></li>
                    <li style={{fontFamily: 'Comfortaa'}}><Link href="#" onClick={handleWalletModal}>Label Wallet</Link></li>
                    <li style={{fontFamily: 'Comfortaa'}}><Link href="#" onClick={handleUseModal}>Use Cases</Link></li>
                    </ul>
                    </div>
                    </div>
                    <div className="col-lg-4 col-sm-4">
                    <div className="cs-footer_widget">
                    <h2 className="cs-widget_title" style={{fontFamily: 'Comfortaa'}}>Vaults</h2>
                    <ul className="cs-widget_nav">
                    <li style={{fontFamily: 'Comfortaa'}}><Link href="#" onClick={handleBagModal}>What&apos;s A Vault</Link></li>
                    <li style={{fontFamily: 'Comfortaa'}}><Link href="#" onClick={handleLockModal}>Time Lock Vaults</Link></li>
                    </ul>
                    </div>
                    </div>
                    <div className="col-lg-4 col-sm-4">
                    <div className="cs-footer_widget">
                    <h2 className="cs-widget_title" style={{fontFamily: 'Comfortaa'}}>Company</h2>
                    <ul className="cs-widget_nav">
                    <li style={{fontFamily: 'Comfortaa'}}><Link href="/about">About Us</Link></li>
                    <li style={{fontFamily: 'Comfortaa'}}><Link href="https://discord.gg/RFu8Yj4YYk">Discord</Link></li>
                    <li style={{fontFamily: 'Comfortaa'}}><Link href="https://bscscan.com/address/0xaf73c709e66fe339bee5608477f9e7a589acaec5#code" target='_blank'>Contract</Link></li>
                    </ul>
                    </div>
                    </div>
                    </div>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                    <div className="cs-footer_widget">
                    <h2 className="cs-widget_title" style={{fontFamily: 'Comfortaa'}}>Subscribe to our newsletter.</h2>
                    <form className="cs-footer_newsletter">
                    <input type="text" placeholder="Enter Your Email" className="cs-newsletter_input" />
                    <button className="cs-newsletter_btn">
                    <svg width="25" height="16" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.7014 9.03523C25.0919 8.64471 25.0919 8.01154 24.7014 7.62102L18.3374 1.25706C17.9469 0.866533 17.3137 0.866533 16.9232 1.25706C16.5327 1.64758 16.5327 2.28075 16.9232 2.67127L22.5801 8.32812L16.9232 13.985C16.5327 14.3755 16.5327 15.0087 16.9232 15.3992C17.3137 15.7897 17.9469 15.7897 18.3374 15.3992L24.7014 9.03523ZM0.806641 9.32812H23.9943V7.32812H0.806641V9.32812Z" fill="white"></path>
                    </svg>
                    </button>
                    </form>
                    <div className="cs-footer_social_btns">
                    <Link href="https://twitter.com/xftdotred" target="_blank"><i className="fab fa-twitter fa-fw"></i></Link>
                    <Link href="https://github.com/VictorBlockchain/xft.red" target='_blank'><i className="fab fa-github fa-fw"></i></Link>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
            <div className="cs-height_60 cs-height_lg_20"></div>
            <div className="cs-footer_bottom">
            <div className="container">
            <div className="cs-footer_separetor"></div>
            <div className="cs-footer_bottom_in">
            <div className="cs-copyright" style={{fontFamily: 'Comfortaa'}}>Copyright 2024 Maji.app</div>
            <ul className="cs-footer_menu">
            <li><Link href="/privacy" style={{fontFamily: 'Comfortaa'}}>Privacy Policy</Link></li>
            <li><Link href="/agreement" style={{fontFamily: 'Comfortaa'}}>Terms &amp; Condition</Link></li>
            </ul>
            </div>
            </div>
            </div>
        </footer>
        {isLabelModalOpen &&  
                    <Modal onClose={handleLabelModal} title="What's a label?">
                        <div className="cs-single_post">
                            <p style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                            Labels are akin to collections, but they offer more. Imagine wanting to invite global artists to contribute to your &apos;funky jazz&apos; collection — how would you manage that? This is one of the challenges that labels solve through label licensing.

Consider scenarios where your graphic artist should mint an NFT into your collection when ready. Here&apos;s where operator licenses come into play, neatly compartmentalizing your organization (team) and curation tasks. In essence, labels streamline both team collaboration and curation processes.
                            </p>
                        
                        </div>
                    </Modal>
                }
        {isOperatorsModalOpen &&  (
            <Modal onClose={handleOperatorModal} title="Label Operators">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                Picture this: you&apos;re a celebrity, and your graphic artist or marketer contacts you for every mint. What if they could independently mint and sell on your behalf whenever necessary? Label operators provide the autonomy your team members need for more efficient NFT management, enabling them to excel in the NFT space
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {isLicenseModalOpen &&  (
            <Modal onClose={handleLicenseModal} title="Label License">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                A Label License presents an innovative solution to the NFT licensing challenge. Interested in having creatives contribute their work to your label? Provide or sell them a renewable license. Looking to grant collectors permission to use your intellectual property? Offer or sell them a renewable license for the privilege.

Whether you aspire to curate exceptional art from local talents or run a themed label, like &apos;psychedelic art&apos;, you can offer or sell licenses to select artists, empowering them to showcase and sell their creations under your label.
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {isWalletModalOpen &&  (
            <Modal onClose={handleWalletModal} title="Label Wallet">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                Your unique label (1 of 1) operates as a Smart NFT. It comes equipped with an embedded smart contract designed to secure the proceeds from NFTs sold under your label. Additionally, it manages commissions earned from licensed NFT sales under your label.

Need to distribute funds to your team members? Effortlessly configure withdrawal permissions, specifying who can withdraw, the allowed amounts, and the frequency.
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {isBagModalOpen &&  (
            <Modal onClose={handleBagModal} title="Vault">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                Empower your XFT with a Vault — a smart contract attached to your unique (1 of 1) &apos;NFT&apos;. Elevate its value by storing diverse assets such as wrapped BTC, wrapped ETH, DeFi tokens, other XFT&apos;s, and more within its Vault. Introduce captivating buyer incentives, like intricate puzzles featuring vaults within bags within vaults, enhancing your XFT&apos;s dynamism, enjoyment, and ensuring its resale value.                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
                {isLockModalOpen &&  (
            <Modal onClose={handleLockModal} title="Time Lock Vault">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                Boost the value of your XFT by securing assets within its vault. Imagine locking 0.01 wrapped BTC in your XFT&apos;s vault for five years — how much would its current selling price reflect this added value?                 </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        </>
        
    )
}
export default Footer;