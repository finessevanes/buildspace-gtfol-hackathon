const main = async () => {
  const postContractFactory = await hre.ethers.getContractFactory("SlamPost");
  const postContract = await postContractFactory.deploy();
  await postContract.deployed();
  console.log("Contract addy:", postContract.address);

  let postCount;
  postCount = await postContract.getTotalPosts();
  console.log(postCount.toNumber());


  let allPosts = await postContract.getAllPosts();
  console.log(allPosts);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();