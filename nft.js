const {fetchData, nftMetaData, getcNftData} = require("./metadata");
const {walletgroup} = require("./wallets");
const { formatNumber, formatMcap } = require("./formatNumber");
const soldollarvalue = require("./dollarvalue");
const { default: axios } = require("axios");


async function nftSaleMessage(webhookEvent, desc, Source, bot, user){
  try{
    const txid = webhookEvent[0].signature
      const txidLink = `https://solscan.io/tx/${txid}`;
      const mint = webhookEvent[0].events.nft.nfts[0].mint;
      const address1 =  webhookEvent[0].events.nft.seller
      const address2 =  webhookEvent[0].events.nft.buyer
      const wallet = user.wallets.find(
        (wallet) => wallet.address === address1,
      );
      const wallet2 = user.wallets.find(
        (wallet2) => wallet2.address === address2,
      );
    console.log('nft mint add', mint)
      const nftData = await nftMetaData(mint)
      const sol = 'So11111111111111111111111111111111111111112'
    console.log(nftData)
      const solPlacement = desc.indexOf('SOL')
    const acctPrefix = "https://solscan.io/account/";
    const photUrl = nftData.image

      if(wallet && !wallet2){
        const caption = `${walletgroup(wallet.group)} ALERT \n🎨 NFT SELL \n\n👤${wallet.name} *SOLD* ${nftData.name} for ${formatNumber(desc[solPlacement - 1])} SOL(${await soldollarvalue(sol, desc[solPlacement - 1])}) to *ANON* on ${Source.replace(/_/g, " ")} \n\n🖼 ${nftData.name} | ${Source.replace(/_/g, " ")} [SOLC](${txidLink})\n\n${nftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value.replace(/_/g, " ")}`
        })}\n\n\`${wallet.address}\` ➡️ [${wallet.name}](${acctPrefix}${wallet.address})\n\`${address2}\` ➡️ [ANON](${acctPrefix}${address2})`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      }else if(!wallet && wallet2){
        const caption = `${walletgroup(wallet2.group)} ALERT \n🎨 NFT SELL \n\n👤*ANON* *SOLD* ${nftData.name} for ${formatNumber(desc[solPlacement - 1])} SOL(${await soldollarvalue(sol, desc[solPlacement - 1])}) to ${wallet2.name} on ${Source.replace(/_/g, " ")} \n\n🖼 ${nftData.name} | ${Source.replace(/_/g, " ")} [SOLC](${txidLink})\n\n${nftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value.replace(/_/g, " ")}`
        })}\n\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${acctPrefix}${wallet2.address})\n\`${address1}\` ➡️ [ANON](${acctPrefix}${address1})`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      }else if(wallet && wallet2){
        const caption = `${walletgroup(wallet.group)} ALERT \n🎨 NFT SELL \n\n👤${wallet.name} *SOLD* ${nftData.name} for ${formatNumber(desc[solPlacement - 1])} SOL(${await soldollarvalue(sol, desc[solPlacement - 1])}) to ${wallet2.name} on ${Source.replace(/_/g, " ")} \n\n🖼 ${nftData.name} | ${Source.replace(/_/g, " ")} [SOLC](${txidLink})\n\n${nftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value.replace(/_/g, " ")}`
        })}\n\n\`${wallet.address}\` ➡️ [${wallet.name}](${acctPrefix}${wallet.address})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${acctPrefix}${wallet2.address})`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      }
  }catch(e){
    console.log('error', e)
  }
}


async function nftMintMessage(webhookEvent, desc, Source, bot, user){
  try{
    const txid = webhookEvent[0].signature
      const txidLink = `https://solscan.io/tx/${txid}`;
      const mint = webhookEvent[0].events.nft.nfts[0].mint;
      const address1 =  webhookEvent[0].events.nft.seller
      const address2 =  webhookEvent[0].events.nft.buyer
       const sol = 'So11111111111111111111111111111111111111112'
      const wallet = user.wallets.find(
        (wallet) => wallet.address === address1,
      );
      const wallet2 = user.wallets.find(
        (wallet2) => wallet2.address === address2,
      );
    console.log('nft mint add', mint)
      const nftData = await nftMetaData(mint)
    console.log(nftData)
      const solPlacement = desc.indexOf('SOL')
    const acctPrefix = "https://solscan.io/account/";
    const photUrl = nftData.image

      if(wallet){
        const caption = `${walletgroup(wallet.group)} ALERT \n🎨 NFT MINT\n\n👤${wallet.name} *MINTED* ${nftData.name} for ${formatNumber(desc[solPlacement - 1])} SOL(${await soldollarvalue(sol, desc[solPlacement - 1])}) on ${Source.replace(/_/g, " ")}\n\n🖼 ${nftData.name} | ${Source.replace(/_/g, " ")} [SOLC](${txidLink})\n\n${nftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value.replace(/_/g, " ")}`
        })}\n\n\`${wallet.address}\` ➡️ [${wallet.name}](${acctPrefix}${wallet.address})`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      } 
  }catch(e){
    console.log('error', e)
  }
}


async function nftListMessage(webhookEvent, desc, Source, bot, user){
  try{
    const txid = webhookEvent[0].signature
      const txidLink = `https://solscan.io/tx/${txid}`;
      const mint = webhookEvent[0].events.nft.nfts[0].mint;
      const address1 =  webhookEvent[0].events.nft.seller
      const address2 =  webhookEvent[0].events.nft.buyer
       const sol = 'So11111111111111111111111111111111111111112'
      const wallet = user.wallets.find(
        (wallet) => wallet.address === address1,
      );
      const wallet2 = user.wallets.find(
        (wallet2) => wallet2.address === address2,
      );
    console.log('nft mint add', mint)
      const nftData = await nftMetaData(mint)
    console.log(nftData)
      const solPlacement = desc.indexOf('SOL')
    const acctPrefix = "https://solscan.io/account/";
    const photUrl = nftData.image

      if(wallet){
        const caption = `${walletgroup(wallet.group)} ALERT \n🎨 NFT LISTING\n\n👤${wallet.name} *LISTED* ${nftData.name} for ${formatNumber(desc[solPlacement - 1])} SOL(${await soldollarvalue(sol, desc[solPlacement - 1])}) on ${Source.replace(/_/g, " ")}\n\n🖼 ${nftData.name} | ${Source.replace(/_/g, " ")} [SOLC](${txidLink})\n\n${nftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value.replace(/_/g, " ")}`
        })}\n\n\`${wallet.address}\` ➡️ [${wallet.name}](${acctPrefix}${wallet.address})`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      } 
  }catch(e){
    console.log('error', e)
  }
}


async function nftCanListMessage(webhookEvent, desc, Source, bot, user){
  try{
    const txid = webhookEvent[0].signature
      const txidLink = `https://solscan.io/tx/${txid}`;
      const mint = webhookEvent[0].events.nft.nfts[0].mint;
    console.log('nft mint add', mint)
      const nftData = await nftMetaData(mint)
      const address1 =  webhookEvent[0].events.nft.seller
      const address2 =  webhookEvent[0].events.nft.buyer
       const sol = 'So11111111111111111111111111111111111111112'
      const wallet = user.wallets.find(
        (wallet) => wallet.address === address1,
      );
      const wallet2 = user.wallets.find(
        (wallet2) => wallet2.address === address2,
      );
      const solPlacement = desc.indexOf('SOL')
    const acctPrefix = "https://solscan.io/account/";
    const photUrl = nftData.image
    console.log(nftData)
      if(wallet){
        const caption = `${walletgroup(wallet.group)} ALERT \n🎨 NFT CANCEL LISTING\n\n👤${wallet.name} *LISTED* ${nftData.name} for ${formatNumber(desc[solPlacement - 1])} SOL(${await soldollarvalue(sol, desc[solPlacement - 1])}) on ${Source.replace(/_/g, " ")}\n\n🖼 ${nftData.name} | ${Source.replace(/_/g, " ")} [SOLC](${txidLink})\n\n${nftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value.replace(/_/g, " ")}`
        })}\n\n\`${wallet.address}\` ➡️ [${wallet.name}](${acctPrefix}${wallet.address})`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      } 
  }catch(e){
    console.log('error', e)
  }
}

async function compressedNftTransfer(webhookEvent, wallet, Source, AW1, bot, user){
  try{
    const txid = webhookEvent[0].signature
      const txidLink = `https://solscan.io/tx/${txid}`;
      const assetID = webhookEvent[0].events.compressed[0].assetId;
    const cNftData = await getcNftData(assetID)
    const acctPrefix = "https://solscan.io/account/";
    const photUrl = cNftData.image

      if(wallet){
        const caption = `${walletgroup(wallet.group)} ALERT \n🎨 COMPRESSED NFT TRANSFER on ${Source.replace(/_/g, " ")}\n\n👤${wallet.name} transferred *${cNftData.name}* \n\n*${cNftData.name}* | ${Source.replace(/_/g, " ")} | [SOLC](${txidLink})\n\n${cNftData.attributes.map(item=>{
          return `\n*${item.trait_type ? item.trait_type.replace(/_/g, " ") : item.traitType.replace(/_/g, " ")}*: ${item.value.replace(/_/g, " ")}`
        })}\n\n\`${wallet.address}\` ➡️ [${wallet.name}](${acctPrefix}${wallet.address})`
        bot.telegram.sendPhoto(user.chat_id, photUrl, {
          caption: caption,
          parse_mode: 'Markdown'
        })
      } 
  }catch(e){
    console.log('error',e)
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



module.exports = {nftSaleMessage, nftMintMessage, nftListMessage, nftCanListMessage, compressedNftTransfer, addLiquidityMessage, removeLiquidityMessage}