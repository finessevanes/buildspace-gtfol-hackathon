import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from '../src/utils/SlamPost.json';
import {
  useAddress, useMetamask, ChainId,
  useNetwork, useNetworkMismatch, useNFTCollection
} from '@thirdweb-dev/react';

const App = () => {
  const rinkebyId = "0x4";
  const [init, setInit] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [checking, setChecking] = useState(true);
  const [isOnRinkeby, setIsOnRinkeby] = useState(true);
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const contractAddress = "0x29Eb53F350892bDe058F8FC95EB19258A4ae9020";
  const contractABI = abi.abi;

  // allow user to connect to app with metamask, and obtain address
  const address = useAddress();
  const connectWallet = useMetamask();
  const networkMismatched = useNetworkMismatch();

  // Switch network
  const [, switchNetwork] = useNetwork();

  // Polygon - Buildspace NFT Contract address
  const nftCollection = useNFTCollection("0x3CD266509D127d0Eac42f4474F57D0526804b44e");

  const post = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const slamPostContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await slamPostContract.getTotalPosts();
        console.log("Retrieved total post count...", count.toNumber());

        /*
        * Execute the actual post from your smart contract
        */
        const postTxn = await slamPostContract.post(newPost);
        setNewPost('');
        console.log("Mining...", postTxn.hash);

        await postTxn.wait();
        console.log("Mined -- ", postTxn.hash);

        count = await slamPostContract.getTotalPosts();
        console.log("Retrieved total post count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }



  const getAllPosts = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const slamPostContract = new ethers.Contract(contractAddress, contractABI, signer);
        const posts = await slamPostContract.getAllPosts();
        console.log('## POSTS ##', posts);

        let postsCleaned = [];
        posts.forEach(post => {
          postsCleaned.push({
            address: post.poster,
            timestamp: new Date(post.timestamp * 1000),
            message: post.message
          });
        });

        setAllPosts(postsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let slamPostContract;
    const onNewPost = (from, timestamp, message) => {
      console.log("NewPost", from, timestamp, message);
      setAllPosts(prevState => [
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
      slamPostContract.on("NewPost", onNewPost);
    }

    return () => {
      if (slamPostContract) {
        slamPostContract.off("NewPost", onNewPost);
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

    if (init) {
      checkBalance();
      setInit(false);
    }
  }, [
    init,
    address,
    connectWallet,
    networkMismatched,
    nftCollection,
    hasClaimedNFT
  ])

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    const checkIfRinkeby = async () => {
      try {
        const { ethereum } = window;
        ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        if (chainId === rinkebyId) {
          setIsOnRinkeby(true)
        } else {
          setIsOnRinkeby(false)
          switchNetwork(ChainId.Rinkeby);
        }
  
      } catch (error) {
        console.log(error);
      }
    }
    checkIfRinkeby()
  }, [switchNetwork])

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
  `
  const stickyNote = `
  text-center
  h-40
  w-44
  bg-rose-400
  p-7
  rounded-md
  shadow-xl
  mr-4
  mb-4
  `
  const stickynoteContainer = `
  md:grid
  md:grid-cols-5
  md:justify-center
  overflow-auto
  `

  return (
    <div className={container}>
      {!isOnRinkeby && (
        <nav className="bg-yellowbutton w-full text-center text-buttontext">This app runs on the Rinkeby network. You are not currently connected to the Rinkeby network.</nav>
      )}
      <p className="text-7xl text-yellowbutton mt-4 mb-4 font-smythe">The Great Wall of Ideas</p>
      <div className={stickynoteContainer}>
        {allPosts.map((post, index) => {
          return (
            <div key={index} className={stickyNote}>
              Message: {post.message}
            </div>)
        })}
      </div>

    <div class="flex justify-center">
      <div class="block p-4 rounded-lg shadow-lg bg-white max-w-xl mt-6">
        <p class="text-buttontext font-bold mt-4 mb-4">
        Do you an idea you want to share? Connect you wallet below! 
        We want to be sure you are a Buildspace Alumni</p>
      </div>
    </div>
      <button className="bg-yellowbutton hover:bg-yellow-100 text-buttontext font-bold py-2 px-4 rounded-full mb-4 mt-4" onClick={post}>Make a post</button>
      <input type='text' className="mb-6 px-10 py-3 rounded-sm overflow-auto" name="message" placeholder="Type your message here" value={newPost} onChange={(e) => setNewPost(e.target.value)} />
      {renderVote()}
      {!address && (
          <button className="bg-yellowbutton hover:bg-yellow-100 text-buttontext font-bold py-2 px-4 rounded-full mb-4 mt-4" onClick={connectWallet}>
            Connect Wallet
          </button>
      )}
    </div>
  );
}

export default App