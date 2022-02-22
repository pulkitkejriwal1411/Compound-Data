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

const RandomUserAddress = "0x145b0F174ffAE565aFcdbc155e1fCb9CEF78E40D";


async function getData(){
    const tokenAddr = await CompoundComptrollerContract.methods
    .getAllMarkets()
    .call();
    const uData = await CompoundResolverContract.methods.getPosition(RandomUserAddress,tokenAddr).call();
    console.log(uData[0][0]);
    console.log(uData[0]);
    console.log(uData[1]);
}
getData();