const { MessageEmbed, MessageReaction } = require("discord.js");

module.exports = {
  name: "config",
  description: "Bearbeiten Sie die Bot-Einstellungen",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: ["conf"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Config = new MessageEmbed()
      .setAuthor("Server Config", client.config.IconURL)
      .setColor("0x00AE86")
      .addField("Prefix", GuildDB.prefix, true)
      .addField("DJ Role", GuildDB.DJ ? `<@&${GuildDB.DJ}>` : "Nicht eingestellt", true)
      .setDescription(`
Was möchten Sie bearbeiten?

:one: - Server Prefix
:two: - DJ Role
`);

    let ConfigMessage = await message.channel.send(Config);
    await ConfigMessage.react("1️⃣");
    await ConfigMessage.react("2️⃣");
    let emoji = await ConfigMessage.awaitReactions(
      (reaction, user) =>
        user.id === message.author.id &&
        ["1️⃣", "2️⃣"].includes(reaction.emoji.name),
      { max: 1, errors: ["time"], time: 30000 }
    ).catch(() => {
      ConfigMessage.reactions.removeAll();
      Config.setDescription(
        "**❌ **| Sie haben zu lange gebraucht, um zu antworten. Führen Sie den Befehl erneut aus, um die Einstellungen zu bearbeiten."
      );
      ConfigMessage.edit(Config);
    });
    let isOk = false;
    try{
      emoji = emoji.first();
    }catch{
      isOk = true;
    }
    if(isOk)return//im idiot sry ;-;
    /**@type {MessageReaction} */
    let em = emoji;
    ConfigMessage.reactions.removeAll();
    if (em._emoji.name === "1️⃣") {
      await message.channel.send("**💠 **| Was möchten Sie ändern?");
      let prefix = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!prefix.first()) return message.channel.send("**❌ **| Sie haben zu lange gebraucht, um zu antworten.");
      prefix = prefix.first();
      prefix = prefix.content;

      await client.database.guild.set(message.guild.id, {
        prefix: prefix,
        DJ: GuildDB.DJ,
      });

      message.channel.send(
        "**💠 **| Das Gildenpräfix wurde erfolgreich als gespeichert `" + prefix + "`"
      );
    } else {
      await message.channel.send("**💠 **| Bitte erwähnen Sie die Rolle, die DJs haben sollen.");
      let role = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!role.first()) return message.channel.send("**❌ **| Sie haben zu lange gebraucht, um zu antworten.");
      role = role.first();
      if (!role.mentions.roles.first())
        return message.channel.send("**💠 **| Bitte erwähnen Sie die Rolle, die Sie nur für DJs wünschen.");
      role = role.mentions.roles.first();

      await client.database.guild.set(message.guild.id, {
        prefix: GuildDB.prefix,
        DJ: role.id,
      });

      message.channel.send(
        "**💠 **| Das Gildenpräfix wurde erfolgreich als gespeichert <@&" + role.id + ">"
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "Prefix",
        description: "Überprüfen Sie das Präfix des Bots",
        type: 1,
        required: false,
        options: [
          {
            name: "symbol",
            description: "Stellen Sie das Präfix des Bots ein",
            type: 3,
            required: true,
          }
        ]
      },
      {
        name: "DJRole",
        description: "Überprüfen Sie die DJ-Rolle",
        type: 1,
        required: false,
        options: [
          {
            name: "role",
            description: "Stellen Sie die DJ-Rolle ein",
            type: 8,
            required: true
          }
        ]
      }
    ],
    
    run: async (client, interaction, args, { GuildDB }) => {
      let config = interaction.data.options[0].name
      let member = await interaction.guild.members.fetch(interaction.user_id)
      if(config === "prefix"){
        if(interaction.data.options[0].options && interaction.data.options[0].options[0]){
          let prefix = interaction.data.options[0].options[0].value
          await client.database.guild.set(interaction.guild.id, {
            prefix: prefix,
            DJ: GuildDB.DJ,
          });
          interaction.send(`**💠 **| Das Präfix wurde jetzt auf gesetzt \`${prefix}\``)
        }else{
          interaction.send(`**💠 **| Präfix des Servers ist \`${GuildDB.prefix}\``)
        }
      }else if(config === "djrole"){
        if(interaction.data.options[0].options && interaction.data.options[0].options[0]){
          let role = interaction.guild.roles.cache.get(interaction.data.options[0].options[0].value)
          await client.database.guild.set(interaction.guild.id, {
            prefix: GuildDB.prefix,
            DJ: role.id,
          });
          interaction.send(`**💠 **| Die DJ-Rolle dieses Servers wurde erfolgreich in geändert ${role.name}`)
        }else{
          /**
           * @type {require("discord.js").Role}
           */
          let role = interaction.guild.roles.cache.get(GuildDB.DJ)
          interaction.send(`DJ Rolle des Servers ist ${role.name}`)
        }
      }
    }
  }
};
