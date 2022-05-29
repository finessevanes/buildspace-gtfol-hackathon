import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from '../src/utils/SlamPost.json';
import { useAddress, useMetamask, useNetwork, useNetworkMismatch, useNFTCollection, useNFTDrop } from '@thirdweb-dev/react';

const App = () => {
  const [allWaves, setAllWaves] = useState([]);
  const [newWave, setNewWave] = useState('');
  const [checking, setChecking] = useState(true);
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const contractAddress = "0xf7B2F9d4eC85e1E47E4097480C20CF9B65c88D71";
  const contractABI = abi.abi;

   // allow user to connect to app with metamask, and obtain address
  const address = useAddress();
  const connectWallet = useMetamask();
  const networkMismatched = useNetworkMismatch();

  // Switch network
  const [, switchNetwork] = useNetwork();

  // Polygon - Buildspace NFT Contract address
  const nftCollection = useNFTCollection("0x3CD266509D127d0Eac42f4474F57D0526804b44e");

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const slamPostContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await slamPostContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await slamPostContract.wave(newWave);
        setNewWave('');
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await slamPostContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const slamPostContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await slamPostContract.getAllWaves();
        console.log('## WAVES ##', waves);

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let slamPostContract;
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      slamPostContract = new ethers.Contract(contractAddress, contractABI, signer);
      slamPostContract.on("NewWave", onNewWave);
    }

    return () => {
      if (slamPostContract) {
        slamPostContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  useEffect(() => {
    if (!address) {
      return;
    }

    // As we get errors if we owned Buildspace's NFT -> we can set it to true if there's an error
    // And if wallet does not own Buildspace's NFT -> nfts.length == 0;
    const checkBalance = async () => {
      try {
        const nfts = await nftCollection.getOwned(address);
        if (nfts.length === 0) {
          setHasClaimedNFT(false);
        }
        setChecking(false);
      } catch (error) {
        setHasClaimedNFT(true);
        setChecking(false);
        console.error("Failed to get NFTs", error);
      }
    };
    checkBalance();
  }, [
    address,
    connectWallet,
    networkMismatched,
    switchNetwork,
    nftCollection,
    hasClaimedNFT
  ])

  useEffect(() => {
    getAllWaves();
  }, []);

  const renderVote = () => {
    if (checking) {
      return (
        <div>
          <h1>Checking your wallet...</h1>
        </div>
      );
    } else {
      if (hasClaimedNFT) {
        return (
          <h1>You can vote!</h1>
        )
      } else {
        return (<h1>No!!</h1>)
      }
    }
  }

  const container = `
  flex
  w-screen
  h-screen
  object-center
  bg-synthwave
  bg-cover
  bg-center
  flex-col 
  items-center
  pl-4
  pr-4
  `
  const stickyNote = `
  text-center
  h-40
  w-44
  bg-rose-400
  p-7
  rounded-md
  shadow-xl
  mb-6
  `
  const stickynoteContainer = `
  md:flex-wrap
  md:flex
  md:space-y-0
  space-y-4
  md:justify-center
  overflow-auto
  `

  return (
    <div className={container}>
      <nav className="text-yellowbutton">This webside use Rinkeby testnet, make you're not connected on the mainet before posting!</nav>
      <p className="text-7xl text-yellowbutton mt-16 mb-16 font-smythe">The Great Wall of Ideas</p>
      <div className={stickynoteContainer}>
        {allWaves.map((wave, index) => {
          return (
            <div key={index} className={stickyNote}>
              Message: {wave.message}
            </div>)
        })}
      </div>

    <div class="flex justify-center">
      <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm mt-6">
        <p class="text-buttontext font-bold mt-4 mb-4">
        Do you an idea you want to share? Connect you wallet below! 
        We want to be sure you are a Buildspace Alumni</p>
      </div>
    </div>
      {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="bg-yellowbutton hover:bg-yellow-100 text-buttontext font-bold py-2 px-4 rounded-full mb-6 mt-6" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <input type='text' className="px-10 py-3 rounded-sm overflow-auto" name="message" placeholder="Type your message here" value={newWave} onChange={(e) => setNewWave(e.target.value)} />
        <button className="bg-yellowbutton hover:bg-yellow-100 text-buttontext font-bold py-2 px-4 rounded-full mb-4 mt-6" onClick={wave}>Make a post</button>
    </div>
  );
}

export default App