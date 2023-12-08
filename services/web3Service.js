'use client';
import { useEffect } from 'react';
import Web3 from 'web3';
import dotenv from 'dotenv';
import { BigNumber } from 'bignumber.js';
import { toBN } from 'web3-utils';
import BN from 'bn.js';
import bagLogicABI from '../lib/contracts/baglogic.json';
import bagStorageABI from '../lib/contracts/bagstorage.json';
import fireABI from '../lib/contracts/fire.json';
import kettleABI from '../lib/contracts/kettle.json';
import mintABI from '../lib/contracts/minter.json';
import mintLogicABI from '../lib/contracts/mintlogic.json';
import mintStorageABI from '../lib/contracts/mintstorage.json';
import operatorLogicABI from '../lib/contracts/operatorlogic.json';
import operatorStorageABI from '../lib/contracts/operatorstorage.json';
import shopLogicABI from '../lib/contracts/shoplogic.json';
import shopStorageABI from '../lib/contracts/shopstorage.json';
import teaTokenABI from '../lib/contracts/NFTEA.json';
import teaPotABI from '../lib/contracts/teapot.json';
import bridgeABI from '../lib/contracts/bridge.json';
const NFTEA_BRIDGE = '0xf637fd72f0f9582C442E2bC193af1e8ecc72F374';

dotenv.config();
const teaPot = process.env.teaPot;
const mintLogic = process.env.mintLogic;
const shopStorage = process.env.shopStorage;
const shopLogic = process.env.shopLogic;
const teaToken = process.env.teaToken;
const bagStorage = process.env.bagStorage;
const bagLogic = process.env.bagLogic;
const operatorStorage = process.env.operatorStorage;
const operatorLogic = process.env.operatorLogic;
const mintStorage = process.env.mintStorage;
const mint = process.env.mint;
const kettle = process.env.kettle;
const fire = process.env.fire;
//const web3 = new Web3(Web3.givenProvider || 'http://localhost:9545');
let selectedProvider;
let web3; // Declare web3 as a global variable

let walletProvider; // Store the wallet provider reference
export function setWalletProvider(provider) {
  walletProvider = provider;
}
export function getWalletProvider() {
  if (!walletProvider) {
    throw new Error('Wallet provider is not set. Please call setWalletProvider(provider) before using getWalletProvider.');
  }
  
  return walletProvider;
}

const getWeb3 = () => {
  return new Promise(async(resolve, reject) => {
      let provider = getWalletProvider()
      web3 = new Web3(provider);
      // console.log(provider)
      resolve(web3)
  
  });
};


// export const servConnect = (selectedProvider) => {
//   return new Promise(async (resolve, reject) => {
//     // Check if WalletConnect provider is selected
//     if (selectedProvider === 'walletconnect') {
//       const provider = new WalletConnectProvider({
//         // infuraId:"fce816bb197a4ffa850322a0f94be155",
//         rpc: {
//             56: "https://bsc-dataseed1.binance.org",
//         },
//         network: 'binance',
//         chainId: 56,
//       });
//       try {
        
//         await provider.enable();
//         const sessionID = provider.wc._sessionStorage.storageId;
//         localStorage.setItem("walletconnectSession", sessionID);
//         selectedProvider = 'walletconnect';
//         setProviderPreference(selectedProvider);
      
//       } catch (error) {
//         reject(new Error('Failed to enable WalletConnect'));
//         return;
//       }
//       web3 = new Web3(provider);
//       try {
//         const accounts = await web3.eth.getAccounts();
//         localStorage.setItem("account", accounts[0]);
//         resolve(accounts[0]);
//       } catch (error) {
//         reject(error);
//       }
//     } else {
//       // Request account access if needed using MetaMask
//       if (window.ethereum) {
//         try {
//           await window.ethereum.request({ method: 'eth_requestAccounts' });
//           selectedProvider = 'metamask';
//           setProviderPreference(selectedProvider);
//         } catch (error) {
//           reject(new Error('User denied account access'));
//           return;
//         }
//       } else if (window.web3) {
//         // Legacy dapp browsers...
//         console.log('Legacy dapp browser detected');
//       } else {
//         // Non-dapp browsers...
//         console.log('Non-dapp browser detected');
//       }

//       // Create a Web3 instance using the MetaMask provider
//       web3 = new Web3(window.ethereum);

//       // Get the current account
//       try {
//         const accounts = await web3.eth.getAccounts();
//         localStorage.setItem("account", accounts[0]);
//         resolve(accounts[0]);
//       } catch (error) {
//         reject(error);
//       }
//     }
//   });
// };

// export const servDisconnect = () => {
//   return new Promise((resolve, reject) => {
//     if (getProviderPreference() === 'walletconnect') {
//       const provider = new WalletConnectProvider({
//         infuraId: "fce816bb197a4ffa850322a0f94be155",
//         rpc: {
//           56: "https://bsc-dataseed1.binance.org",
//         },
//         network: 'binance',
//         chainId: 56,
//       });

//       localStorage.removeItem("walletconnectSession");
//       localStorage.setItem('accoiunt', '');
//       provider.disconnect()
//         .then(() => {
//           web3 = null;
//           selectedProvider = null;
//           setProviderPreference('');
//           resolve('disconnected again');
//         })
//         .catch((error) => {
//           reject(error);
//         });
//     } else if (window.ethereum) {
//       setProviderPreference('');
//       web3 = null;
//       selectedProvider = null;
//       localStorage.setItem('account', '');
      
//       // window.ethereum
//       //   .disconnect()
//       //   .then(() => {
//       //     web3 = null;
//       //     selectedProvider = null;
//       //     setProviderPreference('');
//       //     resolve('disconnected');
//       //   })
//       //   .catch((error) => {
//       //     reject(error);
//       //   });
//     } else {
//       // Handle disconnection from other providers
//       web3 = null;
//       selectedProvider = null;
//       setProviderPreference('');
//       resolve('disconnected');
//     }
//   });
// };

// export const setProviderPreference = (provider) =>{
//   localStorage.setItem('providerPreference', provider);
// }

// export const getProviderPreference = () => {
//   return localStorage.getItem('providerPreference');
// }

// export const servAccount = async () => {
//   return new Promise((resolve, reject) => {
//     web3.eth.getAccounts((err, accounts) => {
//       if (err) {
//         reject(err);
//       } else {
//         const currentAccount = accounts[0];
//         resolve(currentAccount);
//       }
//     });
//   });
// };
function stringToUtf8Hex(string) {
  const utf8Bytes = new TextEncoder().encode(string);
  let hexString = "";
  for (let i = 0; i < utf8Bytes.length; i++) {
    const hex = utf8Bytes[i].toString(16);
    hexString += hex.length === 1 ? "0" + hex : hex;
  }
  return "0x" + hexString;
}
export const servFlames = async (account) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(fireABI.abi, fire);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setflames(["mintcontract","mintlogic","mintstorage","operatorlogic","operatorstorage","kettle","baglogic","bagstorage","marketing","shoplogic","shopstorage","teatoken","teapot","donate"],[mint,mintLogic,mintStorage,operatorLogic,operatorStorage,kettle,bagLogic,bagStorage,'0x6D1C6b1B52B74F614465D5bdbB13042C5A5e834c',shopLogic,shopStorage,teaToken,teaPot,'0x6D1C6b1B52B74F614465D5bdbB13042C5A5e834c'],[true,true,true,true,true,true,true,true,false,true,true,true,true,false])    
    .send({ from: account })
    .then((receipt) => {
      console.log("flames on");
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  });
    return receipt;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling servFlames method');
  }
};

export const servActivate = async (account) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(fireABI.abi, fire);
    const receipt = await new Promise((resolve, reject) => {
      contract.methods.settag(["!","@","#","$","%","^","&","*","(","?","[","~","+","="])
        .send({ from: account })
        .on('receipt', (receipt) => {
          console.log("activated");
          resolve(receipt);
        })
        .on('error', (error) => {
          console.error(`Failed to activate:`);
          console.error(error);
          reject(error);
        });
    });
    return receipt;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

export const servActivatePrice = async (account) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let price = 1000000000
    const decimalFactor = web3.utils.toBN(10).pow(web3.utils.toBN(9));
    const amountBN = web3.utils.toBN(price).mul(decimalFactor);
    price = amountBN.toString();
    
    let contract = new web3.eth.Contract(fireABI.abi, fire);
    contract.methods.setfee(["label","display"],[0,0])
    .send({ from: account})
    .on('receipt', (receipt) => {
      console.log("price activated");

      return receipt;
    })
    .on('error', (error) => {
      console.error(`Failed to mint:`);
      console.error(error);
    });

  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
//WALLET
export const servBalances = async (account_) => {
  try {
    // const balanceWei = await web3.eth.getBalance(account_);
    // const balanceBNB = web3.utils.fromWei(balanceWei, 'ether');
    if(!web3){
      web3 = await getWeb3()
    }

    let contract1 = new web3.eth.Contract(teaPotABI.abi, teaPot);
    let gasOwned = await contract1.methods.user2GasRefundOwned(account_).call();
    gasOwned = web3.utils.fromWei(gasOwned, 'ether');
    
    let contract2 = new web3.eth.Contract(teaTokenABI.abi, teaToken);
    const balanceTea = await contract2.methods.balanceOf(account_).call();

    const balanceTeapot = await contract2.methods.balanceOf(teaPot).call();

    return ({gas:gasOwned,tea:balanceTea, teapot:balanceTeapot});
  
  } catch (error) {
    console.log(error);
    throw new Error('Error calling serv method');
  }
};
export const servLockWallet = async (nftea_, brewdate_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    const accounts = await web3.eth.getAccounts();
    let contract = new web3.eth.Contract(bagLogicABI.abi, bagLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.lockwallet(nftea_,brewdate_)
    .send({ from: accounts[0] })
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;
  
  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};
export const servRemoveLimit = async () => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    const accounts = await web3.eth.getAccounts();
    let contract = new web3.eth.Contract(bridgeABI.abi, NFTEA_BRIDGE);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setIsTxLimitExempt(accounts[0],true)
    .send({ from: accounts[0], gas: 600000 })
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;
  
  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};
export const servGasRefund = async (account) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    // console.log(nftea_,teaToken,bnbonly_)
    let contract = new web3.eth.Contract(teaPotABI.abi, teaPot);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.gasRefund()
    .send({ from: account})
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;
  
  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};
export const servToBNB = async (value_) => {
  try {
    
    if(!web3){
      web3 = await getWeb3()
    }
    const weiValue = web3.utils.toWei(value_.toString(), 'ether');
    const result = web3.utils.fromWei(weiValue, 'ether');
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Error calling servToBNB method');
  }
};
//Search
export const servWrapedToLabel = async (contract_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    let contract = new web3.eth.Contract(mintStorageABI.abi, mintStorage);
    const result = await contract.methods.getcontractwraps(contract_).call();
    // console.log(result)
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
//SALE
export const servUserSales = async (user_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    let contract = new web3.eth.Contract(shopStorageABI.abi, shopStorage);
    const result = await contract.methods.getlivesales(user_).call();
    // console.log(result)
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
export const servLabelStats = async (label_,user_) => {
  try {
    
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(kettleABI.abi, kettle);
    const result = await contract.methods.getroyatea(label_,teaToken,user_).call();
    // console.log(result)
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

export const servLicenseCheck = async (license_,nftea_) => {
  try {
    
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(shopLogicABI.abi, shopLogic);
    const result = await contract.methods.licensecheck(license_,nftea_).call();
    // console.log(result)
    return result;
  } catch (error) {
    console.error(error);
    return {success: false, msg:error}
    throw new Error('Error calling serv licenseCheck method');
  }
};

export const servExpireCheck = async (label_,license_) => {
  try {
    
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(shopLogicABI.abi, shopLogic);
    const result = await contract.methods.expirecheck(label_,license_).call();
    // console.log(result)
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

//LABELS
export const servContract2Label = async (contract_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(mintStorageABI.abi, mintStorage);
    const result = await contract.methods._contract2label(contract_).call();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

export const servLabelSales = async (label_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(shopStorageABI.abi, shopStorage);
    const result = await contract.methods.getlivelabelsales(0,label_).call();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv labels sales method');
  }
};

export const servLabelDisplay = async (label_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(shopStorageABI.abi, shopStorage);
    const result = await contract.methods.getlabeldisplays(0,label_).call();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv labels sales method');
  }
};
export const servEditLinkedTo = async (account,nftea_, linkTo_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
   
   // .setoperator(_nftea,operator_,_display[0][1][2],license_,expire_,role_)
    let contract = new web3.eth.Contract(mintStorageABI.abi, mintStorage);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.updateLinkedTo(nftea_, linkTo_)
    .send({ from: account })
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;
  
  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};

///TEAPOT
export const servLove = async (account,nftea_, holder_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
   
   // .setoperator(_nftea,operator_,_display[0][1][2],license_,expire_,role_)
    let contract = new web3.eth.Contract(teaPotABI.abi, teaPot);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.showLove(nftea_, holder_)
    .send({ from: account })
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;
  
  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};

//MEDIA

export const servMediaAdd = async (account,nftea_, media_, title_, nfteas_, medias_, titles_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    let contract = new web3.eth.Contract(mintLogicABI.abi, mintLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setmediaattribute(nftea_,media_,title_,nfteas_,medias_,titles_)
    .send({ from: account, gas: 600000 })
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;

  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};

///LOANS
export const servUserLoans = async (user_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(teaPotABI.abi, teaPot);
    const result = await contract.methods.getLoans(user_).call();
    // console.log(result)
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
export const servActiveLoans = async () => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(teaPotABI.abi, teaPot);
    const result = await contract.methods.getActiveLoans().call();
    // console.log(result)
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Error calling serv method');
  }
};

export const servBorrow = async (account,nftea_, bnbonly_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    console.log(nftea_,teaToken,bnbonly_)
    let contract = new web3.eth.Contract(teaPotABI.abi, teaPot);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.issueLoan(nftea_,teaToken,bnbonly_)
    .send({ from: account})
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;
  
  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};

export const servRepayLoan = async (account,nftea_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    console.log(nftea_)
    let contract = new web3.eth.Contract(teaPotABI.abi, teaPot);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.repayLoan(nftea_)
    .send({ from: account})
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;
  
  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};

export const servBuyDefault = async (account,nftea_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    // console.log(nftea_,teaToken,bnbonly_)
    let contract = new web3.eth.Contract(teaPotABI.abi, teaPot);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.buyDefaultedAsset(nftea_)
    .send({ from: account})
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;
  
  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};

///OPERATORS
export const servOperators = async (nftea) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

      let contract = new web3.eth.Contract(operatorStorageABI.abi, operatorStorage);
      const result = await contract.methods.getlabeloperators(nftea).call();
      // console.log(result)
      return result;  
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
export const servOperatorApproveCheck = async (account) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    let contract = new web3.eth.Contract(mintABI.abi, mint);
    const result = await contract.methods.isApprovedForAll(account,operatorLogic).call();
    return result;

  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv operator approve check method');
  }
};
export const servApproveOperator = async (account) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    let contract = new web3.eth.Contract(mintABI.abi, mint);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setApprovalForAll(operatorLogic, true)
      .send({ from: account, gas: 64000 })
      .then((receipt) => {
        resolve(receipt);

      }).catch((error) => {
          console.log(error)
      })
    })

    return receipt;

  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
export const servSetOperator = async (account,operator_, wallet_, nftea_, license_, expire_,role_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    console.log(nftea_,operator_,wallet_,license_,expire_,role_)
   // .setoperator(_nftea,operator_,_display[0][1][2],license_,expire_,role_)
    let contract = new web3.eth.Contract(operatorLogicABI.abi, operatorLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setoperator(nftea_,operator_,wallet_,license_,expire_,role_)
    .send({ from: account})
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;

  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};

export const servWithdrawSettings = async (account, operator_, numbers_, nftea_) => {
  try {
    // wlimitbnb_ = new BN(wlimitbnb_);
    // wlimittea_ = new BN(wlimittea_);
    if(!web3){
      web3 = await getWeb3()
    }
    // numbers_[0] =  Web3.utils.toWei(numbers_[0], 'gwei');
    
    numbers_[0] = numbers_[0].toString()
    numbers_[1] = (numbers_[1]*10**9).toString()
    console.log(numbers_)
    let contract = new web3.eth.Contract(operatorLogicABI.abi, operatorLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setwithdrawsettings(numbers_,operator_,nftea_)
    .send({ from: account})
    .then((receipt) => {
      resolve(receipt);
      console.log(receipt)
    }).catch((error) => {
        console.log(error)
    })
  })    
   return receipt;
  } catch (error) {
    throw new Error('Error calling serv withdraw settings' + JSON.stringify(error));
  }
}




export const servSetRole = async (account,operator_,nftnftea2operateea_,role_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    let contract = new web3.eth.Contract(operatorLogicABI.abi, operatorLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setrole(nftea2operate,role_,license_,operartor_)
    .send({ from: account, gas: 1304000 })
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;

  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};

export const servWithdrawBNB = async (account,license, nftea, amount) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    amount = Web3.utils.toWei(amount, 'gwei');
    console.log(license,nftea,amount.toString())
    let contract = new web3.eth.Contract(bagLogicABI.abi, bagLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.withdrawbnb(license,nftea, amount.toString())
    .send({ from: account, gas: 900000})
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;

  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};
export const servWithdrawToken = async (account,license, nftea, tokenaddress, amount) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    const decimalFactor = web3.utils.toBN(10).pow(web3.utils.toBN(9));
    const amountBN = web3.utils.toBN(amount).mul(decimalFactor);
    const amountAsString = amountBN.toString();
    // const decimalFactor = 10 ** 9; 
    // amount = (amount * decimalFactor).toString();
    // amount = Web3.utils.toWei(amount, 'gwei');
    // console.log(license,parseInt(nftea),amount, tokenaddress)

    let contract = new web3.eth.Contract(bagLogicABI.abi, bagLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.withdrawtoken(license,parseInt(nftea),amountAsString, tokenaddress)
    .send({ from: account})
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;

  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};
export const servWithdrawNft = async (account,license, nftea, contractaddress, nfteaout, amount, withdrawAddress) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    console.log(license, nftea, contractaddress, nfteaout, amount,withdrawAddress)
    let contract = new web3.eth.Contract(bagLogicABI.abi, bagLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.withdrawnftea(license,nftea,contractaddress, nfteaout, amount, withdrawAddress)
    .send({ from: account})
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;

  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};

///NFTEA
export const servWrap = async (account,contractAddress,nftid,settings,addresses, ipfs) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
   // .setoperator(_nftea,operator_,_display[0][1][2],license_,expire_,role_)
   console.log(contractAddress,nftid,settings,addresses,ipfs)
    let contract = new web3.eth.Contract(mintLogicABI.abi, mintLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.wrap(contractAddress,nftid,settings,addresses,ipfs)
    .send({ from: account })
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;
  
  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};
export const servUnWrap = async (account,nftid) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
   // .setoperator(_nftea,operator_,_display[0][1][2],license_,expire_,role_)
    let contract = new web3.eth.Contract(mintLogicABI.abi, mintLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.unWrap(nftid)
    .send({ from: account })
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;
  
  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};
export const servHolders = async (nftea_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(mintABI.abi, mint);
    const result = await contract.methods.getholders(nftea_).call();
    return result;

  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv holders method');
  }
};
export const servWrapApproveCheck = async (user_, contract_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(mintABI.abi, contract_);
    const result = await contract.methods.isApprovedForAll(user_,mintLogic).call();
    return result;

  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
export const servApproveWrapper = async (account, wrapper_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    let contract = new web3.eth.Contract(mintABI.abi, wrapper_);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setApprovalForAll(mintLogic, true)
      .send({ from: account, gas: 64000 })
      .then((receipt) => {
        resolve(receipt);

      }).catch((error) => {
          console.log(error)
      })
    })

    return receipt;
  
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

export const servURI = async (contract_,nftea_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    let contract = new web3.eth.Contract(mintLogicABI.abi, mintLogic);
    const result = await contract.methods.getURI(contract_,nftea_).call();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

export const servMint = async (account,strings_,settings_,addresses_) => {
   try {
    if(!web3){
      web3 = await getWeb3()
    }
    // alert(mint)
    // console.log(strings_, settings_, addresses_)
    // let _ipfshex =  web3.utils.utf8ToHex(strings_[1])
    // if(_ipfshex.length>4){
      // strings_[1] = _ipfshex
      let contract = new web3.eth.Contract(mintLogicABI.abi, mintLogic);
      const receipt = await new Promise((resolve, reject) => {
      contract.methods.mintstart(strings_,settings_,addresses_)
      .send({ from: account })
      .then((receipt) => {
        resolve(receipt);
  
      }).catch((error) => {
          console.log(error)
      })
    })
    return receipt
    // }else{
    //   console.log('ipfs hash not valid' + _ipfshex)
    // }

  } catch (error) {
    console.log(error);
    throw new Error('Error calling mint method');
  }
};
export const servRenew = async (account,expire_,label_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

      let contract = new web3.eth.Contract(mintLogicABI.abi, mintLogic);
      const receipt = await new Promise((resolve, reject) => {
      contract.methods.renew(expire_,label_)
      .send({ from: account, gas: 1600000 })
      .then((receipt) => {
        resolve(receipt);
      }).catch((error) => {
          console.log(error)
      })
    })
    return receipt

  } catch (error) {
    console.error(strings_,settings_,addresses_);
    throw new Error('Error calling renew method');
  }
};

export const servMyNFTeas = async (account) => {
  try {
    
    if(!web3){
      web3 = await getWeb3()
    } 
    let result = []
    if(account){
      let contract = new web3.eth.Contract(mintABI.abi, mint);
      result = await contract.methods.getmynfteas(account).call();
    
    }
      return result;
  
  } catch (error) {
    console.log(error);
    throw new Error('Error calling serv method');
  }
};
export const servMyDisplays = async (account) => {
  try {
    
    if(!web3){
      web3 = await getWeb3()
    }
      let contract = new web3.eth.Contract(shopStorageABI.abi, shopStorage);
      const result = await contract.methods.getlivedisplay(account).call();
      // console.log(result)
      return result;
  
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
export const servMyLoans = async (account) => {
  try {
    
    if(!web3){
      web3 = await getWeb3()
    }
      let contract = new web3.eth.Contract(teaPotABI.abi, teaPot);
      const result = await contract.methods.getLoans(account).call();
      // console.log(result)
      return result;
  
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
export const servNFT = async (nftea_) => {
  try {

    if(!web3){
      web3 = await getWeb3()
    }
      let contract = new web3.eth.Contract(mintStorageABI.abi, mintStorage);
      const result = await contract.methods.getnftea(nftea_).call();
      return result;  
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv nftea method');
  }
};
export const servSellApproveCheck = async (user_, operator_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }

    let contract = new web3.eth.Contract(mintABI.abi, mint);
    const result = await contract.methods.isApprovedForAll(user_,operator_).call();
    return result;

  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
export const servApproveNFT = async (account, operator_) => {
  try {
    // console.log(operator_, shopLogic)
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(mintABI.abi, mint);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setApprovalForAll(operator_, true)
      .send({ from: account })
      .then((receipt) => {
        resolve(receipt);

      }).catch((error) => {
          console.log(error)
      })
    })

    return receipt;

  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
export const servTokenAllowance = async (user_,operator_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(teaTokenABI.abi, teaToken);
    const result = await contract.methods.allowance(user_,operator_).call();
    return result;

  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
export const servApproveToken = async (account,amount_,operator_) => {
  try {

    // let price = amount_;
    // const decimalFactor = 10 ** 9; // Assuming 9 decimal places for wlimittea_
    // price = (price * decimalFactor).toString();
    if(!web3){
      web3 = await getWeb3()
    }
    console.log(amount_)
    const decimalFactor = web3.utils.toBN(10).pow(web3.utils.toBN(9));
    const amountBN = web3.utils.toBN(amount_).mul(decimalFactor);
    const amountAsString = amountBN.toString();
    // console.log(amountAsString)
    let contract = new web3.eth.Contract(teaTokenABI.abi, teaToken);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.approve(operator_,amountAsString)
      .send({ from: account, to:teaToken })
      .then((receipt) => {
        resolve(receipt);

      }).catch((error) => {
          console.log(error)
      })
    })
    return receipt;
  } catch (error) {
    console.log(error);
    throw new Error('Error calling serv approve token method');
  }
};
export const servBag = async (nftea_, account_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    // alert(account_)
      let contract = new web3.eth.Contract(mintABI.abi, mint);
      const result = await contract.methods.getbag(nftea_,account_).call();
      return result;  
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv bag method');
  }
};

//DISPLAY
export const servDisplayEarnings = async (nftea_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    
    let contract = new web3.eth.Contract(teaPotABI.abi, teaPot);
    const result = await contract.methods.getdisplayearnings(nftea_).call();
    // console.log(result)
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Error calling serv method');
  }
};
export const servDisplays = async () => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = await new web3.eth.Contract(mintABI.abi, mint);
    const result = await contract.methods.getDisplays().call();
    console.log(result)
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv displays method');
  }
};
export const servDisplay = async (account, label_,nftea_, mplicense_, frontpage) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    // console.log(label_,nftea_,mplicense_,frontpage)
    let contract = new web3.eth.Contract(shopLogicABI.abi, shopLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setdisplay(label_,nftea_,mplicense_,frontpage)
    .send({ from: account })
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;

  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};
export const servDisplayRemove = async (account, nftea_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(shopLogicABI.abi, shopLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setdisplayoff(0,nftea_)
    .send({ from: account, gas: 1900000 })
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
    return receipt;

  } catch (error) {
    // console.error(error);
    throw new Error('Error calling serv display' + error);
  }
};
export const servNFT2Label = async (label_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(mintStorageABI.abi, mintStorage);
    const result = await contract.methods._nftea2label(label_).call();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

export const servMediaAttributes = async (nftea_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(mintStorageABI.abi, mintStorage);
    const result = await contract.methods.getmediaattributes(nftea_).call();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv servMediaAttributes method');
  }
};

export const servNFTbalance = async (account,nftea_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(mintABI.abi, mint);
    const result = await contract.methods.balanceOf(account,nftea_).call();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv nft balance method');
  }
};

export const servLastMarket = async (account,nftea_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(shopStorageABI.abi, shopStorage);
    const result = await contract.methods.getNftea2lastmarket(nftea_,account).call();
    console.log(result)
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling servLastMarket');
  }
};

export const servSell = async (account,settings_,price_,addresses_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    const decimalFactor = web3.utils.toBN(10).pow(web3.utils.toBN(9));
    const amountBN = web3.utils.toBN(price_).mul(decimalFactor);
    const amountAsString = amountBN.toString();
    
    let contract = new web3.eth.Contract(shopLogicABI.abi, shopLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.sell(settings_,amountAsString,addresses_)
    .send({ from: account})
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
  return receipt;

 } catch (error) {
  console.error(error);
  throw new Error('Error calling serv method');
}
};

export const servBuy = async (account,sellid_,nftea_,quantity_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(shopLogicABI.abi, shopLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.setbuy(sellid_,nftea_,quantity_)
    .send({ from: account})
    .then((receipt) => {
      resolve(receipt);
    
    }).catch((error) => {
        console.log(error)
    })
  })
  return receipt;
 } catch (error) {
  console.error(error);
  throw new Error('Error calling serv method');
}
};

export const servTransfer = async (account,to, nftea, supply) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(mintABI.abi, mint);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.safeTransferFrom(account,to,nftea,supply,'0x0')
    .send({ from: account, gas: 1164000 })
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
  return receipt;

 } catch (error) {
  console.error(error);
  throw new Error('Error calling transfer method');
}
};

export const servUnsell = async (sellid,account) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(shopLogicABI.abi, shopLogic);
    const receipt = await new Promise((resolve, reject) => {
    contract.methods.unsell(sellid)
    .send({ from: account })
    .then((receipt) => {
      resolve(receipt);

    }).catch((error) => {
        console.log(error)
    })
  })
  return receipt;

 } catch (error) {
  console.error(error);
  throw new Error('Error calling unsell method');
}
};

export const servSale = async (sale_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(shopStorageABI.abi, shopStorage);
    const result = await contract.methods.getsell(sale_).call();
    // console.log(result)
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling servSale');
  }
};

export const servIPFS = async (nftea_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(mintABI.abi, mint);
    const ipfs = await contract.methods._ipfs(nftea_).call();
    return ipfs;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

export const servStats = async (nftea_, user_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(shopStorageABI.abi, shopStorage);
    const volume = await contract.methods.getvolume(nftea_).call();

    contract = new web3.eth.Contract(kettleABI.abi, kettle);
    const royaltea = await contract.methods.getroyatea(nftea_, teaToken, user_).call();
    
    return ({volume,royaltea});
  } catch (error) {
    console.error(error);
    throw new Error('Error calling servStats method');
  }
};

export const servLabel = async (nftea_,label_) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    // console.log(label_)
    if(!nftea_){
      nftea_ = 0
    }
    let contract = new web3.eth.Contract(mintStorageABI.abi, mintStorage);
    const label = await contract.methods.getlabel(nftea_,label_).call();
    let contract2 = new web3.eth.Contract(fireABI.abi, fire);
    let price = await contract2.methods.getfee('label').call();
    price = price;
    let result = {label, price}
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

export const servOperator = async (account,nftea) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(operatorLogicABI.abi, operatorLogic);
    const result = await contract.methods.getoperator(account,nftea).call();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

export const servCheckOperator = async (account,nftea) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    let contract = new web3.eth.Contract(operatorStorageABI.abi, operatorStorage);
    const result = await contract.methods.getoperator(account,nftea).call();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};

export const servPrice = async (quantity,price) => {
  try {
    if(!web3){
      web3 = await getWeb3()
    }
    price = new web3.utils.BN(price*quantity);
    let total = web3.utils.toWei(price.toString());
    total= web3.utils.fromWei(total);
    
    return total;

  } catch (error) {
    console.error(error);
    throw new Error('Error calling serv method');
  }
};
