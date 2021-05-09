const { MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");

module.exports = {
  name: "skipto",
  description: `Springe zu einem Song in der Warteschlange`,
  usage: "<number>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["st"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
   run: async (client, message, args, { GuildDB }) => {

    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false,
    });
    
    if (!player) return client.sendTime(message.channel, "❌ | **Momentan spielt der Musik Bot keine Musik!**");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Sie müssen sich in einem Sprachkanal befinden, um etwas abspielen zu können!**");
    //else if(message.guild.me.voice && message.guild.me.voice.channel.id !== message.member.voice.channel.id)return client.sendTime(message.channel, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);
     
    try {
      if (!args[0])
        return message.channel.send(new MessageEmbed()
          .setColor("0x00AE86")
          .setDescription(`**Verwendung**: \`${GuildDB.prefix}skipto [number]\``)
        );
      if (Number(args[0]) > player.queue.size)
        return message.channel.send(new MessageEmbed()
          .setColor("0x00AE86")
          .setDescription(`❌ | Das Lied ist nicht in der Warteschlange! Bitte versuche es erneut!`)
        );
      player.queue.remove(0, Number(args[0]) - 1);
      player.stop()
      return message.channel.send(new MessageEmbed()
        .setDescription(`⏭ Skipped \`${Number(args[0] - 1)}\` songs`)
        .setColor("G0x00AE86")
      );
    } catch (e) {
      console.log(String(e.stack).bgRed)
      client.sendError(
        message.channel,
        "Etwas ist schief gelaufen."
      );
    }
  },
  SlashCommand: {
    options: [
      {
          name: "number",
          value: "[number]",
          type: 4,
          required: true,
          description: "Entfernen Sie ein Lied aus der Warteschlange",
      },
  ],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
   run: async (client, interaction, args, { GuildDB }) => {

    const player = client.Manager.create({
      guild: interaction.guild_id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
      selfDeafen: false,
    });

    try {
      if (!args[0])
        return interaction.send(new MessageEmbed()
          .setColor("0x00AE86")
          .setDescription(`**Verwendung**: \`${GuildDB.prefix}skipto <number>\``)
        );
      if (Number(args[0]) > player.queue.size)
        return interaction.send(new MessageEmbed()
          .setColor("0x00AE86")
          .setTitle(`❌ | Das Lied ist nicht in der Warteschlange! Bitte versuche es erneut!`)
        );
      player.queue.remove(0, Number(args[0]) - 1);
      player.stop()
      return interaction.send(new MessageEmbed()
        .setDescription(`⏭ Skipped \`${Number(args[0])}\` songs`)
        .setColor("0x00AE86")
      );
    } catch (e) {
      console.log(String(e.stack).bgRed)
      client.sendError(
        interaction,
        "❌ | Etwas ist schief gelaufen."
      );
    }
  },
  }
};
