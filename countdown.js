const axios = require("axios");
const {apiUrl} = require('./api')
const {haltWallets} = require('./webhook')
const {getDaysRemaining} = require('./formatNumber')


async function getCountdown(chatID) {
  try {
    const response = await axios.get(
      `${apiUrl}${chatID}/getCountdown`
    );
    const { countdownEndTime, remainingTime } = response.data;
    if (countdownEndTime) {
      console.log(`Countdown end time: ${remainingTime}`);
      return countdownEndTime;
    } else {
      console.log('Countdown end time is not defined');
      return null;
    }
  } catch (error) {
    console.error('Error fetching countdown');
  }
}


async function isPro(chatID){
  try{
    const response = await axios.get(
      `${apiUrl}${chatID}/pro`
    );
    const isProUser = response.data.pro 
    console.log(isProUser)
    return isProUser
  }catch(e){
    console.log('error')
  }
}

async function sendReminder(bot, userCache){
  userCache.forEach(async (user) => {
    setInterval(async () =>{
      const expiryDate = await getCountdown(user.chat_id)
      const daysLeft = getDaysRemaining(expiryDate)
      console.log('days left', daysLeft)
      if(daysLeft === 3){
        setTimeout(async () =>{
          bot.telegram.sendMessage(user.chat_id, "Your Pro plan will end in 3 days. Upgrade to get more wallets! or renew your plan to continue receiving notifications.");
        },7200000)
        }else if(daysLeft === 1){
          setTimeout(async () =>{
            bot.telegram.sendMessage(user.chat_id, "Your Pro plan will end in 1 day. Upgrade to get more wallets! or renew your plan to continue receiving notifications.");
          },7200000)
        }else if(expiryDate === 0){
        setTimeout(async () =>{
          bot.telegram.sendMessage(user.chat_id, "Your Pro plan has expired. Upgrade to get more wallets! or renew your plan to continue receiving notifications.");
          await axios.post(
            `${apiUrl}${user.chat_id}/setPro`,
            { pro: false },
          );
          const pro = await isPro(user.chat_id)
          await haltWallets(user.chat_id, pro)
        },3600000)
        }
    }, 120000)
  });
}

module.exports = {getCountdown, isPro, sendReminder}