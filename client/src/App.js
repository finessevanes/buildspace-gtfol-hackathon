import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from '../src/utils/SlamPost.json';
import { container, buttonStyle } from "./App.styles";
import Poems from "./components/Poems";
import {
  useAddress, useMetamask, ChainId,
  useNetwork, useNFTCollection
} from '@thirdweb-dev/react';
import { ReactComponent as DownArrowLogo } from './assets/down-arrow.svg';


const App = () => {
  const rinkebyId = "0x4";
  const [init, setInit] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [voting, setVoting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isOnRinkeby, setIsOnRinkeby] = useState(true);
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [modifiedAddress, setModifiedAddress] = useState('');
  const contractAddress = "0xD7d9a5fe4e8Af239169339AF04c376102924ba03";
  const contractABI = abi.abi;

  const modifyAddress = (address) => {
    const lastThree = address.slice(-3);
    const firstFour = address.slice(0, 4);
    return setModifiedAddress(`${firstFour}...${lastThree}`)
  }

  // allow user to connect to app with metamask, and obtain address
  const address = useAddress();
  const connectWallet = useMetamask();
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
        
        let postsCleaned = [];
        posts.forEach(post => {
          postsCleaned.push({
            address: post.poster,
            timestamp: new Date(post.timestamp * 1000),
            message: post.message,
            voteCount: post.voteCount.toString()
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
        modifyAddress(address)
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
      getAllPosts();
      setInit(false);
    }
  }, [
    init,
    address,
    connectWallet,
    nftCollection,
    hasClaimedNFT,
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

  const handleVoteDetails = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const slamPostContract = new ethers.Contract(contractAddress, contractABI, signer);
        const votedOn = await slamPostContract.userVotedOn();
        // Help me with render the details in a div!!
        alert("Voted On Poem #" + votedOn.index.toString() + " Message: " + votedOn.message);
      }
    } catch (error) {
      alert("You have not voted!");
      console.log(error);
    }
  }

  const renderVote = () => {
    if (isOnRinkeby && address) {
      if (checking) {
        return (
          <div>
            <h1 className="text-white">Checking your wallet...</h1>
          </div>
        );
      } else {
        if (hasClaimedNFT) {
          return (
            <div className="text-white">
              <h1>You can vote!</h1>
              <button className={buttonStyle} onClick={handleVoteDetails}>I voted on..?</button>
            </div>
          )
        }
      }
    }
  }

  const handleUpVote = async (e) => {
    e.preventDefault();
    const index = e.target.value;
    console.log('upvoted', index);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const slamPostContract = new ethers.Contract(contractAddress, contractABI, signer);
        const vote = await slamPostContract.upVote(index);
        setVoting(true);
        await vote.wait()
        setVoting(false);
        getAllPosts();
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
      // alert(error.message)
    }
  }

  const handleDownVote = async (e) => {
    e.preventDefault();
    const index = e.target.value;
    console.log(index)
    console.log('downvoted', index);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const slamPostContract = new ethers.Contract(contractAddress, contractABI, signer);
        const vote = await slamPostContract.downVote(index, { gasLimit: 300000 });
        setVoting(true);
        await vote.wait();
        setVoting(false);
        getAllPosts();
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
      // alert(error.message)
    }
  }

  return (
    <div className={container}>
      <div className={`bg-yellowbutton w-full text-center text-buttontext ${isOnRinkeby ? 'invisible' : 'visible'}`}>This app runs on the Rinkeby network. You are not currently connected to the Rinkeby network.</div>
      <div className={`rounded-lg bg-red-100 px-3 py-2 shadow-lg shadow-cyan-500/50 mt-6 mr-6 self-end ${!address ? 'invisible' : 'visible'}`}>{modifiedAddress}</div>
      <p className="text-7xl text-yellowbutton mt-4 mb-4 font-smythe text-center">Slam Poetry</p>
      <Poems allPosts={allPosts} handleDownVote={handleDownVote} handleUpVote={handleUpVote} hasClaimedNFT={hasClaimedNFT}/>
      {address ?
        (<div class="flex justify-center">
          <div class="block p-4 rounded-lg shadow-lg bg-white max-w-xl mt-6 opacity-75 ">
            <p class="text-buttontext font-bold mt-4 mb-4">
              Are you a poet and didn't even know it? Share your poetry skills and see how the community votes
            </p>
          </div>
        </div>)
        : (
          <>
            <DownArrowLogo />
            <DownArrowLogo />
            <DownArrowLogo />
          </>

        )
      }
      {!address ? (
        <button className={buttonStyle} onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <>
          <input type='text' className="mb-6 px-10 py-3 rounded-sm overflow-auto" name="message" placeholder="Type your message here" value={newPost} onChange={(e) => setNewPost(e.target.value)} />
          <button className={buttonStyle} onClick={post}>
            Make a post
          </button>
        </>
      )}
      {voting && (<h1 className="text-white">Voting...</h1>)}
      {renderVote()}
    </div>
  );
}

export default App