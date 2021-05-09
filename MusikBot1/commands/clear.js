const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Löscht die Serverwarteschlange",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["cl", "cls"],
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

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return message.channel.send("Es sind keine Songs in der Warteschlange zu löschen!");
    player.queue.clear();
    let embed = new MessageEmbed()
      .setColor("0x00AE86")
      .setDescription("💠 | **Du hast alle Nachrichten gelöscht!**" ,message.guild.iconURL({dynamic: true}))
    await message.channel.send(embed);
  },

  SlashCommand: {
    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);
      if (!player) return interaction.send("❌ | **Momentan spielt der Musik Bot keine Musik!**");
  
      if (!player.queue || !player.queue.length || player.queue.length === 0)return interaction.send("Es sind keine Songs in der Warteschlange zu löschen!");
      player.queue.clear();
      let embed = new MessageEmbed()
      .setColor("0x00AE86")
      .setDescription("💠 | **Du hast alle Nachrichten gelöscht!**" ,message.guild.iconURL({dynamic: true}))
      await interaction.send(embed);
    },
  }
};
