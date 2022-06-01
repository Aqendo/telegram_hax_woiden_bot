const rp = require('request-promise');
const HTMLParser = require('node-html-parser');
const TelegramBot = require('node-telegram-bot-api');
const token = 'token';
const bot = new TelegramBot(token, {polling: true});

async function grabHax(msg) {
  let html = await rp("https://hax.co.id/create-vps/");
  const root = HTMLParser.parse(html);
  let text = "";
  let nodes;
  try{
     nodes = root.getElementById("datacenter").querySelectorAll("option");
  } catch (err) {
    return "hax.co.id: could not connect\n";
  }
  for (let i = 1; i < nodes.length; i++) {
      text+=nodes[i].text+"\n";
  }
  if (text == "") return "hax.co.id: full\n";
  else return "hax.co.id: \n" + text+"\n";
}
async function grabWoiden(msg) {
  let html = await rp("https://woiden.id/create-vps/");
  const root = HTMLParser.parse(html);
  let text = "";
  let nodes;
  try{
     nodes = root.getElementById("datacenter").querySelectorAll("option");
  } catch (err) {
    return "woiden.id: could not connect\n";
  }
  for (let i = 1; i < nodes.length; i++) {
      text+=nodes[i].text+"\n";
  }
  if (text == "") return "woiden.id: full\n";
  else return "woiden.id: \n" + text+"\n";
}

bot.onText(/\/hax/, async (msg, match) => {
  await bot.sendMessage(msg.chat.id, (await grabHax(msg)));
})

bot.onText(/\/woiden/, async (msg, match) => {
  await bot.sendMessage(msg.chat.id, (await grabWoiden(msg)));
})

bot.on("inline_query", async (query) => {
  if (query.query != "") return;
  let hax = await grabHax();
  let woiden = await grabWoiden();
  await bot.answerInlineQuery(query.id, [{
    id: '0',
    type: 'article',
    title: 'Hax.co.id seats',
    description: hax,
    message_text: hax
},
{
  id: '1',
  type: 'article',
  title: 'Woiden.id seats',
  description: woiden,
  message_text: woiden
},
{
  id: '2',
  type: 'article',
  title: 'Both seats',
  description: hax+"\n"+woiden,
  message_text: hax+"\n"+woiden
}])
});