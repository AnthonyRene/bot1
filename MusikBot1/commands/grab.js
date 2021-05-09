const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "grab",
  description: "Speichert das aktuell wiedergegebene Lied in Ihren Direktnachrichten",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["save"],
/**
*
* @param {import("../structures/DiscordMusicBot")} client
* @param {import("discord.js").Message} message
* @param {string[]} args
* @param {*} param3
*/
run: async (client, message, args, { GuildDB }) => {
  let player = await client.Manager.get(message.guild.id);
  if (!player) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");
   message.author.send(new MessageEmbed()
   .setAuthor(`Gespeichertes Lied:`, client.user.displayAvatarURL({
    dynamic: true
  }))
  .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
  .setURL(player.queue.current.uri)
  .setColor("0x00AE86")
  .setTitle(`**${player.queue.current.title}**`)
  .addField(`⌛ Dauer: `, `\`${prettyMilliseconds(player.queue.current.duration, {colonNotation: true})}\``, true)
  .addField(`🎵 Author: `, `\`${player.queue.current.author}\``, true)
  .addField(`▶ Spiel es:`, `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix
  }play ${player.queue.current.uri}\``)
  .addField(`🔎 Gespeichert in:`, `<#${message.channel.id}>`)
  .setFooter(`Angefordert von: ${player.queue.current.requester.tag} | ${message.guild.name}`, player.queue.current.requester.displayAvatarURL({
    dynamic: true
  }))
    ).catch(e=>{
      return message.channel.send("**:x: Ihre DMs sind deaktiviert**")
    })    

    message.react("✅").catch(e=>console.log("Konnte nicht reagieren"))
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
    let player = await client.Manager.get(interaction.guild_id);
    if (!player) return client.sendTime(interaction, "❌ | **Nothing is playing right now...**");
    try{
    let embed = new MessageEmbed()
      .setAuthor(`Gespeichert von `, interaction.guild.name, client.user.displayAvatarURL())
      .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
      .setURL(player.queue.current.uri)
      .setColor("0x00AE86")
      .setTimestamp()
      .setTitle(`**${player.queue.current.title}**`)
      .addField(`⌛ Dauer: `, `\`${prettyMilliseconds(player.queue.current.duration, {colonNotation: true})}\``, true)
      .addField(`🎵 Author: `, `\`${player.queue.current.author}\``, true)
      .addField(`▶ Spiel es:`, `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix
        }play ${player.queue.current.uri}\``)
      .addField(`🔎 Gespeichert in:`, `<#${interaction.channel_id}>`)
      .setFooter(`Angefordert von: ${player.queue.current.requester.tag} | ${interaction.guild.name}`, player.queue.current.requester.displayAvatarURL({
        dynamic: true
      }))
      interaction.send(embed);
    }catch(e) {
      return client.sendTime(interaction, "**❌ | Ihre DMs sind deaktiviert**")
    }

    interaction.react("✅").catch(e => console.log("❌ | Konnte nicht reagieren"))
  },
  },
};