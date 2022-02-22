const BigNumber = require("bignumber.js");
const { use } = require("chai");

const CompoundResolverAddress = "0x9fA9f5Ce281a42BbB5D1c9af6D26aF06dd4d964A";
const CompoundResolverABI = require("../ABIs/CompoundResolverABI.json");
const CompoundResolverContract = new web3.eth.Contract(
  CompoundResolverABI,
  CompoundResolverAddress
);

const CompoundComptrollerABI = require("../ABIs/CompundComptrollerABIs.json");
const CompoundComptrollerAddress = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";
const CompoundComptrollerContract = new web3.eth.Contract(
  CompoundComptrollerABI,
  CompoundComptrollerAddress
);

const CompoundTokenABI = require("../ABIs/CompoundTokenABI.json");

const RandomUserAddress = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";

async function GetCompundData() {
  const tokenAddr = await CompoundComptrollerContract.methods
    .getAllMarkets()
    .call();
  const uData = await CompoundResolverContract.methods
    .getPosition(RandomUserAddress, tokenAddr)
    .call();
  let userData = [];

  for (let i = 0; i < tokenAddr.length; i++) {
    let dataForToken = {};

    const compData = uData[0][i];

    const CompoundTokenAddress = tokenAddr[i];
    const CompoundTokenContract = new web3.eth.Contract(
      CompoundTokenABI,
      CompoundTokenAddress
    );
    const ctokenKey = await CompoundTokenContract.methods.symbol().call();
    //key
    dataForToken.key = ctokenKey.substring(1);
    //ctokenAddr
    dataForToken.cTokenAddr = tokenAddr[i];
    //ctokenKey
    dataForToken.cTokenKey = ctokenKey;
    //ctokenDecimals
    dataForToken.ctokenDecimals = await CompoundTokenContract.methods
      .decimals()
      .call();
    //ctokenId
    dataForToken.ctokenId = dataForToken.key.toUpperCase() + "-A";
    //price in ETH
    dataForToken.priceInETH = new BigNumber(compData.tokenPriceInEth.toString())
      .div(1e18)
      .toString();
    //price in USD
    dataForToken.priceInUSD = new BigNumber(compData.tokenPriceInUsd.toString())
      .div(1e18)
      .toString();
    //exchange rate
    dataForToken.exchangeRate = new BigNumber(
      compData.exchangeRateStored.toString()
    )
      .div(1e18)
      .toString();
    //ctkenBalance
    dataForToken.ctknBalance = new BigNumber(compData.balanceOfUser.toString())
      .div(1e18)
      .toString();
    //supply

    //borrow
    dataForToken.borrow = new BigNumber(
      compData.borrowBalanceStoredUser.toString()
    )
      .div(1e18)
      .toString();
    //supply rate
    const supplyRatePerBlock = compData.supplyRatePerBlock;
    dataForToken.supplyRate = new BigNumber(supplyRatePerBlock.toString())
      .times(6570)
      .times(365)
      .div(1e18)
      .toString();
    //supply yeild
    const ethMantissa = 1e18;
    const blocksPerDay = 6570; // 13.15 seconds per block
    const daysPerYear = 365;
    dataForToken.supplyYeild =
      Math.pow(
        (supplyRatePerBlock / ethMantissa) * blocksPerDay + 1,
        daysPerYear
      ) - 1;
    //borrow rate
    const borrowRatePerBlock = compData.borrowRatePerBlock;
    dataForToken.borrowRate = new BigNumber(borrowRatePerBlock.toString())
      .times(6570)
      .times(365)
      .div(1e18)
      .toString();
    //borrow yeild
    dataForToken.borrowYeild =
      Math.pow(
        (borrowRatePerBlock / ethMantissa) * blocksPerDay + 1,
        daysPerYear
      ) - 1;
    //factor
    dataForToken.factor = new BigNumber(compData.collateralFactor.toString())
      .div(1e18)
      .toString();
    //total borrow
    dataForToken.totalBorrow = new BigNumber(compData.totalBorrows.toString())
      .div(1e18)
      .toString();
    //borrow cap
    dataForToken.borrowcap = compData.borrowCap;
    //isComped
    dataForToken.isComped = compData.isComped;
    //borrow enabled
    dataForToken.borrowEnabled = !compData.isBorrowPaused;
    //comp Supply Apy

    //comp Borrow Apy

    console.log(dataForToken);
  }
  userData.balance = new BigNumber(uData[1].balance.toString())
    .div(1e18)
    .toString();
  userData.votes = uData[1].votes;
  userData.delegate = uData[1].delegate;
  userData.allocated = new BigNumber(uData[1].allocated.toString())
    .div(1e18)
    .toString();
  console.log(userData);
}

GetCompundData();
