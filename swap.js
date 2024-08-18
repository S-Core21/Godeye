const { formatNumber, formatMcap } = require("./formatNumber");
const soldollarvalue = require("./dollarvalue");
const {walletgroup} = require("./wallets");
const {fetchData, nftMetaData} = require("./metadata");



async function swapMessage(webhookEvent, Source, wallet, desc, sol, AW1, sig, solcAcct, solToken, user, buyButtons, bot) {
  try {
    const UserAccount = webhookEvent[0].tokenTransfers[0].fromUserAccount;
    const tokenTransfersLength = webhookEvent[0].tokenTransfers.length
    const Mint1 = webhookEvent[0].tokenTransfers[tokenTransfersLength - 2].mint
    const Mint2 = webhookEvent[0].tokenTransfers[tokenTransfersLength - 1].mint
    const Mint1swap = webhookEvent[0].tokenTransfers[0].mint
    const Mintswap = webhookEvent[0].tokenTransfers[tokenTransfersLength - 1].mint
    const solmint = "So11111111111111111111111111111111111111112"
    const accountData = webhookEvent[0].accountData
    const userTokenData = accountData
    .map(item => item.tokenBalanceChanges)
    .filter(tokenBalanceChanges => tokenBalanceChanges[0]?.userAccount === wallet.address);
    const nestedData = userTokenData.map(subArray => subArray[0]?.mint);
  
    // const usdcMint = ''
    if(desc[3] === 'SOL' || desc[6]==='SOL'){
      if(desc[3] === 'SOL'){
        const transactionType = 'BUY'
        const quantitySol = desc[2]
        const quantitytoken = desc[5]
        const dexresult = await fetchData(nestedData[0], quantitySol, quantitytoken);
        const testMessage = `${walletgroup(wallet.group)} ALERT \n👤*${wallet.name}* [BOUGHT](${sig}) ${formatMcap(quantitytoken)} [${dexresult.ticker}](${solToken}${nestedData[0]}) for ${formatNumber(quantitySol)} [SOL](${solToken}${solmint}) (${await soldollarvalue(solmint, quantitySol)}) on ${Source.replace(/_/g, " ")}\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${nestedData[0]}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ *Analyse Wallet:* [W1](${AW1}${UserAccount})\n\`${UserAccount}\` ➡️ [${wallet.name}](${solcAcct}${UserAccount})`
        
        const messageToSend = testMessage;
        // console.log(messageToSend);
  
        bot.telegram.sendMessage(user.chat_id, messageToSend, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: buyButtons(nestedData[0]),
          },
        });
  
      }else if(desc[6]==='SOL'){
        const transactionType = 'SELL'
        const quantitySol = desc[5]
        const quantitytoken = desc[2]
        const dexresult = await fetchData(nestedData[0], quantitySol, quantitytoken);
         const testMessage = `${walletgroup(wallet.group)} ALERT \n👤*${wallet.name}* [SOLD](${sig}) ${formatMcap(quantitytoken)} [${dexresult.ticker}](${solToken}${nestedData[0]}) for ${formatNumber(quantitySol)} [SOL](${solToken}${solmint}) (${await soldollarvalue(solmint, quantitySol)}) on ${Source.replace(/_/g, " ")}\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${nestedData[0]}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ *Analyse Wallet:* [W1](${AW1}${UserAccount})\n\`${UserAccount}\` ➡️ [${wallet.name}](${solcAcct}${UserAccount})`
  
         const messageToSend = testMessage;
        //  console.log(messageToSend);
   
         bot.telegram.sendMessage(user.chat_id, messageToSend, {
           parse_mode: "Markdown",
           disable_web_page_preview: true,
           reply_markup: {
             inline_keyboard: buyButtons(nestedData[0]),
           },
         });
      }
    }else if(desc[3] !== 'SOL' || desc[6]!=='SOL'){
      const quantitytoken1 = desc[2] 
      const quantitytoken2 = desc[5]
      const dexresult = await fetchData(nestedData[0]);
      const dexresult2 = await fetchData(nestedData[1]);
      const ticker2link = `[${desc[6]}](${solToken}${nestedData[0]})` 
       const testMessage = `${walletgroup(wallet.group)} ALERT \n👤*${wallet.name}* [SWAPPED](${sig}) ${formatMcap(quantitytoken1)} [${desc[3]}](${solToken}${nestedData[0]}) for ${formatMcap(quantitytoken2)} [${desc[6]}](${solToken}${nestedData[1]}) (${await soldollarvalue(nestedData[1], quantitytoken2)}) on ${Source.replace(/_/g, " ")}\n\n*💡${desc[3]} | MC: ${dexresult.mcap}*\n\`${nestedData[0]}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick})| [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n*💡${desc[6]} | MC: ${dexresult2.mcap}*\n\`${nestedData[1]}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult2.twitter}) | [RICK](${dexresult2.rick})| [DS](${dexresult2.Dexscreener}) | [DT](${dexresult2.Dextools}) | [BE](${dexresult2.Birdeye}) | [Pump](${dexresult2.pump})\n\n🕵️‍♂️ *Analyse Wallet:* [W1](${AW1}${UserAccount})\n\`${UserAccount}\` ➡️ [${wallet.name}](${solcAcct}${UserAccount})`

      const messageToSend = testMessage;
      // console.log(messageToSend);

      bot.telegram.sendMessage(user.chat_id, messageToSend, {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: buyButtons(nestedData[1]),
        },
      });
    }

    
  } catch (e) {
    console.log("buy, sell or swap error", e);
  }
}

// else if (Mint1 == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' && senderAcctData.nativeBalanceChange !== 0 ){
//   const quantitySol = desc[6]
//   const quantitytoken = desc[2]
//   const mintUSDC = webhookEvent[0].tokenTransfers[0].mint
//   const dexresult = await fetchData(mintUSDC, quantitySol, quantitytoken);
//   const testMessage = `${walletgroup(wallet.group)} ALERT \n👤*${wallet.name}* *SOLD* ${formatMcap(quantitytoken)} [${dexresult.ticker}](${solToken}${nestedData[0]}) for *${formatNumber(quantitySol)} SOL*(${await soldollarvalue(Mint2, quantitySol)}) on ${Source.replace(/_/g, " ")}\n\n*💡[${dexresult.ticker}](${solToken}${nestedData[0]}) | MC: ${dexresult.mcap}*\n\`${mintUSDC}\`\n🔎 DYOR: [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ *Analyse Wallet:* [W1](${AW1}${UserAccount})\n\`${UserAccount}\` ➡️ [${wallet.name}](${solcAcct}${UserAccount})`

//   const messageToSend = testMessage;
//  //  console.log(messageToSend);

//   bot.telegram.sendMessage(user.chat_id, messageToSend, {
//     parse_mode: "Markdown",
//     disable_web_page_preview: true,
//     reply_markup: {
//       inline_keyboard: buyButtons(mintUSDC),
//     },
//   });
// }
module.exports = {swapMessage}