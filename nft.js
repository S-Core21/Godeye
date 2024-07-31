const {fetchData, nftMetaData} = require("./metadata");
const {walletgroup} = require("./wallets");
const { formatNumber, formatMcap } = require("./formatNumber");
const soldollarvalue = require("./dollarvalue");
const { default: axios } = require("axios");


async function nftSaleMessage(webhookEvent, desc, wallet, Source, bot, user){
  try{
    const txid = webhookEvent[0].signature
      const txidLink = `https://solscan.io/tx/${txid}`;
      const mint = webhookEvent[0].tokenTransfers[0].mint;
    console.log('nft mint add', mint)
      const nftData = await nftMetaData(mint)
    console.log(nftData)
      const solPlacement = desc.indexOf('SOL')
    const acctPrefix = "https://solscan.io/account/";
    const photUrl = nftData.image

      if(wallet){
        const caption = `${walletgroup(wallet.group)} ALERT \n[NFT SALE](${txidLink}) on ${Source.replace(/_/g, " ")} \n\`${wallet.address}\` (${wallet.name})\n\n🔹[${wallet.name}](${acctPrefix}${wallet.address}) *sold* ${nftData.name} for ${formatNumber(desc[solPlacement - 1])} SOL \n${nftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value.replace(/_/g, " ")}`
        })}`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      } 
  }catch(e){
    console.log('error')
  }
}


async function nftMintMessage(webhookEvent, desc, wallet, Source, bot, user){
  try{
    const txid = webhookEvent[0].signature
      const txidLink = `https://solscan.io/tx/${txid}`;
      const mint = webhookEvent[0].tokenTransfers[0].mint;
    console.log('nft mint add', mint)
      const nftData = await nftMetaData(mint)
    console.log(nftData)
      const solPlacement = desc.indexOf('SOL')
    const acctPrefix = "https://solscan.io/account/";
    const photUrl = nftData.image

      if(wallet){
        const caption = `${walletgroup(wallet.group)} ALERT \n[NFT MINT](${txidLink}) on ${Source.replace(/_/g, " ")} \n\`${wallet.address}\` (${wallet.name})\n\n🔹[${wallet.name}](${acctPrefix}${wallet.address}) *minted* ${nftData.name} for ${formatNumber(desc[solPlacement - 1])} SOL \n${nftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value.replace(/_/g, " ")}`
        })}`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      } 
  }catch(e){
    console.log('error', e)
  }
}


async function nftListMessage(webhookEvent, desc, wallet, Source, bot, user){
  try{
    const txid = webhookEvent[0].signature
      const txidLink = `https://solscan.io/tx/${txid}`;
      const mint = webhookEvent[0].tokenTransfers[0].mint;
    console.log('nft mint add', mint)
      const nftData = await nftMetaData(mint)
    console.log(nftData)
      const solPlacement = desc.indexOf('SOL')
    const acctPrefix = "https://solscan.io/account/";
    const photUrl = nftData.image

      if(wallet){
        const caption = `${walletgroup(wallet.group)} ALERT \n[NFT LISTING](${txidLink}) on ${Source.replace(/_/g, " ")} \n\`${wallet.address}\` (${wallet.name})\n\n🔹[${wallet.name}](${acctPrefix}${wallet.address}) *listed* ${nftData.name} for ${formatNumber(desc[solPlacement - 1])} SOL \n${nftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value.replace(/_/g, " ")}`
        })}`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      } 
  }catch(e){
    console.log('error')
  }
}


async function nftCanListMessage(webhookEvent, desc, wallet, Source, bot, user){
  try{
    const txid = webhookEvent[0].signature
      const txidLink = `https://solscan.io/tx/${txid}`;
      const mint = webhookEvent[0].tokenTransfers[0].mint;
    console.log('nft mint add', mint)
      const nftData = await nftMetaData(mint)
      const solPlacement = desc.indexOf('SOL')
    const acctPrefix = "https://solscan.io/account/";
    const photUrl = nftData.image
    console.log(nftData)

      if(wallet){
        const caption = `${walletgroup(wallet.group)} ALERT \n[NFT CANCEL LISTING](${txidLink}) on ${Source.replace(/_/g, " ")} \n\`${wallet.address}\` (${wallet.name})\n\n🔹[${wallet.name}](${acctPrefix}${wallet.address}) *cancelled listing* ${nftData.name} for ${formatNumber(desc[solPlacement - 1])} SOL \n${nftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value}`
        })}`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      } 
  }catch(e){
    console.log('error')
  }
}

async function addLiquidityMessage(webhookEvent, wallet, Source, AW1, bot, user){
  try{
    const txid = webhookEvent[0].signature
      const txidLink = `https://solscan.io/tx/${txid}`;
      const mint = webhookEvent[0].tokenTransfers[0].mint;
    const value = webhookEvent[0].tokenTransfers[0].tokenAmount;
    const acctPrefix = "https://solscan.io/account/";
    const tokenData = await fetchData(mint)
    
    if(wallet){
      const message = `${walletgroup(wallet.group)} ALERT \n[ADD LIQUIDITY](${txidLink}) on ${Source.replace(/_/g, " ")} \n\`${wallet.address}\` (${wallet.name})\n\n🔹[${wallet.name}](${acctPrefix}${wallet.address}) *added* ${value.toFixed(2)} ${tokenData.ticker} (${await soldollarvalue(mint, value)}) to liquidity \n\n*🔗${tokenData.ticker}(MC: $${formatMcap(tokenData.mcap)})*\nDYOR: [SOT](${tokenData.twitter}) |[DS](${tokenData.Dexscreener}) | [DT](${tokenData.Dextools}) | [PH](${tokenData.Photon})| [BE](${tokenData.Birdeye})| [Rick](${tokenData.rick})\nAnalyse Wallet: [W1](${AW1}${wallet.address})\n*CA:*\`${mint}\` `
console.log(message)
      bot.telegram.sendMessage(user.chat_id, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    }
  }catch(e){
    console.log('add liquidity error')
  }
}


async function removeLiquidityMessage(webhookEvent, wallet, Source, AW1, bot, user){
  try{
    const txid = webhookEvent[0].signature;
      const txidLink = `https://solscan.io/tx/${txid}`;
      const mint = webhookEvent[0].tokenTransfers[0].mint;
    const value = webhookEvent[0].tokenTransfers[0].tokenAmount;
    const acctPrefix = "https://solscan.io/account/";
    const tokenData = await fetchData(mint)
    
    if(wallet){
      const message = `${walletgroup(wallet.group)} ALERT \n[REMOVE LIQUIDITY](${txidLink}) on ${Source.replace(/_/g, " ")} \n\`${wallet.address}\` (${wallet.name})\n\n🔹[${wallet.name}](${acctPrefix}${wallet.address}) *removed* ${value.toFixed(2)} ${tokenData.ticker} (${await soldollarvalue(mint, value)}) from liquidity \n\n*🔗${tokenData.ticker}(MC: $${formatMcap(tokenData.mcap)})*\nDYOR: [SOT](${tokenData.twitter}) |[DS](${tokenData.Dexscreener}) | [DT](${tokenData.Dextools}) | [PH](${tokenData.Photon})| [BE](${tokenData.Birdeye})| [Rick](${tokenData.rick})\nAnalyse Wallet: [W1](${AW1}${wallet.address})\n*CA:*\`${mint}\` `
      
      bot.telegram.sendMessage(user.chat_id, message, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      });
    }
  }catch(e){
    console.log('add liquidity error')
  }
}

module.exports = {nftSaleMessage, nftMintMessage, nftListMessage, nftCanListMessage, addLiquidityMessage, removeLiquidityMessage}