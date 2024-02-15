import {Blast, BlastNetwork, BlastSubscriptionPlan, BlastConfig} from "@bwarelabs/blast-sdk-js";
import Web3 from 'web3';
import { ethers, utils } from "ethers";
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
// import abiDecoder from 'abi-decoder'
const abiDecoder = require('abi-decoder');
import { getWalletProvider, toString} from './web3Service';
import {
    esports_abi,
    esports_contract,
    esports_events,
} from "../lib/abi/esports"


let web3:any;

const config: BlastConfig = {
    projectId: 'd1c068ff-a7c3-48e3-8066-a90e643b8e00',
    network: BlastNetwork.BSC_TESTNET ,
    rateLimit: BlastSubscriptionPlan.Free,
};
const blast = new Blast(config);


const getWeb3 = () => {
    return new Promise(async(resolve, reject) => {
        let provider = getWalletProvider()
        web3 = new Web3(provider);
        // console.log(provider)
        resolve(web3)
    
    });
  };
const log = (data:any) => {
    console.log(data)
}
export const setChallenge = (amount:any,console:any,_game:any,gameId:any,nftIdPlayer1:any,nftIdPlayer2:any,player1:any,player2:any,rules:any,token:any) =>{
    return new Promise(async(resolve,reject)=>{
        let data_ = {
            amount,
            console,
            _game,
            gameId,
            nftIdPlayer1,
            nftIdPlayer2, 
            player1,
            player2,
            rules,
            token
          }
        const JSONdata = JSON.stringify(data_)
        const endpoint = '/api/esports/setChallenge'
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        // log(data_)
        resolve(result.success)
    })
}

export const servChallengeSync = async () => {
    
        try {
            
            if(!web3){
                web3 = await getWeb3()
            }
            const toBlock = await blast.apiProvider.eth.getBlockNumber();
            const fromBlock = toBlock - 1000000
            
            const apiKey = 'Z9PG85FABZXAR6T62B2R5Z7RMI6CVJYKNQ'; // Replace with your actual API key
            const apiUrl = `https://api-testnet.bscscan.com/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${esports_contract}&topic0=0x16e4653ecd8378abfcc934523e977a355fc5dca8f2c4671ebbb77d88cb5c5652&topic1=0x000000000000000000000000f60493dff27500213ff246120580e32454474457&topic2=0x00000000000000000000000072f2c39464345ac43cc7f3d95dbd832c77c69a37&apikey=${apiKey}`;
            const eventABI: any = esports_abi.find((item) => item.type === 'event' && item.name === 'ChallengeCreated');
            const response = await fetch(apiUrl);
            const data = await response.json();
            // log(data.result)
            if (data.status === '1') {
                const result = data.result;
                for (let i = 0; i < result.length; i++) {
                    const element = result[i];
                    const topics = element.topics.slice(1); // Remove the first topic, which is the event signature
                    const eventData = await web3.eth.abi.decodeLog(eventABI.inputs, element.data, topics);
                    let amount = eventData.amount
                    let console = eventData.console
                    let game = eventData.game
                    let gameId = eventData.gameId
                    let nftIdPlayer1 = eventData.nft1
                    let nftIdPlayer2 =  eventData.nft2
                    let player1 = eventData.player1
                    let player2 = eventData.player2
                    let rules = eventData.rules
                    let tokenAddress= eventData.token
                    await setChallenge(amount,console,game,gameId,nftIdPlayer1,nftIdPlayer2,player1,player2,rules,tokenAddress)
                    // log(eventData)
                }
            
            } else {
                // await setChallenge(0,null,null,0,0,0,null,null,null,null)
                console.error('API error:', data.message);
            }

        } catch (error:any) {
            console.error('Error fetching data:', error.message);
        }

  };