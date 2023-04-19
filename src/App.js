import { useState, useEffect } from 'react';
import axios from 'axios';
import { Contract } from '@ethersproject/contracts';
import contractABI from './contractABI.json';
import { ethers } from 'ethers';
import { providers } from 'ethers';
import { InfuraProvider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { Web3Provider} from '@ethersproject/providers'
import logo from './head-small.png';
import pg from './pg.png';
import './App.css';
import backgroundVideo from './bluefire.mp4'

const App = () => {
  const contractAddress = '0xB15488af39bD1de209D501672a293Bcd05f82Ab4';
  const apiEndpoint = 'https://api.bscscan.com';
  const apiKey = 'FMNN1RHXHH94CCV324ICXIU2I4D3I85XFX';
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawableDividends, setWithdrawableDividends] = useState(0);
  const [totalDividends, setTotalDividends] = useState(0);

  useEffect(() => {
    const initProvider = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          

          setProvider(newProvider);
          setIsConnected(true);
        } else if (window.web3) {
          const newProvider = new ethers.providers.Web3Provider(window.web3.currentProvider);
          

          setProvider(newProvider);
          setIsConnected(true);
        } else {
          const newProvider = new ethers.providers.InfuraProvider('homestead', 'your-infura-project-id');
          

          setProvider(newProvider);
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Failed to initialize provider:', error);
      }
    };
    initProvider();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        

        setProvider(newProvider);
        setIsConnected(true);
      } else if (window.web3) {
        const newProvider = new ethers.providers.Web3Provider(window.web3.currentProvider);
        

        setProvider(newProvider);
        setIsConnected(true);
      } else {
        const newProvider = new ethers.providers.InfuraProvider('homestead', 'your-infura-project-id');
        

        setProvider(newProvider);
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  
  
  

  const disconnectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.send('eth_disconnect');
      }
      setProvider(null);
      setIsConnected(false);
      setWalletAddress('');
      setWithdrawableDividends(0);
      setTotalDividends(0);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };
  
    

  const fetchDividends = async () => {
    if (!provider) {
      console.log("Provider is null, please connect your wallet.");
      return;
    }
  
    if (!walletAddress) {
      console.log("Wallet address is empty, please enter a valid wallet address.");
      return;
    }
  
    try {
      const contract = new Contract(contractAddress, contractABI, provider);
      const result = await contract.getAccountDividendsInfo(walletAddress);
      const withdrawableDividendsInWei = result.withdrawableDividends;
      const totalDividendsInWei = result.totalDividends;
      const withdrawableDividendsInEth = ethers.utils.formatEther(withdrawableDividendsInWei);
      const totalDividendsInEth = ethers.utils.formatEther(totalDividendsInWei);
      setWithdrawableDividends(withdrawableDividendsInEth);
      setTotalDividends(totalDividendsInEth);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClaim = async () => {
    try {
      // Check if a wallet is connected
      if (!provider?.getSigner().getAddress()) {
        throw new Error('Please connect your wallet');
      }
  
      // Get the connected wallet address
      const recipient = await provider.getSigner().getAddress();
  
      // Call the claim function with the recipient as an argument
      const tx = await contract.claim(recipient);
      await tx.wait();
  
      // Call fetchDividends again to update the UI
     
    } catch (error) {
      console.error('Failed to claim:', error);
    }
  };
  
  const handleWalletAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };
  
  return (
    <div className="App">    
      <video autoPlay loop muted id="background-video">
        <source src={backgroundVideo} type="video/mp4"/>
      </video>
      <div className="card-container">
        <div className="card">
        <img id='logo' className='logo' src={logo} alt='Nanomatic Rewards'/>
        <button className="show-rewards-button" onClick={fetchDividends}>
            Show My Rewards
          </button>

          <button className="connect-button" onClick={isConnected ? disconnectWallet : connectWallet}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>      
          <input
            className="wallet-input"
            type="text"
            placeholder="Enter your wallet address"
            value={walletAddress}
            onChange={handleWalletAddressChange}
          />
          <p className="nums">
            All Time Rewards: {totalDividends} MATIC<br />
            Available To Claim: {withdrawableDividends} MATIC
          </p>
          <p className="info">
            To see what Matic rewards you have earned so far and to see what is available to claim,
           
            please enter the BEP-20 wallet address where you hold Nanomatic token and press the<br/> "Show My Rewards"
            button.
          </p>
        </div>
      </div>
    </div>
  );
  };  
  export default App;
        



