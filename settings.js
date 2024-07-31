const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);


function settings(){
  bot.command('settings', (ctx)=>{
    ctx.reply('You just got to settings')
  })
}

module.exports = settings

