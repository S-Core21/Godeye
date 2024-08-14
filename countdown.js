const axios = require("axios");
const {apiUrl} = require('./api')
const {haltWallets} = require('./webhook')
const {getDaysRemaining} = require('./formatNumber')
const {fetchAllUsers} = require('./users')


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

async function sendReminder(bot, userCache) {
  try {
    userCache.forEach(async (user) => {
      const checkExpiry = async () => {
        try {
          const expiryDate = await getCountdown(user.chat_id);
          const daysLeft = getDaysRemaining(expiryDate);
          console.log('days left', daysLeft);

          if (daysLeft === 3) {
            await bot.telegram.sendMessage(user.chat_id, "🚨🚨🚨\nYour Pro plan expires in 3 days. To continue enjoying all its benefits, kindly renew your subscription.👇", {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [[{ text: "🔼 Upgrade", callback_data: "Pro" }]],
              },
            }).then((result) => {
              bot.telegram.pinChatMessage(user.chat_id, result.message_id);
            }).catch(err => console.log('not pinned'));
          } else if (daysLeft === 1) {
            await bot.telegram.sendMessage(user.chat_id, "🚨🚨🚨\nYour Pro plan expires in 24 hours. To continue enjoying all its benefits, kindly renew your subscription.👇", {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [[{ text: "🔼 Upgrade", callback_data: "Pro" }]],
              },
            }).then((result) => {
              bot.telegram.pinChatMessage(user.chat_id, result.message_id);
            }).catch(err => console.log('not pinned'));
          } else if (daysLeft === 0) {
            await axios.post(
              `${apiUrl}${user.chat_id}/setPro`,
              { pro: false },
            );
            await axios.post(
              `${apiUrl}${user.chat_id}/setWalletLimit`,
              { walletLimit: 20 },
            );
            user.walletLimit = 20;
            user.wallets = user.wallets.slice(0, 20); // Update the wallets array
            userCache.set(user.username, user); // Put the updated user back into the cache
            await fetchAllUsers(userCache)
            // userCache.set(user.username, {
            //   ...user,
            //   wallets : user.wallets.slice(0, 20)
            // });
            // const pro = await isPro(user.chat_id);
            const pro = false
            console.log(pro, 'expired')
            // await haltWallets(user.chat_id, pro);
            await bot.telegram.sendMessage(user.chat_id, "🚨🚨🚨\nYour Pro plan has expired. To continue enjoying all its benefits, kindly renew your subscription.👇", {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [[{ text: "🔼 Upgrade", callback_data: "Pro" }]],
              },
            }).then((result) => {
              bot.telegram.pinChatMessage(user.chat_id, result.message_id);
            }).catch(err => console.log('not pinned'));

            return; // Stop further checks for this user
          }
        } catch (e) {
          console.log('Error checking expiry:', e);
        }

        // Schedule next check
        setTimeout(checkExpiry, 21600000); // 1 hour
      };

      // Start the check
      checkExpiry();
    });
  } catch (e) {
    console.log('Error in sendReminder:');
  }
}

// async function sendReminder(bot, userCache){
//   try{
//     userCache.forEach(async (user) => {
//       setInterval(async () =>{
//         const expiryDate = await getCountdown(user.chat_id)
//         const daysLeft = getDaysRemaining(expiryDate)
//         console.log('days left', daysLeft)
//         if(daysLeft === 3){
//             bot.telegram.sendMessage(user.chat_id, "🚨🚨🚨\nYour Pro plan expires in 3 days. To continue enjoying all its benefits, kindly renew your subscription.👇", {
//               parse_mode: "HTML",
//               reply_markup: {
//                 inline_keyboard: [[{ text: "🔼 Upgrade", callback_data: "Pro" }]],
//               },
//             })
//             .then((result) => { 
//               bot.telegram.pinChatMessage(user.chat_id, result.message_id)
//             })
//             .catch(err => console.log('not pinned'))
//           }else if(daysLeft === 1){
//             bot.telegram.sendMessage(user.chat_id, "🚨🚨🚨\nYour Pro plan expires in 24 hours. To continue enjoying all its benefits, kindly renew your subscription.👇", {
//               parse_mode: "HTML",
//               reply_markup: {
//                 inline_keyboard: [[{ text: "🔼 Upgrade", callback_data: "Pro" }]],
//               },
//             })
//             .then((result) => { 
//               bot.telegram.pinChatMessage(user.chat_id, result.message_id)
//             })
//             .catch(err => console.log('not pinned'))
//           }else if(expiryDate === 0){
//             bot.telegram.sendMessage(user.chat_id, "🚨🚨🚨\nYour Pro plan has expired. To continue enjoying all its benefits, kindly renew your subscription.👇", {
//               parse_mode: "HTML",
//               reply_markup: {
//                 inline_keyboard: [[{ text: "🔼 Upgrade", callback_data: "Pro" }]],
//               },
//             })
//             .then((result) => { 
//               bot.telegram.pinChatMessage(user.chat_id, result.message_id)
//             })
//             .catch(err => console.log('not pinned'))
//             await axios.post(
//               `${apiUrl}${user.chat_id}/setPro`,
//               { pro: false },
//             );
//             const pro = await isPro(user.chat_id)
//             await haltWallets(user.chat_id, pro)
//           }
//       }, 3600000)
//     });
//   }catch(e){
//     console.log('no expiry date')
//   }
// }

module.exports = {getCountdown, isPro, sendReminder}