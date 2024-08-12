const { formatNumber, formatMcap, shortenString } = require("./formatNumber");
const soldollarvalue = require("./dollarvalue");
const {walletgroup} = require("./wallets");
const {fetchData, nftMetaData, checksource} = require("./metadata");



async function transferMessage(webhookEvent, wallet, wallet2, sig, Source, solcAcct, desc, sol, AW1, bot, user, address1, address2, buyButtons){
  try{
    const accountData = webhookEvent[0].accountData
    const senderAcctData = accountData.find(
      (accountInfo) => accountInfo.account === address1
    )
    const ReceiverAcctData = accountData.find(
      (accountInfo) => accountInfo.account === address2
    )
    console.log(senderAcctData)
    console.log(ReceiverAcctData)
    if (wallet && wallet2) {
      if (desc[3] === "SOL") {
        const messageToSend = `${walletgroup(wallet.group)} ALERT\n*${wallet.name}* transferred *${formatNumber(desc[2])} SOL*(${await soldollarvalue(sol, desc[2])}) to *${wallet2.name}*\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${wallet})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address}) \n\n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${solcAcct}${wallet2.address}) `;
        bot.telegram.sendMessage(user.chat_id, messageToSend, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        });
      } else {
        const tmint = webhookEvent[0].tokenTransfers[0].mint;
         console.log('ca:', tmint)
        const dexresult = await fetchData(tmint);

        const messageToSend = `${walletgroup(wallet.group)} ALERT\n*${wallet.name}* transferred *${formatNumber(desc[2])} ${desc[3]}*(${await soldollarvalue(tmint, desc[2])}) to *${wallet2.name}*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 *DYOR:* [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${address1})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address}) \n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${solcAcct}${wallet.address}) `
        bot.telegram.sendMessage(user.chat_id, messageToSend, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: buyButtons(tmint),
          },
        });
      }
    } else if (wallet && !wallet2) {
      if (desc[3] === "SOL") {
        const messageToSend = `${walletgroup(wallet.group)} ALERT\n*${wallet.name}* transferred *${formatNumber(desc[2])} SOL*(${await soldollarvalue(sol, desc[2])}) to *UNSAVED*\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${address1})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address}) \n\n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${address2}\` ➡️ [UNSAVED](${solcAcct}${address2}) `;
        bot.telegram.sendMessage(user.chat_id, messageToSend, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        });
      } else {
        if(ReceiverAcctData.nativeBalanceChange !== 0 && Source === 'SYSTEM_PROGRAM'){
          const quantitySol = Math.abs(ReceiverAcctData.nativeBalanceChange / 1000000000) 
          console.log(quantitySol)
          const quantitytoken = webhookEvent[0].tokenTransfers[0].tokenAmount 
          const tmint = webhookEvent[0].tokenTransfers[0].mint;
          const txsource = await checksource(tmint)
          const solmint = "So11111111111111111111111111111111111111112"
          const dexresult = await fetchData(tmint, quantitySol, quantitytoken);
            const messageToSend = `${walletgroup(wallet.group)} ALERT \n*${wallet.name}* *SOLD* ${formatMcap(quantitytoken)} *${dexresult.ticker}* for *${formatNumber(quantitySol)} SOL*(${await soldollarvalue(solmint, quantitySol)}) on *${txsource ? txsource : 'UNKNOWN'}*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 *DYOR:* [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ *Analyse Wallet:* [W1](${AW1}${wallet.address})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address})`
            bot.telegram.sendMessage(user.chat_id, messageToSend, {
              parse_mode: "Markdown",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: buyButtons(tmint),
              },
            });
        }else{
          const tmint = webhookEvent[0].tokenTransfers[0].mint;
          const dexresult = await fetchData(tmint);
          console.log('ca:', tmint)
          const messageToSend = `${walletgroup(wallet.group)} ALERT\n*${wallet.name}* transferred *${formatNumber(desc[2])} ${desc[3]}*(${await soldollarvalue(tmint, desc[2])}) to *UNSAVED*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 *DYOR:* [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${address1})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address}) \n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${address2}\` ➡️ [UNSAVED](${solcAcct}${address2}) `
          bot.telegram.sendMessage(user.chat_id, messageToSend, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: buyButtons(tmint),
            },
          });
        }
      }
    } else if (!wallet && wallet2) {
      if (desc[3] === "SOL") {
        const messageToSend = `${walletgroup(wallet2.group)} ALERT\n*UNSAVED* transferred *${formatNumber(desc[2])} SOL*(${await soldollarvalue(sol, desc[2])}) to *${wallet2.name}*\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${address1})\n\`${address1}\` ➡️ [UNSAVED](${solcAcct}${address1}) \n\n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${solcAcct}${address2}) `;
        bot.telegram.sendMessage(user.chat_id, messageToSend, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        });
      } else {
        if(senderAcctData.nativeBalanceChange !== 0 && Source === 'SYSTEM_PROGRAM'){
          const quantitySol = senderAcctData.nativeBalanceChange / 1000000000
          console.log(quantitySol)
          const quantitytoken = webhookEvent[0].tokenTransfers[0].tokenAmount 
          const tmint = webhookEvent[0].tokenTransfers[0].mint;
          const txsource = await checksource(tmint)
          const solmint = "So11111111111111111111111111111111111111112"
          const dexresult = await fetchData(tmint, quantitySol, quantitytoken);
            const messageToSend = `${walletgroup(wallet2.group)} ALERT \n*${wallet2.name}* *BOUGHT* ${formatMcap(quantitytoken)} *${dexresult.ticker}* for *${formatNumber(quantitySol)} SOL*(${await soldollarvalue(solmint, quantitySol)}) on *${txsource ? txsource : 'UNKNOWN'}*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 *DYOR:* [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ *Analyse Wallet2:* [W1](${AW1}${wallet2.address})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${solcAcct}${wallet2.address})`
            bot.telegram.sendMessage(user.chat_id, messageToSend, {
              parse_mode: "Markdown",
              disable_web_page_preview: true,
              reply_markup: {
                inline_keyboard: buyButtons(tmint),
              },
            });
        }else{
          const tmint = webhookEvent[0].tokenTransfers[0].mint;
          console.log('pumpp', tmint);
  
          const dexresult = await fetchData(tmint);
  
        const messageToSend = `${walletgroup(wallet2.group)} ALERT\n*UNSAVED* transferred *${formatNumber(desc[2])} ${desc[3]}*(${await soldollarvalue(tmint, desc[2])}) to *${wallet2.name}*\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${tmint}\`\n🔎 *DYOR:* [SOLC](${sig}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick}) | [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye}) | [Pump](${dexresult.pump})\n\n🕵️‍♂️ Analyse Wallet: [W1](${AW1}${address1})\n\`${address1}\` ➡️ [UNSAVED](${solcAcct}${wallet2.address}) \n🕵️‍♂️ Analyse Wallet: [W2](${AW1}${address2})\n\`${wallet2.address}\` ➡️ [${wallet2.name}](${solcAcct}${wallet2.address}) `
          bot.telegram.sendMessage(user.chat_id, messageToSend, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: buyButtons(tmint),
            },
          });
        }
      }
    }
  }catch(e){
    console.log('error in transfer message')
  }
}


module.exports = {transferMessage}