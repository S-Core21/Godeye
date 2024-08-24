const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const axios = require("axios");
const {isPro} = require('./countdown')
const {apiUrl} = require('./api')
const {planName} = require('./wallets')
const {convertDate} = require('./formatNumber')

const startMessage =
  "🤖 GODEYE | wallet tracker\n\nI'm Godeye, a wallet tracker bot on Solana that helps you maximize your potential. 🏆\n\nGodeye lets you effortlessly monitor all your Solana wallets. Simply add them, relax, and let me handle the rest. You'll receive instant alerts for every transaction.⚡️";
const addMessage =
  'Yay! A new wallet. Now send me your wallet details in this format👇\n\n“Wallet nickname group”\nExample:\n“HsDjdEk8RdyZqHCj9x2RLZuQxG6VW5Bugstcb1QXYDSR Sixth✅ A”\n\n*“Wallet1 nickname group”*\n\n📝Tips: You can group wallets with abbreviations *A* (Alpha), *B* (Beta), *D* (Delta), and *G* (Gamma), based on their win rate.\n\n👋To *add multiple wallets* send me each wallet on a new line in this format 👇\n\n*“Wallet1 nickname group”*\n*“Wallet2 nickname group”*';
const deleteMessage = 'send me the wallet you want to unalive?☠️\n\nTo unalive multiple wallets send me each wallet on a new line in this format👇 \n\nWallet 1\nWallet 2\nWallet 3'
const transferKeyMsg = '🥳 You can move your wallet data to a new Telegram account if you lose your device or your telegram gets banned\n\n📝 Tips: We would never ask for your transfer key via phone, email, or text. Protect yourself from scams because anyone who has this key can access your wallet'
const supportMessage = '☎️ For complaints, support, or feedback, kindly contact\n\n👇👇👇'
const manageMessage = 'WALLET SUMMARY \n\n🏦All wallets: A list of all your saved wallets \n🟩Active wallets : A list of wallets sending notifications depending on your subscription \n🟥Inactive wallets : a list of wallets not sending notifications due to expired subscription.\n\n📝 Tips: upgrade plan to use inactive wallets'

const socialsMessage = 'Connect with us on social media for the latest updates and insights.\n\n🤖Bot: Godeye_wallet_tracker\n\n🦅Twitter: https://x.com/godeye_network?s=21 \n\n😎Lounge: https://t.me/Godeye_olympus \n\n🚨Channel: https://t.me/Godeye_news_channel \n\n🌐Website: https://Godeyenetwork.org'

const inlineKeys = [
  [
    { text: "⚡️ Add", callback_data: "Add" },
    { text: "🏦 Saved wallets", callback_data: "manage" },
  ],
  [
    { text: "🚮 Delete", callback_data: "Delete" },
    { text: "👤 My Account", callback_data: "Wallets" },
    { text: "🔼 Upgrade", callback_data: "Pro" },
  ],
  [
    { text: "🫂 Refer & Earn", callback_data: "Referrals" },
    { text: "🌐 Socials", callback_data: "Socials" },
    { text: "🔍 Tutorials", callback_data: "Tutorials" },
  ],
  [
    { text: "📥 Download Wallets", callback_data: "walletpdf" },
    { text: "🔄 Transfer Wallets", callback_data: "TransferAccount" }
  ],
  [
    { text: "💬 Customer support", callback_data: "support" }
  ],
];

const supportKeys = [
  [
    { text: "🦖 Kaiju", url: "https://t.me/Division_3" },
    { text: "⚡️ Dev S", url: "https://t.me/Devvv_S" },
  ],
  [
    { text: "🙋‍♂️ FAQ", url: "https://Godeyenetwork.org" }
  ],
  [
    { text: "Back", callback_data: "Back" }
  ]
]

function buyButtons(mint){
  const inlineButtons = [
    [
      {text: '🐶 Bonk', url: `t.me/bonkbot_bot?start=${mint}`},
      {text: '🐴 Trojan', url: `t.me/solana_trojanbot?start=${mint}`},
      {text: '🤖 STB', url: `t.me/solanaTradingBot?start=${mint}`},
    ],
    [
      {text: '🐸 Pepe', url: `t.me/pepeboost_sol_bot?start=${mint}`},
      {text: '🐃 Bullx', url: `https://bullx.io/terminal?chainId=1399811149&address=${mint}`},
      {text: '⚛ PH', url: `https://photon-sol.tinyastro.io/en/lp/${mint}`}
    ]
  ]
  return inlineButtons
}

async function walletsLimitplan(chatID){
  try{
    const response = await axios.get(
      `${apiUrl}${chatID}`,
    );
    const userData = response.data
    const WalletLimitData = userData.walletLimit;
    const wallets = userData.wallets;
    const expiryDate = convertDate(userData.countdownEndTime)
    const noOfWallets = wallets.length
    console.log(WalletLimitData, 'limit plan')
    const walletName = WalletLimitData == 20 ? 'Free' : 
    WalletLimitData == 100 ? '🐦‍🔥 Phoenix' : 
    WalletLimitData == 200 ? '🎠 Valkyrie' : 
    WalletLimitData == 400 ? '🪬 Odin' : 
    WalletLimitData == 600 ? '⚡️ Zeus' : 
    'Free';
    console.log(walletName)
    const proMessage =`👀 Current plan: ${walletName}  \n🏦 All wallets: ${noOfWallets}/${WalletLimitData}\n❌ Expires: ${expiryDate}\n\n📝 How to upgrade \n\nTo subscribe to Phoenix, please transfer a minimum of 0.21 SOL to your Godeye wallet. You can locate your Godeye wallet in the "My Accounts" menu.\n\nOnce you've transferred the funds, navigate to the "Upgrade" section and select the "Phoenix" plan. A fee of 0.2 SOL will be deducted from your account, and your wallet limit will be automatically increased.\n\nChoose a plan 👇 \n\n🆓 Free : 20 wallets \n\n🐦‍🔥Phoenix (basic) : 100W, 0.2\n🎠Valkyrie (standard) : 200W, 0.3\n🪬odin (premium ) :400W, 0.5\n⚡️Zeus (godeye) : 600W, 1SO `
      return proMessage
  }catch(e){
    console.log('error in wallets')
  }
}


async function upgradePro(chatID){
  try{
    const response = await axios.get(
      `${apiUrl}${chatID}/walletLimit`,
    );
    const pro = await isPro(chatID) 
    const WalletLimitData = response.data.walletLimit;
    if(pro){
      if(WalletLimitData === 100){
        const proinlineKeys = [
          [
            {text: '🎠 Valkyrie 200W 0.3SOL/mo', callback_data: 'pro2'}
          ],
          [
            {text: '🪬 Odin 400W 0.5SOL/mo', callback_data: 'pro3'}
          ],
          [
            {text: '⚡️ Zeus 600W 1SOL/mo', callback_data: 'pro4'}
          ]
        ] 
        return proinlineKeys
      }else if(WalletLimitData === 200){
        const proinlineKeys = [
          [
            {text: '🪬 Odin 400W 0.5SOL/mo', callback_data: 'pro3'}
          ],
          [
            {text: '⚡️ Zeus 600W 1SOL/mo', callback_data: 'pro4'}
          ],
          [
            {text: 'Back', callback_data: 'Back'}
          ]
        ] 
        return proinlineKeys
      }else if(WalletLimitData === 400){
        const proinlineKeys = [
          [
            {text: '⚡️ Zeus 600W 1SOL/mo', callback_data: 'pro4'}
          ],
          [
            {text: 'Back', callback_data: 'Back'}
          ]
        ] 
        return proinlineKeys
      }else if(WalletLimitData === 600){
        const proinlineKeys = [
          [
            {text: 'Back', callback_data: 'Back'}
          ]
        ] 
        return proinlineKeys
      }else if(pro === false){
        const proinlineKeys = [
          [
            {text: '🐦‍🔥 Phoenix 100W 0.2SOL/mo', callback_data: 'pro1'}
          ],
          [
            {text: '🎠 Valkyrie 200W 0.3SOL/mo', callback_data: 'pro2'}
          ],
          [
            {text: '🪬 Odin 400W 0.5SOL/mo', callback_data: 'pro3'}
          ],
          [
            {text: '⚡️ Zeus 600W 1SOL/mo', callback_data: 'pro4'}
          ]
        ] 
        return proinlineKeys
      }
    }else{
     const proinlineKeys = [
      [
        {text: '🐦‍🔥 Phoenix 100W 0.2SOL/mo', callback_data: 'pro1'}
      ],
      [
        {text: '🎠 Valkyrie 200W 0.3SOL/mo', callback_data: 'pro2'}
      ],
      [
        {text: '🪬 Odin 400W 0.5SOL/mo', callback_data: 'pro3'}
      ],
      [
        {text: '⚡️ Zeus 600W 1SOL/mo', callback_data: 'pro4'}
      ]
        ] 
        return proinlineKeys
    }
  }catch(e){
    console.log('error')
  }
}

function deleteResponse(){
  const responseArray = ["That wallet? Yeah, it's history. Ancient history 🚮", "Your wallet has been vaporized! No trace left behind 💨", "That wallet is toast! Crispy and gone. Forever! 🔥", "Wallet successfully sent to the digital graveyard. RIP. 🪦"]
  const randomIndex = Math.floor(Math.random() * responseArray.length);
    return responseArray[randomIndex];
}

module.exports = {startMessage, addMessage, deleteMessage, socialsMessage, transferKeyMsg, supportMessage, manageMessage, inlineKeys, supportKeys, buyButtons, walletsLimitplan, upgradePro, deleteResponse}