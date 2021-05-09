const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

  module.exports = {
    name: "remove",
    description: `Entfernen Sie ein Lied aus der Warteschlange`,
    usage: "[number]",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["rm"],

    /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.players.get(message.guild.id);
    const song = player.queue.slice(args[0] - 1, 1); 
    if (!player) return client.sendTime(message.channel, "❌ | **Momentan spielt der Musik Bot keine Musik!**");
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Sie befinden sich in keinen Sprachkanal!**");
    //else if(message.guild.me.voice && message.guild.me.voice.channel.id !== message.member.voice.channel.id)return client.sendTime(message.channel, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);
        
    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return message.channel.send("In der Warteschlange ist nichts zu entfernen");
    let rm = new MessageEmbed()
      .setDescription(`✅ **|** track entfernt**\`${Number(args[0])}\`** aus der Warteschlange!`)
      .setColor("0x00AE86")
      if (isNaN(args[0]))rm.setDescription(`**💠 | **${client.config.prefix}\`entfernen [number]\``);
      if (args[0] > player.queue.length)
      rm.setDescription(`💠 | Die Warteschlange hat nur ${player.queue.length} songs!`);
    await message.channel.send(rm);
    player.queue.remove(Number(args[0]) - 1);
  },

  SlashCommand: {
    options: [
      {
          name: "remove",
          value: "[nummer]",
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
      let player = await client.Manager.get(interaction.guild_id);
      const song = player.queue.slice(args[0] - 1, 1);
      if (!player) return client.sendTime("❌ | **Momentan spielt der Musik Bot keine Musik!**");
      if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Sie befinden sich in keinen Sprachkanal!**");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | **Du musst drin sein ${guild.me.voice.channel} um diesen Befehl zu verwenden.**`);
  
      if (!player.queue || !player.queue.length || player.queue.length === 0)
      return client.sendTime("❌ | **Momentan spielt der Musik Bot keine Musik!**");
    let rm = new MessageEmbed()
      .setDescription(`✅ **|** track entfernt**\`${Number(args[0])}\`** aus der Warteschlange!`)
      .setColor("0x00AE86")
      if (isNaN(args[0]))rm.setDescription(`💠 | **${client.config.prefix}\`entfernen [number]\``);
      if (args[0] > player.queue.length)
      rm.setDescription(`💠 | Die Warteschlange hat nur ${player.queue.length}!`);
    await interaction.send(rm);
      player.queue.remove(Number(args[0]) - 1);
    },
  }
};