// CustomSlider.js
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import Modal from './Modal';
import { useSDK } from '@metamask/sdk-react';
import Web3 from 'web3';
import { useUser } from './UserContext';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const NFTEA_BRIDGE = '0xf637fd72f0f9582C442E2bC193af1e8ecc72F374';
const bridgeABI = require('./bridge.json');

const CONTRACT_ADDRESS = '0xAF73c709e66fe339beE5608477F9e7A589acAEC5';
const contractABI = require('./ahp.json');

const Carousel = () => {
    const { sdk, connected, connecting, provider, chainId }:any = useSDK();  
    const [isMintModalOpen, setIsMintModalOpen] = useState(false);
    const [price, setPrice]:any = useState(0);
    const [gas, setGas]:any = useState(0);
    const [quantity, setQuantity]:any = useState(1);
    const { user, setUser } = useUser();
    
    useEffect(()=>{
      if(user){
        setMintPrice()
      }
    },[isMintModalOpen, user])

    const handleImageLoad = (event:any) => {
        // Your custom logic for image load event
       // console.log('Image loaded:', event.target);
      };
    
      const setMintPrice = async () => {
        const w3 = new Web3(provider);   
        const gasPrice = await w3.eth.getGasPrice();
        const gasPriceInGwei = parseFloat(w3.utils.fromWei(gasPrice, 'gwei'));
        const gasPriceLimited = gasPriceInGwei.toLocaleString('fullwide', { maximumFractionDigits: 8 });
        console.log(`Gas Price: ${gasPriceLimited} Gwei`);
        getMintPrice()
        .then((mintPrice:any) => {
          setPrice(mintPrice/1000000000000000000)
          setGas(gasPriceInGwei)
            // start(w3)
        })
    
    }

      const getMintPrice = () => {
        return new Promise(async(resolve, reject) => {
              
              const w3 = new Web3(provider);
              let contract = await new w3.eth.Contract(contractABI, CONTRACT_ADDRESS);
                contract.methods.MINT_PRICE().call()
                .then((mintPrice:any) => {
                  resolve(mintPrice);
                })
                .catch((error:any) => {
                  reject(error);
                });
          //
  
        });
      }
      
      
      const handleMint = async (event:any) => {
        event.preventDefault();
        if (user) {
          
          const w3 = new Web3(provider);
          const accounts = await w3.eth.getAccounts();
          getMintPrice() 
          .then(async(mintPrice:any) => {
            
            const weiAmount = w3.utils.toWei(mintPrice.toString(), 'ether');
            const gasPrice = await w3.eth.getGasPrice();
            let contract = new w3.eth.Contract(contractABI, CONTRACT_ADDRESS);
            contract.methods.mintTo(accounts[0],quantity).send({ from: accounts[0],value: mintPrice, gasPrice: gasPrice,
              gasLimit: 7600000})
              .on('receipt', (receipt:any) => {
                console.log(`minted successfully!`);
                console.log(receipt);
              })
              .on('error', (error:any) => {
                console.error(`Failed to mint:`);
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(`Failed to get mint price:`);
            console.error(error);
          });
        
        }
      }

      function handleOpenMintModal() {
        setIsMintModalOpen(true);
      }
      
      function handleCloseMintModal() {
        setIsMintModalOpen(false);
      }
    
    const settings = {
      centerMode: true,
      infinite: true,
      centerPadding: '120px',
      slidesToShow: 2,
      speed: 500,
      responsive: [
        {
          breakpoint: 320, // Adjust this value based on your design
          settings: {
            slidesToShow: 1,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          },
        },
        {
            breakpoint: 375, // Adjust this value based on your design
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: false
            },
          },
          {
            breakpoint: 414, // Adjust this value based on your design
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              infinite: true,
              dots: false
            },
          },
        {
            breakpoint: 480, // Adjust this value based on your design
            settings: {
              slidesToShow: 1,
            },
          },
        {
            breakpoint: 768, // Adjust this value based on your design
            settings: {
              slidesToShow: 1,
            },
          },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 3,
          },
        },
      ],
      prevArrow: <CustomPrevArrow />,
      nextArrow: <CustomNextArrow />
    };
  
    const slides = [
      {
        id: 1,
        content: (
          <div className="cs-card cs-style4 cs-box_shadow cs-white_bg" style={{ width: 300 }}>
            <span className="cs-card_like cs-primary_color">
            <i className="fab fa-bolt"><small>SPEED:</small></i>
                3K
                </span>
                <a href="explore-details.html" className="cs-card_thumb cs-zoom_effect">
                <Image
                    src="/img/pets/76.png"
                    alt="Image"
                    className="cs-zoom_item"
                    width='600'
                    height='600'
                    onLoad={handleImageLoad}
                />
                </a>
                <div className="cs-card_info" style={{marginTop: '9px'}}>

                <h3 className="cs-card_title"><a href="explore-details.html">African Hyena Pets</a></h3>
                <div className="cs-card_price">#: <b className="cs-primary_color">76</b></div>
                <hr/>
                <div className="cs-card_footer">
                    <span className="cs-card_btn_1" data-modal="#history_1">
                    <i className="fab fa-btc"></i>
                    0.082 BNB
                    </span>
                    <span className="cs-card_btn_2" onClick={handleOpenMintModal}><span>Mint Yours</span></span>
                </div>
                </div>
        </div>
        ),
      },
      {
        id: 2,
        content: (
            <div className="cs-card cs-style4 cs-box_shadow cs-white_bg" style={{ width: 300 }}>
                <span className="cs-card_like cs-primary_color">
                <i className="fab fa-bolt"><small>POWER:</small></i>
                    15K
                    </span>
                    <a href="explore-details.html" className="cs-card_thumb cs-zoom_effect">
                    <Image
                        src="/img/pets/28.png"
                        alt="Image"
                        className="cs-zoom_item"
                        width='200'
                        height='200'
                        onLoad={handleImageLoad}
                    />
                    </a>
                    <div className="cs-card_info" style={{marginTop: '9px'}}>
                    <h3 className="cs-card_title"><a href="explore-details.html">African Hyena Pets</a></h3>
                    <div className="cs-card_price">#: <b className="cs-primary_color">28</b></div>
                    <hr/>
                    <div className="cs-card_footer">
                        <span className="cs-card_btn_1" data-modal="#history_1">
                        <i className="fab fa-btc"></i>
                        0.082 BNB
                        </span>
                        <span className="cs-card_btn_2" onClick={handleOpenMintModal}><span>Mint Yours</span></span>
                    </div>
                    </div>
            </div>
        ),
      },
      {
        id: 3,
        content: (
            <div className="cs-card cs-style4 cs-box_shadow cs-white_bg" style={{ width: 300 }}>
            <span className="cs-card_like cs-primary_color">
            <i className="fab fa-bolt"><small>FLIGHT:</small></i>
                30K
                </span>
                <a href="explore-details.html" className="cs-card_thumb cs-zoom_effect">
                <Image
                    src="/img/pets/107.png"
                    alt="Image"
                    className="cs-zoom_item"
                    width='200'
                    height='200'
                    onLoad={handleImageLoad}
                />
                </a>
                <div className="cs-card_info" style={{marginTop: '9px'}}>

                <h3 className="cs-card_title"><a href="explore-details.html">African Hyena Pets</a></h3>
                <div className="cs-card_price">#: <b className="cs-primary_color">107</b></div>
                <hr/>
                <div className="cs-card_footer">
                    <span className="cs-card_btn_1" data-modal="#history_1">
                    <i className="fab fa-btc"></i>
                    0.082 BNB
                    </span>
                    <span className="cs-card_btn_2" onClick={handleOpenMintModal}><span>Mint Yours</span></span>
                </div>
                </div>
        </div>
        ),
      },
      {
        id: 4,
        content: (
            <div className="cs-card cs-style4 cs-box_shadow cs-white_bg" style={{ width: 300 }}>
            <span className="cs-card_like cs-primary_color">
            <i className="fab fa-bolt"><small>ATTACK:</small></i>
                35K
                </span>
                <a href="explore-details.html" className="cs-card_thumb cs-zoom_effect">
                <Image
                    src="/img/pets/435.png"
                    alt="Image"
                    className="cs-zoom_item"
                    width='200'
                    height='200'
                    onLoad={handleImageLoad}
                />
                </a>
                <div className="cs-card_info" style={{marginTop: '9px'}}>
                
                <h3 className="cs-card_title"><a href="explore-details.html">African Hyena Pets</a></h3>
                <div className="cs-card_price">#: <b className="cs-primary_color">435</b></div>
                <hr/>
                <div className="cs-card_footer">
                    <span className="cs-card_btn_1" data-modal="#history_1">
                    <i className="fab fa-btc"></i>
                    0.082 BNB
                    </span>
                    <span className="cs-card_btn_2" onClick={handleOpenMintModal}><span>Mint Yours</span></span>
                </div>
                </div>
        </div>
        ),
      },
    ];
  
    return (
        <>
        <Slider {...settings}>
            {slides.map((slide) => (
            <div key={slide.id} className="slick-slide">
                {slide.content}
            </div>
            ))}
        </Slider>  
        {isMintModalOpen &&  
            <Modal onClose={handleCloseMintModal} title="Mint Yours">
            <form onSubmit={handleMint}>.            
              <ul>
                  <li>
                  <span>Price</span>
                  <b>{price} BNB</b>
                  </li>
                  <li>
                  <span>Gas</span>
                  <b>$6 or less</b>
                  </li>
              </ul>
              <div className="cs-height_20 cs-height_lg_20"></div>
              <div className="cs-bid_form_head">
                  <span>Max Quantity 6</span>
                  <span>2200<span className="cs-accent_color"> Total Tribe 1 Pets</span></span>
              </div>
              <div className="cs-bid_input_group2 text-center">
                  <input type="text" className="cs-bid_value" min="1" max="6" placeholder="mint how many?" value={quantity} onChange={(event) => setQuantity(event.target.value)} required/>
              </div>
              <div className="cs-height_25 cs-height_lg_25"></div>
              <ul>
                  <li>
                  <span>Service fee 0%</span>
                  <b>0 BNB</b>
                  </li>
              </ul>
              <div className="cs-height_20 cs-height_lg_20"></div>
              <p className="text-center">If you were told by a friend, he/she will get 20% of your mint price</p>
              <div className="cs-height_25 cs-height_lg_25"></div>
              
              <button type="submit" className="cs-btn cs-style1 cs-btn_lg w-100"><span>Mint</span></button>
            </form>
            </Modal> }      
        </>
    
      
    );
  };
  

  const CustomPrevArrow = (props:any) => {
    const { className, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        {/* Your custom previous arrow content */}
        &lt;
      </div>
    );
  };
  
  const CustomNextArrow = (props:any) => {
    const { className, onClick } = props;
    return (
      <div className={className} onClick={onClick}>
        {/* Your custom next arrow content */}
        &gt;
      </div>
    );
  };
  export default Carousel;

