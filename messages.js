const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);
const axios = require("axios");
const {isPro} = require('./countdown')
const {apiUrl} = require('./api')
const {planName} = require('./wallets')

const startMessage =
  "<b>Listen, 100x is more easier than you think, the secret is to get in early.</b>\n\n <b>I can help you monitor transactions accross your solana wallets. Simply 'ADD' wallets and you'll receive notifications for any activity performed by the wallets</b>";
const addMessage =
  'Yay! A new wallet. Now send me your wallet details in this format👇\n\n“Wallet nickname group”\nExample:\n“HsDjdEk8RdyZqHCj9x2RLZuQxG6VW5Bugstcb1QXYDSR Sixth✅ A”\n\n“4Be9CvxqHW6BYiRAxW9Q3xu1ycTMWaL5z8NX4HR3ha7t Mitch🤡 B”\n\n📥Grouping helps categorize good or bad wallets,groups include: \nALPHA,BETA,DELTA,GAMMA with abbreviations A,B,D,G.';
const deleteMessage = 'send me the wallet you want to unalive?☠️\n\nTo unalive multiple wallets send me each wallet on a new line in this format👇 \n\nWallet 1\nWallet 2\nWallet 3'
const transferKeyMsg = 'You can move your wallet data to a new Telegram account if you lose your device or your telegram gets banned\n\nTips: We would never ask for your transfer key via phone, email, or text. Protect yourself from scams because anyone who has this key can access your wallets.\n\n➡️Import wallet\n⬅️Export wallet'
const supportMessage = 'For complaints, support, or feedback, kindly contact\n\n[kaiju](https://t.me/Division_3)\n[Dev S](https://t.me/Devvv_S)'

const socialsMessage = `Connect with us on social media for the latest updates and insights.\n\n🤖Bot: Godeye_wallet_tracker\n\n🦅Twitter: https://x.com/godeye_network?s=21 \n\n😎Lounge: https://t.me/Godeye_olympus \n\n🚨Channel: https://t.me/Godeye_news_channel \n\n🌐Website: https://Godeyenetwork.org`

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

function buyButtons(mint){
  const inlineButtons = [
    [
      {text: 'Bonk', url: `t.me/bonkbot_bot?start=${mint}`},
      {text: 'Trojan', url: `t.me/solana_trojanbot?start=${mint}`},
      {text: 'STB', url: `t.me/solanaTradingBot?start=${mint}`},
    ],
    [
      {text: 'Pepe', url: `t.me/pepeboost_sol_bot?start=${mint}`},
      {text: 'Bullx', url: `https://bullx.io/terminal?chainId=1399811149&address=${mint}`},
      {text: 'PH', url: `https://photon-sol.tinyastro.io/en/lp/${mint}`}
    ]
  ]
  return inlineButtons
}

async function walletsLimitplan(chatID){
  try{
    const response = await axios.get(
      `${apiUrl}${chatID}/walletLimit`,
    );
    const WalletLimitData = response.data.walletLimit;
    const plan = planName(100)
    const proMessage =`Current plan: ${plan} \n🏦 All wallets: x/${100}\n❌ Expires: May 20, 2024\n\n📝 How to upgrade \n\nOnce you've transferred the funds, then select a plan. A fee of 0.2 SOL will be deducted from your account, and your wallet limit will be automatically increased.\n\nChoose a plan 👇`
      return proMessage
  }catch(e){
    console.log('error')
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
            {text: '🎠 Valkyrie 0.3 SOL 1M/200W', callback_data: 'pro2'}
          ],
          [
            {text: '🪬 Odin 0.5 SOL 1M/400W', callback_data: 'pro3'}
          ],
          [
            {text: '⚡️ Zeus 1 SOL 1M/600W', callback_data: 'pro4'}
          ]
        ] 
        return proinlineKeys
      }else if(WalletLimitData === 200){
        const proinlineKeys = [
          [
            {text: '🪬 Odin 0.5 SOL 1M/400W', callback_data: 'pro3'}
          ],
          [
            {text: '⚡️ Zeus 1 SOL 1M/600W', callback_data: 'pro4'}
          ],
          [
            {text: 'Back', callback_data: 'Back'}
          ]
        ] 
        return proinlineKeys
      }else if(WalletLimitData === 400){
        const proinlineKeys = [
          [
            {text: '⚡️ Zeus 1 SOL 1M/600W', callback_data: 'pro4'}
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
            {text: '🐦‍🔥 Phoenix 0.2 SOL 1M/100W', callback_data: 'pro1'}
          ],
          [
            {text: '🎠 Valkyrie 0.3 SOL 1M/200W', callback_data: 'pro2'}
          ],
          [
            {text: '🪬 Odin 0.5 SOL 1M/400W', callback_data: 'pro3'}
          ],
          [
            {text: '⚡️ Zeus 1 SOL 1M/600W', callback_data: 'pro4'}
          ]
        ] 
        return proinlineKeys
      }
    }else{
     const proinlineKeys = [
          [
            {text: '🐦‍🔥 Phoenix 0.2 SOL 1M/100W', callback_data: 'pro1'}
          ],
          [
            {text: '🎠 Valkyrie 0.3 SOL 1M/200W', callback_data: 'pro2'}
          ],
          [
            {text: '🪬 Odin 0.5 SOL 1M/400W', callback_data: 'pro3'}
          ],
          [
            {text: '⚡️ Zeus 1 SOL 1M/600W', callback_data: 'pro4'}
          ]
        ] 
        return proinlineKeys
    }
  }catch(e){
    console.log('error')
  }
}

function deleteResponse(){
  const responseArray = ["That wallet? Yeah, it's history. Ancient history.", "Your wallet has been vaporized! No trace left behind.", "That wallet is toast! Crispy and gone. Forever!", "Wallet successfully sent to the digital graveyard. RIP."]
  const randomIndex = Math.floor(Math.random() * responseArray.length);
    return responseArray[randomIndex];
}

module.exports = {startMessage, addMessage, deleteMessage, socialsMessage, transferKeyMsg, supportMessage, inlineKeys, buyButtons, walletsLimitplan, upgradePro, deleteResponse}