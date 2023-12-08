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

const SideOperate = ({labelInfo}:any) => {
    const router = useRouter();
    const { sdk, connected, connecting, provider, chainId }:any = useSDK();  
    const { account, setAccount} = useUser();
    const currentRoute = router.pathname;
    const routeParts = currentRoute.split('/');
    const lastPart = routeParts[routeParts.length - 1];
    const [_showSide, setShowSide]:any = useState(false)
    const { dataArray }:any = labelInfo;
    const [_image, setImage]:any = useState('')
    const [isAddingModalOpen, setAddingModalOpen]:any = React.useState(false)
    const [isRolesModalOpen, setRolesModalOpen]:any = React.useState(false)
    const [isSettingsModalOpen, setSettingsModalOpen]:any = React.useState(false)
    const [isLicenseModalOpen, setLicenseModalOpen]:any = React.useState(false)
    
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
  
    function handleAddingModal(event:any) {
        event.preventDefault();

        if(isAddingModalOpen){
            setAddingModalOpen(false);
        }else{
            setAddingModalOpen(true);
        }
      }
      function handleSettingsModal(event:any) {
        event.preventDefault();
        
        if(isSettingsModalOpen){
            setSettingsModalOpen(false);
        }else{
            setSettingsModalOpen(true);
        }
      }
      function handleRolesModal(event:any) {
        event.preventDefault();
        
        if(isRolesModalOpen){
            setRolesModalOpen(false);
        }else{
            setRolesModalOpen(true);
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
                  <a href="#" onClick={handleAddingModal}>
                        <i className="mdi mdi-help-circle-outline"></i>
                        <span>Adding Operators</span>
                        </a>
                    </li>
                    <li>
                    <a href="#" onClick={handleSettingsModal}>
                        <i className="mdi mdi-help-circle-outline"></i>
                        <span>Operator Settings</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={handleRolesModal}>
                        <i className="mdi mdi-help-circle-outline"></i>
                        <span>Operator Roles</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={handleLicenseModal}>
                        <i className="mdi mdi-help-circle-outline"></i>
                        <span>Operator License</span>
                        </a>
                    </li>

                    </ul>
                </div>
              </div>                  
                )}
            {isAddingModalOpen &&  (
            <Modal onClose={handleAddingModal} title="Adding Operators">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                    To add an operator, 1st mint an operators license. Then send the license to the address of the operator you want to add.
                    Lastly, click add opertor to complete the process.               
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {isSettingsModalOpen &&  (
            <Modal onClose={handleSettingsModal} title="Operator Settings">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                    Adjust the withdraw settings, role or license expiration of your operators.                 
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {isRolesModalOpen &&  (
            <Modal onClose={handleRolesModal} title="Operator Roles">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                    Edit the role of your operator. Role ID #1, is reserved for super operators. A super operator is allowed to add other operators.                
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        {isLicenseModalOpen &&  (
            <Modal onClose={handleLicenseModal} title="Operator License">
              <div className="cs-single_post">
                <p className="text-center" style={{color:'#000', lineHeight:'44px', fontFamily: 'Comfortaa'}}>
                    An operator license is a renewable license you must mint and send to your label operators.                 
                </p>
                <div className="cs-height_20 cs-height_lg_20"></div>
              </div>
            </Modal>
        
        )}
        </>
    )
}
export default SideOperate;