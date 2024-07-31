const { default: axios } = require("axios")
const { formatMcap } = require("./formatNumber");



async function fetchData(Mint1){
  const url = `https://api.helius.xyz/v0/token-metadata?api-key=${process.env.API_KEY}`;
  try{
    const response = await axios.get(`https://price.jup.ag/v6/price?ids=${Mint1}`)
    const priceData = response.data.data
    console.log('pricedata', priceData)
    const mint = [Mint1]
    const response2 = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mintAccounts: mint,
        includeOffChain: true,
        disableCache: false,
      }),
    });

    const data = await response2.json();
    if(Object.keys(priceData).length >= 1){
      const decimal = data[0].onChainAccountInfo.accountInfo.data.parsed.info.decimals
      const supply= data[0].onChainAccountInfo.accountInfo.data.parsed.info.supply
      const unitSupply = supply.toString().slice(0, -decimal)
      console.log('supply', unitSupply)
      console.log('current price', priceData[Mint1].price)
      const mcap = unitSupply * priceData[Mint1].price
      console.log(mcap)
      const MetaData = {
         ticker: data[0].onChainMetadata.metadata.data.symbol,
         mcap: mcap ? formatMcap(mcap): 'UNKNOWN',
         // pump : data[0].offChainMetadata.metadata.createdOn,
         Dextools : `https://dextools.io/app/en/solana/pair-explorer/${Mint1}`,
         Dexscreener : `https://dexscreener.com/solana/${Mint1}`,
         Birdeye : `https://birdeye.so/${Mint1}?chain=solana`,
         Photon : `https://photon-sol.tinyastro.io/en/lp/${Mint1}`,
         Rick : `https://t.me/RickBurpBot?start=${Mint1}`,
         twitter : `https://twitter.com/search?q=${Mint1}`,
         solscan: `https://solscan.io/token/${Mint1}`,
         rick: `t.me/RickBurpBot?start=${Mint1}`,
      }
      return MetaData
    }else if(Object.keys(priceData).length === 0){
      const dexscreenermcap = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${Mint1}`)
      console.log(dexscreenermcap)
      const tokenmcap = dexscreenermcap.data.pairs.length >= 1 ? dexscreenermcap.data.pairs[0].fdv : ''
      const MetaData = {
         ticker: data[0].onChainMetadata.metadata.data.symbol,
         mcap: tokenmcap,
         // pump : data[0].offChainMetadata.metadata.createdOn,
         Dextools : `https://dextools.io/app/en/solana/pair-explorer/${Mint1}`,
         Dexscreener : `https://dexscreener.com/solana/${Mint1}`,
         Birdeye : `https://birdeye.so/${Mint1}?chain=solana`,
         Photon : `https://photon-sol.tinyastro.io/en/lp/${Mint1}`,
         Rick : `https://t.me/RickBurpBot?start=${Mint1}`,
         twitter : `https://twitter.com/search?q=${Mint1}`,
         solscan: `https://solscan.io/token/${Mint1}`,
         rick: `t.me/RickBurpBot?start=${Mint1}`,
      }
      return MetaData
    }
  }catch(e){
    console.log('err no metadata')
    const MetaData = {
       mcap: '',
       // pump : data[0].offChainMetadata.metadata.createdOn,
       Dextools : `https://dextools.io/app/en/solana/pair-explorer/${Mint1}`,
       Dexscreener : `https://dexscreener.com/solana/${Mint1}`,
       Birdeye : `https://birdeye.so/${Mint1}?chain=solana`,
       Photon : `https://photon-sol.tinyastro.io/en/lp/${Mint1}`,
       Rick : `https://t.me/RickBurpBot?start=${Mint1}`,
       twitter : `https://twitter.com/search?q=${Mint1}`,
       solscan: `https://solscan.io/token/${Mint1}`,
       rick: `t.me/RickBurpBot?start=${Mint1}`,
    }
    return MetaData
  }
}

async function tokenMintData(Mint1){
  const url = `https://api.helius.xyz/v0/token-metadata?api-key=${process.env.API_KEY}`;
  try{
    const mint = [Mint1]
    const response2 = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mintAccounts: mint,
        includeOffChain: true,
        disableCache: false,
      }),
    });

    const data = await response2.json();
    const MetaData = {
       ticker: data[0].onChainMetadata.metadata.data.symbol,
       mcap: '',
       // pump : data[0].offChainMetadata.metadata.createdOn,
       Dextools : `https://dextools.io/app/en/solana/pair-explorer/${Mint1}`,
       Dexscreener : `https://dexscreener.com/solana/${Mint1}`,
       Birdeye : `https://birdeye.so/${Mint1}?chain=solana`,
       Photon : `https://photon-sol.tinyastro.io/en/lp/${Mint1}`,
       Rick : `https://t.me/RickBurpBot?start=${Mint1}`,
       twitter : `https://twitter.com/search?q=${Mint1}`,
       solscan: `https://solscan.io/token/${Mint1}`,
       rick: `t.me/RickBurpBot?start=${Mint1}`,
    }
    return MetaData
  }catch(e){
    console.log('err no metadata')
  }
}



async function nftMetaData(mint){
  const url = `https://api.helius.xyz/v0/token-metadata?api-key=${process.env.API_KEY}`;
  const nftAddresses = [
    mint
  ];
  console.log(nftAddresses)
  try{
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mintAccounts: nftAddresses,
        includeOffChain: true,
        disableCache: false,
      }),
    });

    const data = await response.json();
    console.log("metadata: ", data);
    const offChainMetadata = data[0].offChainMetadata.metadata
    console.log(offChainMetadata.name, offChainMetadata.image)
    const nftMeta = {
      name: offChainMetadata.name, 
      image: offChainMetadata.image,
      attributes: offChainMetadata.attributes
    }
    console.log(nftMeta)
    return nftMeta 
  }catch(e){
    console.log('error cant fetch nft data')
  }
}

module.exports = {fetchData, tokenMintData, nftMetaData}
