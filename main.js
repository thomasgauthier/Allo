const { Client, MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const levenshtein = require('js-levenshtein');

const client = new Client();

async function complimentAsync (url, msg, target) {
  let response = await fetch(url);
  let data = await response.json();

  let compliment = data['compliment']
  msg.channel.send("<@" + target + ">, " + compliment);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.id != client.user.id) {
    if (msg.mentions.users.size && msg.mentions.users.some(u => u.id === client.user.id)) {
      msg.reply("allo");
    }

    if (msg.content.match(/(^|\W)allo(\W|$)/gi)) {
      msg.channel.send("allo");
      msg.react("👋");
      return;
    }

    if (msg.content.match(/(?<![0-9])69(?![0-9])/gi)) {
      msg.channel.send("nice");
      return;
    }

    if (msg.content.match(/^nice$/i)) {
      msg.channel.send("nice");
      return;
    }

    if (msg.content.match(/(^|\W)feel(\W|$)/gi)) {
      const reactionEmoji = msg.guild.emojis.cache.find(emoji => emoji.name === 'feeeel');
      if (reactionEmoji) {
        msg.react(reactionEmoji);
      }
      return;
    }

    if (msg.content.startsWith('/nickname')) {
      const args = msg.content.split(" ");

      if (args.length == 3) {
        const role = args[1];
        const nickname = args[2];

        /** @type {import("discord.js").Guild} */
        const guild = msg.channel.guild;

        const member = guild.members.cache.find(member => {
          return member.roles.cache.some(r => {
            return r.name.toLowerCase() == role.toLowerCase()
          });
        });

        if (member) {
          member.setNickname(nickname);
        } else {

          const roles = guild.roles.cache;
          const scores = roles.map(r => ({ name: r.name, score: levenshtein(r.name, role) })).sort((a, b) => a.score - b.score);

          msg.reply(`No user ${role} found, did you mean ${scores[0].name}?`);
        }
      }
    }
    
    if (msg.content.match(/(^|\W)-😘(\W|$)/gi)){
      let targetMembers = msg.mentions.members;
      if (targetMembers.size > 0){
        targetMembers.forEach(target => {
          complimentAsync('https://complimentr.com/api', msg, target)
        });
      }
      else{
        complimentAsync('https://complimentr.com/api', msg, msg.author)
      }
      
      return;
    }
  }

});

client.login(process.env.TOKEN);