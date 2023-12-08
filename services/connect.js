import Web3 from 'web3';
import { WalletConnectProvider } from '@walletconnect/web3-provider';

let selectedProvider;
let web3; // Declare web3 as a global variable
export const servConnect = (selectedProvider) => {
    return new Promise(async (resolve, reject) => {
      // Check if WalletConnect provider is selected
      if (selectedProvider === 'walletconnect') {
        const provider = new WalletConnectProvider({
          // infuraId:"fce816bb197a4ffa850322a0f94be155",
          rpc: {
              56: "https://bsc-dataseed1.binance.org",
          },
          network: 'binance',
          chainId: 56,
        });
        try {
  
          await provider.enable();
          const sessionID = provider.wc._sessionStorage.storageId;
          localStorage.setItem("walletconnectSession", sessionID);
          selectedProvider = 'walletconnect';
          setProviderPreference(selectedProvider);
  
        } catch (error) {
          reject(new Error('Failed to enable WalletConnect'));
          return;
        }
        web3 = new Web3(provider);
        try {
          const accounts = await web3.eth.getAccounts();
          console.log(accounts[0])
          resolve(accounts[0]);
        } catch (error) {
          reject(error);
        }
      } else {
        // Request account access if needed using MetaMask
        if (window.ethereum) {
          try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            selectedProvider = 'metamask';
            setProviderPreference(selectedProvider);
          } catch (error) {
            reject(new Error('User denied account access'));
            return;
          }
        } else if (window.web3) {
          // Legacy dapp browsers...
          console.log('Legacy dapp browser detected');
        } else {
          // Non-dapp browsers...
          console.log('Non-dapp browser detected');
        }
  
        // Create a Web3 instance using the MetaMask provider
        web3 = new Web3(window.ethereum);
  
        // Get the current account
        try {
          const accounts = await web3.eth.getAccounts();
          resolve(accounts[0]);
        } catch (error) {
          reject(error);
        }
      }
    });
  };

export const servUserSales = async (user_) => {
    try {
  
      let contract = new web3.eth.Contract(shopStorageABI.abi, shopStorage);
      const result = await contract.methods.getlivesales(user_).call();
      console.log(result)
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Error calling serv method');
    }
  };

function setProviderPreference(provider) {
  localStorage.setItem('providerPreference', provider);
}

function getProviderPreference() {
  return localStorage.getItem('providerPreference');
}

window.addEventListener('load', () => {
  const storedProvider = getProviderPreference();
  selectedProvider = storedProvider ? storedProvider : null;
});
