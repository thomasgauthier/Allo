const Discord = require('discord.js');
const levenshtein = require('js-levenshtein');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.id != client.user.id) {
    if (msg.content.match(/(^|\W)allo(\W|$)/gi)) {
      msg.channel.send("allo");
      msg.react("👋");
      return;
    }

    if (msg.content.match(/(?<![0-9])69(?![0-9])/gi)) {
      msg.channel.send("nice");
      return;
    }

    if (msg.content === "nice") {
      msg.channel.send("nice");
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