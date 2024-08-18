const { Telegraf } = require("telegraf");
const express = require("express");
require("dotenv").config();
const axios = require("axios");
const { Transaction } = require("mongodb");

const {apiUrl} = require('./api')
const { editWebhook, removeWalletWebhook} = require("./webhook");
const userCache = new Map(); // Use a Map to store user data
const fetchAllUsers = require("./users");
const {
  getAllWalletsbyUser,
  getActiveWalletsbyUser,
  getInactiveWalletsbyUser,
  walletgroup,
  addRemoveWallet,
  walletPdf,
} = require("./wallets");
const {
  startMessage,
  addMessage,
  deleteMessage,
  socialsMessage,
  importTransferKey, 
  supportMessage,
  manageMessage,
  inlineKeys,
  supportKeys,
  buyButtons,
  walletsLimitplan,
  upgradePro,
  transferKeyMsg,
} = require("./messages");
const { formatNumber, formatMcap, shortenString } = require("./formatNumber");
const { createWallet, payFee, generatePrivateKey } = require("./WalletCreate");
const { getCountdown, sendReminder } = require("./countdown");
const {fetchData, nftMetaData, tokenMintData} = require("./metadata");
const soldollarvalue = require("./dollarvalue");
const {checkreferrals, createReferralLink, generateTransferCode} = require('./referral')
const {swapMessage} = require('./swap')
const {transferMessage} = require('./transfer')
const {nftSaleMessage, nftMintMessage, nftListMessage, nftCanListMessage, addLiquidityMessage, removeLiquidityMessage, compressedNftTransfer} = require('./nft')
const {testData} = require('./test')

async function main() {
  console.log(apiUrl)
  await fetchAllUsers(userCache); // Fetch all users at startup
  const app = express();
  app.use(express.json());
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const PORT = process.env.PORT;
  console.log("running");

  let addNewWallets;
  let deleteWallets;
  let importTransferKey;

  // for blocked users
  async function sendMessage(ctx, text, options) {
    try {
      await bot.telegram.sendMessage(ctx, text, options);
    } catch (e) {
      console.log(`Error sending message to ${ctx}:`);
    }
  }

  // Start Command for the bot
  bot.start(async (ctx) => {
    const chatID = ctx.message.chat.id;
    const username = ctx.from.username;
    const user11 = userCache.get(ctx.from.username);
    console.log(user11)
    addNewWallets = false;
    deleteWallets = false;
    importTransferKey = false
    console.log(chatID);
    const allmessages = ctx.message.text 
    const msgArray = allmessages.split(' ')
    if(msgArray.length === 2){
      await checkreferrals(ctx, chatID)
    }
    
    sendMessage(ctx.message.chat.id, startMessage, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: inlineKeys,
      },
    });

    const user = {
      username: ctx.from.username,
      chat_id: ctx.message.chat.id,
      wallets: [],
      walletLimit: 20,
      pro: false,
      referredBy: msgArray.length === 2 ? msgArray[1] : null
    };


    await axios
      .post(
        `${apiUrl}`,
        user,
      )
      .then((res) => {
        console.log("User added");
        userCache.set(user.username, user); // Add user to cache
      })
      .catch((e) => {
        console.log("user already exists");
      });
  });

  // settings()
  await sendReminder(bot, userCache) 
  
  

  // add buttons
  bot.action("Add", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    addNewWallets = true;
    deleteWallets = false;
    importTransferKey = false
    ctx.reply(addMessage, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });
  bot.command("add", async (ctx) => {
    ctx.deleteMessage();
    addNewWallets = true;
    deleteWallets = false;
    importTransferKey = false
    sendMessage(ctx.message.chat.id, addMessage, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });

  // delete buttons
  bot.action("Delete", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    deleteWallets = true;
    addNewWallets = false;
    importTransferKey = false
    ctx.reply(deleteMessage, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });
  bot.command("delete", async (ctx) => {
    ctx.deleteMessage();
    deleteWallets = true;
    addNewWallets = false;
    importTransferKey = false;
    sendMessage(ctx.message.chat.id, deleteMessage, {
      parse_mode: "HTML",
    });
  });

  bot.command("Settings", async (ctx) => {
    // ctx.deleteMessage();
    // console.log('details',ctx.message.chat.id)
    // bot.telegram.sendPhoto(ctx.message.chat.id, 'https://na-assets.pinit.io/AwAmH7kqcXWy31H576yWmZx93BVGUdXdigC223t45CKJ/866f3615-4f3e-4ef2-b1cd-c3dd527b1352/255', {
    //   caption: '*nftsssss*',
    //   parse_mode: 'Markdown'
    // })
    await testData()
  });
  bot.action("Wallets", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await createWallet(ctx, userCache, chatID);
  });
  bot.command("wallets", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.message.chat.id
    await createWallet(ctx, userCache, chatID);
  });

  bot.action("Pro", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    console.log(ctx.from.username)
    const proMessage = await walletsLimitplan(chatID);
    const proinlineKeys = await upgradePro(chatID);
    ctx.reply(proMessage, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: proinlineKeys,
      },
    });
  });
  bot.command("pro", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.message.chat.id
    const proMessage = await walletsLimitplan(chatID);
    const proinlineKeys = await upgradePro(chatID);
    ctx.reply(proMessage, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: proinlineKeys,
      },
    });
  });

  bot.action("TransferAccount", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    console.log(ctx.from.username)
    ctx.reply(transferKeyMsg, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '➡️ Import Wallet', callback_data: 'import'
            }
          ],
          [
            {
              text: '⬅️ Export wallet', callback_data: 'export'
            }
          ]
        ],
      },
    });
  });
  bot.action("import", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    addNewWallets = false;
    deleteWallets = false;
    importTransferKey = true 
    console.log(ctx.from.username)
    ctx.reply('Send me the transfer key of the account you want to import', {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
  });
  bot.action("export", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    try{
      const response = await axios.get(`${apiUrl}${chatID}/transferKey`)
      const transferKey = response.data
      console.log('transfer key', transferKey)
      if(transferKey){
        ctx.reply(`Your Account Transfer Key:\n\n\`${transferKey}\``, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        })
          .then((result) => { setTimeout(() => {
                ctx.deleteMessage(result.message_id)
            }, 15 * 1000)})
            .catch(err => console.log(err))
      }else{
        const key = generateTransferCode()
        await axios.post(`${apiUrl}${chatID}/transferKey`, {
          transferKey : key
        })
        ctx.reply(`Your Account Transfer Key:\n\n\`${key}\``, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        });
      }
    }catch(e){
      console.log('no transfer key saved')
    }
  });
  // add payments options
  bot.action("pro1", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await payFee(0.001, ctx, chatID, userCache);
  });
  bot.action("pro2", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await payFee(0.002, ctx, chatID, userCache);
  });
  bot.action("pro3", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await payFee(0.003, ctx, chatID, userCache);
  });
  bot.action("pro4", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await payFee(0.004, ctx, chatID, userCache);
  });

  // show private key
  bot.action("pk", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await generatePrivateKey(ctx, chatID)
  });
  // down wallets pdf
  bot.action("walletpdf", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    await walletPdf(ctx, chatID);
  });
  // tutorials
  bot.action("Tutorials", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    ctx.reply('How to use Theia \n\n Theia A \n\n Theia B', {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });
  bot.command("tutorials", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.message.chat.id
    ctx.reply('How to use Theia \n\n Theia A \n\n Theia B', {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });
  bot.action("Socials", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    ctx.reply(socialsMessage, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "Back" }]],
      },
    });
  });
  bot.action("support", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    ctx.reply(supportMessage, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: supportKeys,
      },
    });
  });
  //referrals 
  bot.action("Referrals", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
     await createReferralLink(ctx, chatID)
  });

  //add and delete wallets
  bot.on("text", async (ctx) => {
    const chatID = ctx.message.chat.id
    const user = userCache.get(chatID);
    console.log(user)
    const text = ctx.message.text;
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if(addNewWallets || deleteWallets){
      await addRemoveWallet(
        text,
        solanaAddressRegex,
        addNewWallets,
        ctx,
        chatID,
        userCache,
        editWebhook,
        deleteWallets,
        removeWalletWebhook,
      );
    }else if(importTransferKey){
      try{
        const msgg = text.split(" ");
        console.log(msgg)
      if(msgg.length === 1){
        const response = await axios.get(
          `${apiUrl}transfer/${msgg[0]}`,
        );
        const olduser = response.data;
        console.log(olduser)
        const newProfile = {
          wallets: olduser.wallets,
          walletLimit: olduser.walletLimit,
          pro: olduser.pro ? olduser.pro : false,
          referredBy: olduser.referredBy ? olduser.referredBy : '',
          referral: olduser.referral,
          transferKey: olduser.transferKey,
          countdownEndTime: olduser.countdownEndTime ? olduser.countdownEndTime : ''
        }
        console.log(newProfile)
        await axios.put(`${apiUrl}${chatID}`, {
          userData: newProfile
        })
        const deleteOldUser = await axios.delete(`${apiUrl}${olduser.chat_id}`)
        const isdelete = deleteOldUser.data 
        console.log(isdelete)
        ctx.reply(`Your account have been migrated successfully`)
      }else if(msgg.length > 1){
        ctx.reply(`Transfer key does not exist`)
      }
      }catch(e){
        ctx.reply('Transfer key does not exist')
      }
    } else if(!addNewWallets && !deleteWallets && !importTransferKey){
        ctx.reply('Click /start for more instructions')
    }
  });


  // manage walltes
  bot.action("manage", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    ctx.reply(manageMessage, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: "🏦 All wallets", callback_data: "all" }], 
          [{ text: "🟩 Active wallets", callback_data: "active" }], 
          [{ text: "🟥 Inactive wallets", callback_data: "inactive" }], 
          [{ text: "Back", callback_data: "Back" }]
        ],
      },
    });
  });

  bot.action("active", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    try{
      const userData = await getActiveWalletsbyUser(chatID);
    console.log(userData)
    if (userData) {
       await ctx.sendMessage(
        `🗂️ You are currently tracking ${userData.total.length} wallets`,
      )
      .then((result) => { 
        ctx.pinChatMessage(result.message_id)
    })
    .catch(err => console.log('not pinned'))
       await ctx.sendMessage(
          `ALPHA WALLETS \n\n${userData.groupA.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
       await ctx.sendMessage(
          `BETA WALLETS \n\n${userData.groupB.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
       await ctx.sendMessage(
          `DELTA WALLETS \n\n${userData.groupD.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
       await ctx.sendMessage(
          `GAMMA WALLETS \n\n${userData.groupG.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
    } else {
      ctx.reply("No wallets found.");
    }
    }catch(e){
      console.log('errrrr in active wallets')
    }
  });

  bot.action("inactive", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    try{
      const userData = await getInactiveWalletsbyUser(chatID);
    console.log(userData)
    if (userData) {
       await ctx.sendMessage(
        `🗂️ You are currently not tracking ${userData.total.length}`,
      )
      .then((result) => { 
        ctx.pinChatMessage(result.message_id)
    })
    .catch(err => console.log('not pinned'))
       await ctx.sendMessage(
          `ALPHA WALLETS \n\n${userData.groupA.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
       await ctx.sendMessage(
          `BETA WALLETS \n\n${userData.groupB.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
       await ctx.sendMessage(
          `DELTA WALLETS \n\n${userData.groupD.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
       await ctx.sendMessage(
          `GAMMA WALLETS \n\n${userData.groupG.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
    } else {
      ctx.reply("No wallets found.");
    }
    }catch(e){
      console.log('errrrr in active wallets')
    }
  });

  bot.action("all", async (ctx) => {
    ctx.deleteMessage();
    const chatID = ctx.update.callback_query.message.chat.id
    try{
      const userData = await getAllWalletsbyUser(chatID);
    console.log(userData)
    if (userData) {
       await ctx.sendMessage(
        `🗂️ You are currently tracking ${userData.total.length}`,
      )
      .then((result) => { 
        ctx.pinChatMessage(result.message_id)
    })
    .catch(err => console.log('not pinned'))
       await ctx.sendMessage(
          `ALPHA WALLETS \n\n${userData.groupA.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
       await ctx.sendMessage(
          `BETA WALLETS \n\n${userData.groupB.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
       await ctx.sendMessage(
          `DELTA WALLETS \n\n${userData.groupD.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
       await ctx.sendMessage(
          `GAMMA WALLETS \n\n${userData.groupG.map((item, index) => {
            return `*W${index}* \`${item.address}\` (${item.name}),\n`;
          })}`,
          {
            parse_mode: "Markdown",
          },
        );
    } else {
      ctx.reply("No wallets found.");
    }
    }catch(e){
      console.log('errrrr in active wallets')
    }
  });

  bot.action("Back", (ctx) => {
    ctx.deleteMessage();
    ctx.reply(startMessage, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: inlineKeys,
      },
    });
  });

  // remiders
  // app.post('/remiders', async (req, res) =>{
  //   const message = req.body
  //   if(message.length === 0){
  //     console.log('no message')
  //   }else{

  //   }
  // })
  // webhooks
  app.post("/webhook", async (req, res) => {
    const webhookEvent = req.body;
    console.log(webhookEvent);
    if (webhookEvent.length === 0) {
      console.log("Empty webhook event");
    } else {
      try{
        const Transferdescription = webhookEvent[0].description;
      console.log(Transferdescription);
      const desc = Transferdescription.split(" ");
      const address1 = desc[0];
      const address2 = webhookEvent[0].tokenTransfers[0].toUserAccount;
        userCache.forEach(async (user) => {
          const wallet = user.wallets.find(
            (wallet) => wallet.address === address1,
          );
          console.log(wallet)
          const wallet2 = user.wallets.find(
            (wallet2) => wallet2.address === address2,
          );
          const sol = "So11111111111111111111111111111111111111112";
          const AW1 = `https://dexcheck.ai/app/wallet-analyzer/`;
          const signature = webhookEvent[0].signature;
          const sig = `https://solscan.io/tx/${signature}`;
          const solcAcct = "https://solscan.io/account/";
          const solToken = "https://solscan.io/token/";
          if (wallet || wallet2) {
            const Type = webhookEvent[0].type;
            console.log(Type)
            const Source = webhookEvent[0].source;
  
            if (Type === "SWAP") {
              await swapMessage(webhookEvent, Source, wallet, desc, sol, AW1, sig, solcAcct, solToken, user, buyButtons, bot)
              
            } else if (Type === "TRANSFER") {
             await transferMessage(webhookEvent, wallet, wallet2, sig, Source, solcAcct, desc, sol, AW1, bot, user, address1, address2, buyButtons)
              
            }else if(Type === 'BURN'){
              const txid = webhookEvent[0].signature;
              const txidLink = `https://solscan.io/tx/${txid}`;
              const mint = webhookEvent[0].tokenTransfers[0].mint;
              const tokenAmt = webhookEvent[0].tokenTransfers[0].tokenAmount;
              console.log(mint);
              const dexresult = await fetchData(mint);
  
              if(wallet){
                const messageToSend = `${walletgroup(wallet.group)} ALERT \n👤*${wallet.name}* *BURNED 🔥* *${formatMcap(desc[2])} ${dexresult.ticker}*(${await soldollarvalue(mint, tokenAmt)})\n\n*💡${dexresult.ticker} | MC: ${dexresult.mcap}*\n\`${mint}\`\n🔎 DYOR: [SOLC](${txidLink}) | [X](${dexresult.twitter}) | [RICK](${dexresult.rick})| [DS](${dexresult.Dexscreener}) | [DT](${dexresult.Dextools}) | [BE](${dexresult.Birdeye})\n\n🕵️‍♂️ *Analyse Wallet:* [W1](${AW1}${wallet.address})\n\`${wallet.address}\` ➡️ [${wallet.name}](${solcAcct}${wallet.address})`
                bot.telegram.sendMessage(user.chat_id, messageToSend, {
                  parse_mode: "Markdown",
                  disable_web_page_preview: true,
                  reply_markup: {
                    inline_keyboard: buyButtons(mint),
                  },
                });
              }
          }else if(Type === 'TOKEN_MINT'){
                const txid = webhookEvent[0].signature;
                const txidLink = `https://solscan.io/tx/${txid}`;
                const acctPrefix = "https://solscan.io/account/";
                const tokenName = desc[3]?.replace(".", "")
                const mint = webhookEvent[0].tokenTransfers[0].mint;
                console.log(mint);
                const dexresult = await tokenMintData(mint);
  
                if(wallet){
                  const messageToSend = `${walletgroup(wallet.group)} ALERT \n[TOKEN MINT](${txidLink}) on ${Source.replace(/_/g, " ")} \n\`${wallet.address}\` (${wallet.name})\n\n🔹[${wallet.name}](${acctPrefix}${wallet.address}) *minted* ${formatNumber(desc[2])} ${tokenName}\n\n*🔗${dexresult.ticker}(MC: $${formatMcap(dexresult.mcap)})*\nDYOR: [SOT](${dexresult.twitter})| [PH](${dexresult.Photon})| [BE](${dexresult.Birdeye})| [Rick](${dexresult.rick})\nAnalyse Wallet: [W1](${AW1}${wallet})\n\`${mint}\` `;
                  bot.telegram.sendMessage(user.chat_id, messageToSend, {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true,
                    reply_markup: {
                      inline_keyboard: buyButtons(mint),
                    },
                  });
                }
            }else if(Type === 'NFT_MINT'){
              await nftMintMessage(webhookEvent, desc, Source, bot, user)
            }else if(Type === 'NFT_SALE'){
                await nftSaleMessage(webhookEvent, desc, Source, bot, user)
            }else if(Type === 'NFT_LISTING'){
               await nftListMessage(webhookEvent, desc, Source, bot, user)
            }else if(Type === 'NFT_CANCEL_LISTING'){
               await nftCanListMessage(webhookEvent, desc, Source, bot, user)
            }else if(Type === 'COMPRESSED_NFT_TRANSFER'){
              await compressedNftTransfer(webhookEvent, desc, Source, bot, user)
           }else if(Type === 'WITHDRAW_LIQUIDITY'){
              await removeLiquidityMessage(webhookEvent, wallet, Source, AW1, bot, user)
            }else if(Type === 'ADD_LIQUIDITY'){
              await addLiquidityMessage(webhookEvent, wallet, Source, AW1, bot, user)
            }// add new transaction types here 
          }
        });
      }catch(e){
        console.log(e)
      } 
    }
    res.sendStatus(200); // Respond to indicate the webhook was received
  });

  bot.launch();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
