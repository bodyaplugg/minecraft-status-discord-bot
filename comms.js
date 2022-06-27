const config = require('./config.json');
const Discord = require('discord.js');
const prefix = config.prefix,
               token = config.token,
               ip = config.serverip,
               port = config.serverport;
const Gamedig = require('gamedig');
const { MessageEmbed } = require('discord.js');


function status(client, msg, args) {

  Gamedig.query({
    type: 'minecraft',
    host: ip,
    port: port,
  }).then((state) => {
    const status = new MessageEmbed()
         .setColor('#05fb22')
         .setTitle('Server status:')
         .addField('Name:', state.name, false)
		     .addField('Online:', state.players.length + "/" + state.raw.vanilla.maxplayers, false)
         .addField('Players:', showPlayers(state.players))
         .setTimestamp();
    msg.channel.send({ embeds: [status] });
    console.log(state);
   }).catch((error) => {
    console.log("Server is offline");
    const errormsg = new MessageEmbed()
          .setColor('#ff0000')
          .setTitle('Server is offline or there is error');
    msg.channel.send({ embeds: [errormsg] });
});
}

function showPlayers(playersArray) {
  var playersList = "";

  for (i = 0; i < playersArray.length; i++) {
    playersList = playersList + (i + 1) + ". " + playersArray[i].name + `
    `;
  }

  if (playersList == "") {
    playersList = "-";
  };

  return playersList;
}

var comms_list = [
  {
   name: "status",
   out: status,
   about: "Check server status"
   },
];


module.exports.comms = comms_list;
