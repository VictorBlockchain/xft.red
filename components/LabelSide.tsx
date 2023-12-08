// CustomSlider.js
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';
import { useUser } from './UserContext';
import { useRouter } from 'next/router';
import { setWalletProvider } from '../services/web3Service';
const BLANK = '0x0000000000000000000000000000000000000000';

const SideLabel = ({labelInfo}:any) => {
    const router = useRouter();
    const { sdk, connected, connecting, provider, chainId }:any = useSDK();  
    const { account, setAccount} = useUser();
    const currentRoute = router.pathname;
    const routeParts = currentRoute.split('/');
    const lastPart = routeParts[routeParts.length - 1];
    const [_showSide, setShowSide]:any = useState(false)
    const { dataArray }:any = labelInfo;
    const [_image, setImage]:any = useState('')
    const [isWrapModalOpen, setWrapModalOpen]:any = React.useState(false)
    const [isDisplayModalOpen, setDisplayModalOpen]:any = React.useState(false)

    useEffect(() => {
      if(account && connected){
        setWalletProvider(provider);
      }
      }, [connected,account]);

    const navLinks = [
      { href: '/profile/'+account, label: 'Label Info', icon:'fa fa-user' },
      { href: '/profile/nfts', label: 'Operators', icon:'fa fa-cogs' },
      { href: '/mint', label: 'Wallet' , icon:'fa fa-btc'},
      { href: '/wallet', label: 'Owner', icon:'fa fa-user' },
      { href: '/logout', label: 'Logout', icon:'fa fa-user' }
    ];
    
    useEffect(()=>{
      if(router.asPath && labelInfo){
        if(labelInfo.image){
            setImage(labelInfo.image)
            // console.log(labelInfo.image)    
        }
      }
    },[router.asPath, labelInfo])
    
    useEffect(()=>{
        if(_image){
            console.log(_image)
            setShowSide(true)
        }
    },[_image])
  
    function handleWrapModal(event:any) {
        event.preventDefault();

        if(isWrapModalOpen){
            setWrapModalOpen(false);
        }else{
            setWrapModalOpen(true);
        }
      }
      function handleDisplayModal(event:any) {
        event.preventDefault();
        
        if(isDisplayModalOpen){
            setDisplayModalOpen(false);
        }else{
            setDisplayModalOpen(true);
        }
      }
    return(
        <>  
                {_showSide && _image && (
                <div className="cs-profile_left">
                <div className="cs-profile_sidebar cs-white_bg cs-box_shadow">
                  <div className="cs-profile_info">
                    <div className="cs-profile_pic">
                      <img
                      src={_image}
                      alt="label"
                      className="cs-zoom_item"
                      width='200'
                      height='200'
                      // onLoad={handleImageLoad}
                      />
                    </div>
                    <h5 className="cs-profile_title" style={{fontFamily: 'Comfortaa'}}>{labelInfo.name}</h5>
                  
                  </div>
                
                  <div className="cs-height_30 cs-height_lg_30"></div>
                  <ul className="cs-profile_nav cs-mp0">
                  <li>
                        <a href="#">
                        <i className="mdi mdi-checkbox-marked-circle-outline"></i>
                        <span>Registration</span>
                        </a>
                    </li>
                    <li>
                        <a href={`/operators/${labelInfo.id}/${BLANK}`}>
                        <i className="mdi mdi-atom"></i>
                        <span>Operators</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={handleWrapModal}>
                        <i className="mdi mdi-help-circle-outline"></i>
                        <span>Wraps</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={handleDisplayModal}>
                        <i className="mdi mdi-help-circle-outline"></i>
                        <span>On Display</span>
                        </a>
                    </li>

                    </ul>
                </div>
              </div>                  
                )}
            {isWrapModalOpen &&  (
            <Modal onClose={handleWrapModal} title="Wraps">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                Wraps are NFTs from external contracts that have been wrapped under this label. For example, an NFT from the ethreum network, wrapped to this label or an NFT from a collection minted on another contract, wrapped into a smart nft under this label.                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {isDisplayModalOpen &&  (
            <Modal onClose={handleDisplayModal} title="On Display">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                    These are NFTs linked to this label that are currently on display                   
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        </>
    )
}
export default SideLabel;