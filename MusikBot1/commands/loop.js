const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "loop",
    description: "Überspringt ein Song",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["l", "repeat"],
    /**
      *
      * @param {import("../structures/DiscordMusicBot")} client
      * @param {import("discord.js").Message} message
      * @param {string[]} args
      * @param {*} param3
      */
    run: async (client, message, args, { GuildDB }) => {
      let player = await client.Manager.get(message.guild.id);
      if (!player) return client.sendTime(message.channel, "❌ | **Momentan spielt der Musik Bot keine Musik!**");
      if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Sie müssen sich in einem Sprachkanal befinden, um etwas abspielen zu können!**");
      //else if(message.guild.me.voice && message.guild.me.voice.channel.id !== message.member.voice.channel.id)return client.sendTime(message.channel, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);

        if (player.trackRepeat) {
          player.setTrackRepeat(false)
          client.sendTime(message.channel, `❌ | Loop \`Deaktiviert\``);
        } else {
          player.setTrackRepeat(true)
          client.sendTime(message.channel, `💠 | Loop \`Aktiviert\``);
        }
    },
    SlashCommand: {
       /**
       *
       * @param {import("../structures/DiscordMusicBot")} client
       * @param {import("discord.js").Message} message
       * @param {string[]} args
       * @param {*} param3
       */
        run: async (client, interaction, args, { GuildDB }) => {
          const guild = client.guilds.cache.get(interaction.guild_id);
          const member = guild.members.cache.get(interaction.member.user.id);
          const voiceChannel = member.voice.channel;
          let player = await client.Manager.get(interaction.guild_id);
          if (!player) return client.sendTime(interaction, "❌ | **Momentan spielt der Musik Bot keine Musik!**"); 
          if (!member.voice.channel) return interaction.send("❌ | Sie müssen sich in einem Sprachkanal befinden, um etwas abspielen zu können!");
          if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return interaction.send(`❌ | Du musst dran sein ${guild.me.voice.channel} um diesen Befehl zu verwenden.`);

            if(player.trackRepeat){
              player.setTrackRepeat(false)
              client.sendTime(message.channel, `❌ | Loop \`Deaktiviert\``);
            } else {
              player.setTrackRepeat(true)
              client.sendTime(message.channel, `💠 | Loop \`Aktiviert\``);
              }
          console.log(interaction.data)
        }
      }    
};