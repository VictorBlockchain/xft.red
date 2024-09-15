import React, { Component } from 'react'
import { useRouter } from 'next/router';
import { useEffect,useState} from 'react'
import { useSDK } from '@metamask/sdk-react';
import Link from 'next/link'
import { preloader } from '../utils/main';
import { smoothScroll } from '../utils/main';
import { dynamicBackground } from '../utils/main';
import { useUser } from './UserContext';
import Image from 'next/image';

import Modal from './Modal';
interface NavProps {
  handleConnect: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}
const Nav = ({}) => {

    const router = useRouter();
    const { sdk, connected, connecting, provider, chainId }:any = useSDK();  
    const { account, setAccount } = useUser();
    const [isChainModalOpen, setIsChainModalOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        // Call the preloader function
        //preloader();
        smoothScroll();
        dynamicBackground();
      
      }, []);
    
    // useEffect(()=>{
    //       $('.cs-tabs.cs-fade_tabs .cs-tab_links a').on('click', function (e) {
    //       var currentAttrValue = $(this).attr('href');
    //       $('.cs-tabs ' + currentAttrValue)
    //         .fadeIn(400)
    //         .siblings()
    //         .hide();
    //       $(this).parents('li').addClass('active').siblings().removeClass('active');
    //       e.preventDefault();
    //     });
    // }, [])

    useEffect(() => {
        // Ensure that the component is mounted before using jQuery
        $('.cs-nav').append('<span class="cs-munu_toggle"><span></span></span>');
        $('.menu-item-has-children').append(
          '<span class="cs-munu_dropdown_toggle"></span>'
        );
    
        $('.cs-munu_toggle').on('click', function () {
          $(this)
            .toggleClass('cs-toggle_active')
            .siblings('.cs-nav_list')
            .slideToggle();
        });
    
        // Clean up event listeners when the component is unmounted
        return () => {
          $('.cs-munu_toggle').off('click');
        };
      }, []); // Empty dependency array ensures this effect runs once after the initial render
    
      useEffect(() => {
        const handleSearchToggle = () => {
          $('.cs-search_wrap').toggleClass('active');
        };
    
        // Attach the click event after component is mounted
        $('.cs-mobile_search_toggle').on('click', handleSearchToggle);
    
        // Clean up event listener when the component is unmounted
        return () => {
          $('.cs-mobile_search_toggle').off('click', handleSearchToggle);
        };
      }, []); 
      //0x38
      //0x61 testnet
      //0x539 truffle
      
      useEffect(() => {
        let user_ = localStorage.getItem("account")
        // alert(chainId)
        if (user_ && connected) {
            sdk?.connect()
            .then((account:any)=>{
                if(account?.[0]){
                    if(chainId!='0x38'){
                        setIsChainModalOpen(true)
                    }else{                        
                    let addy = account?.[0]
                    localStorage.setItem("account", addy)
                    setAccount(addy);   
                    setIsChainModalOpen(false)
                    }
                }else{
                    console.log('no account')
                }
            }).catch((error:any) => {
              localStorage.setItem("account", '');
              setTimeout(() => {
                  window.location.reload();
              }, 2000);
          });
        }
      }, [provider, connected]);

      const handleConnect = (e:any) => {
        e.preventDefault(); // Prevent default link behavior
        try {
          sdk?.connect()
          .then((accounts:any)=>{
            // console.log(accounts)
            localStorage.setItem("account", accounts?.[0])
            setAccount(accounts?.[0]);

          }).catch((error:any) => {
            console.log(error.message)
            localStorage.setItem("account", '');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        });
      
      } catch (error) {
        console.error(error);
      }
    };
      // const handleConnect = async (event:any) => {
      //   try {
            
      //       event.preventDefault();
      //       sdk?.connect()
      //       .then((accounts:any)=>{
      //         // console.log(accounts)
      //         localStorage.setItem("account", accounts?.[0])
      //         setAccount(accounts?.[0]);
  
      //       }).catch((error:any) => {
      //         console.log(error.message)
      //         localStorage.setItem("account", '');
      //         setTimeout(() => {
      //             window.location.reload();
      //         }, 2000);
      //     });
        
      //   } catch (error) {
      //     console.error(error);
      //   }
      // };
      const handleChange = (e:any) => {
        setQuery(e.target.value);
      };
      const handleSubmit = (e:any) => {
        e.preventDefault();
        router.push(`/search/${encodeURIComponent(query.toLowerCase())}`);
      };

      function handleCloseChainModal() {
        setIsChainModalOpen(false);
      }
      function handleOpenSellModal() {
        setIsSellModalOpen(true);
      }
      function handleCloseSellModal() {
        setIsSellModalOpen(false);
      }
      const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };
    return(
        <>
            <header className="cs-site_header cs-style1 cs-sticky-header cs-white_bg">
                <div className="cs-main_header">
                <div className="container-fluid">
                <div className="cs-main_header_in">
                <div className="cs-main_header_left">

                <Link className="cs-site_branding" href="/">
                    <span className="animated-text" style={{fontFamily: "'Rubik Lines',systen-ui", marginLeft:'10px', marginTop:'3px'}}>xFT.red</span>
                </Link>
                </div>
                <div className="cs-main_header_right">
                {account && (
                    <div className="cs-search_wrap">
                        <form action="#" className="cs-search" onSubmit={handleSubmit}>
                            <input type="text" className="cs-search_input" placeholder="search labels"  value={query} onChange={handleChange}/>
                                <button className="cs-search_btn">
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.16667 16.3333C12.8486 16.3333 15.8333 13.3486 15.8333 9.66667C15.8333 5.98477 12.8486 3 9.16667 3C5.48477 3 2.5 5.98477 2.5 9.66667C2.5 13.3486 5.48477 16.3333 9.16667 16.3333Z" stroke="currentColor" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17.5 18L13.875 14.375" stroke="currentColor" strokeOpacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                        </form>
                    </div>
                )}
                <div className="cs-nav_wrap">
                <div className="cs-nav_out">
                <div className="cs-nav_in">
                <div className="cs-nav">
                <ul className="cs-nav_list">
                {/* <li>
                  <Link href="https://pancakeswap.finance/swap?outputCurrency=0xb4668238Acf0314A7b4e153368e479fCd2E09831" target='_blank'>Buy XFT</Link>
                </li> */}
                <li><Link href="/swap/0/0">xSwap</Link></li>
                <li><Link href="/xmash/0">xMash</Link></li>
                {/* <li><Link href="/esports/0">xSports</Link></li> */}
                
                <li>
                  <Link href="#" onClick={handleOpenSellModal}>Display</Link>
                </li>
                {/* <li><Link href="/loans" onClick={handleOpenSellModal}>Loans</Link></li> */}
                <li><Link href="https://hyenapet.com">Hyena Pets</Link></li>
                </ul>
                <span className="cs-munu_toggle"><span></span></span>
                </div>
                </div>
                </div>
                </div>
                <div className="cs-header_btns_wrap">
                <div className="cs-header_btns">
                {account && (
                  <div className="cs-header_icon_btn cs-center cs-mobile_search_toggle">
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.16667 16.3333C12.8486 16.3333 15.8333 13.3486 15.8333 9.66667C15.8333 5.98477 12.8486 3 9.16667 3C5.48477 3 2.5 5.98477 2.5 9.66667C2.5 13.3486 5.48477 16.3333 9.16667 16.3333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 18L13.875 14.375" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                {!account && (
                  <div className="cs-header_icon_btn cs-center cs-mobile_search_toggle" onClick={handleConnect}>
                      <i className="fa fa-plug"></i>
                  </div>
                )}
                {!account && (
                    <Link href="#" className="cs-btn cs-style1" onClick={handleConnect}><span>Connect Wallet</span></Link>
                )}
                
                {account && (
                  <>
                    <div className="cs-toggle_btn cs-header_icon_btn cs-center">
                      <Link href={`/profile/${account}`}>
                      <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 15.75V14.25C15.5 13.4544 15.1839 12.6913 14.6213 12.1287C14.0587 11.5661 13.2956 11.25 12.5 11.25H6.5C5.70435 11.25 4.94129 11.5661 4.37868 12.1287C3.81607 12.6913 3.5 13.4544 3.5 14.25V15.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M9.5 8.25C11.1569 8.25 12.5 6.90685 12.5 5.25C12.5 3.59315 11.1569 2.25 9.5 2.25C7.84315 2.25 6.5 3.59315 6.5 5.25C6.5 6.90685 7.84315 8.25 9.5 8.25Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg></Link>
                    </div>
                    <Link href="/mint" className="cs-btn" style={{ color: isHovered ? '#fff' : '#fff', backgroundColor: isHovered ? 'purple' : '#000', borderRadius:'50px' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}><i className="fa fa-magic" aria-hidden="true" style={{color: isHovered ? '#fff' : '#fff', transition: 'color 0.3s',}}></i>{' '}Mint</Link>

                  </>
                )}
                {/* {user && (
                    <Link href="#" className="cs-btn cs-style1" style={{
                      background: 'inear-gradient(116.85deg, #FC466B 0%, #3F5EFB 100%)',
                    }}><span></span></Link>
                )} */}
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>
                </header>
                {isChainModalOpen &&  
                    <Modal onClose={handleCloseChainModal} title="Change Network">
                                <div className="cs-single_post">
                        <p>African Hyena Pets are minted in Binance Chain, please add or change your network to Binance Smart Chain in metamask<br/><br/>
                        </p>
                        <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}>Benefits Of Binance Chain</h4>
                        <ul>
                        <li>This is the network used by the most populous regions in the world</li>
                        <li>Much cheaper gas fees</li>
                        </ul>
                    </div>
                    </Modal>
                }
                {isSellModalOpen &&  
                    <Modal onClose={handleCloseSellModal} title="On Display">
                                <div className="cs-single_post">
                        <p style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>Don&apos;t want to sell? Then display your creations for all to see, your 1 of 1 gets TEA tokens in it&apos;s bag with each love!
                        </p>
                        <h4 className="text-center" style={{fontFamily: 'Comfortaa'}}>Get A Loan</h4>
                        <p style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>Get a loan on your creations based on the value of tokens in it&apos;s bag.</p>

                    </div>
                    </Modal>
                }
        </>
    )
}
    export default Nav;