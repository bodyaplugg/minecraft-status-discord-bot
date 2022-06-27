const fs = require('fs'),
      config = require('./config.json'),
      prefix = config.prefix,
      token = config.token,
      ip = config.serverip,
      port = config.serverport,
      comms = require("./comms.js"),
      Gamedig = require('gamedig');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { MessageEmbed } = require('discord.js');

client.on('message', (msg) => {
  if (msg.author.username != client.user.username && msg.author.discriminator != client.user.discriminator) {
    var comm = msg.content.trim() + " ";
    var comm_name = comm.slice(0, comm.indexOf(" "));
    var messArr = comm.split(" ");

    for (comm_count in comms.comms) {
      var comm2 = prefix + comms.comms[comm_count].name;
      if (comm2 == comm_name) {
        comms.comms[comm_count].out(client, msg, messArr);
      }
    }
  }
});

function setActivity() {
  Gamedig.query({
    type: 'minecraft',
    host: ip,
    port: port,
}).then((state) => {
    let time = new Date();
    console.log(state.players.length + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
    online = state.players.length;
    client.user.setPresence({
        status: 'online',
        activities: [{
            type: 'WATCHING',
            name: 'Online: ' + online,
        }],
    });
  }).catch((error) => {
    online = "-";
    client.user.setPresence({
        status: 'idle',
        activities: [{
            type: 'WATCHING',
            name: 'Online: ' + online,
        }],
    });
})
};

client.on('ready', () => {
  console.log(`Bot is ready!`);
  let updateActivity = setInterval(setActivity, 1000);
});

client.login(token);

console.log('Succesfully connected!');
