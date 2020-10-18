const { Client, MessageAttachment } = require('discord.js');
const levenshtein = require('js-levenshtein');

const client = new Client();

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
      const attachment = new MessageAttachment('https://i.imgur.com/fccpbPf.jpg');
      msg.channel.send("", attachment);
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
  }

});

client.login(process.env.TOKEN);
