const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "To know about the bot and commands",
  usage: "[command]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
   run: async (client, message, args, { GuildDB }) => {
    let Commands = client.commands.map(
      (cmd) =>
        `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
          cmd.name
        }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    );

    let Embed = new MessageEmbed()
      .setAuthor(`Befehle für ${client.user.username}`, client.config.IconURL)
      .setColor("0x00AE86")
      .setTitle(``
      ).setDescription(`${Commands.join("\n")}

      Discord Music Bot Version: v${require("../package.json").version}
      [✨ Support Discord](https://discord.gg/8tg6twfq) | By [MindOF]()`);
    if (!args[0]) message.channel.send(Embed);
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendError(message.channel, "Unable to find that command");

      let embed = new MessageEmbed()
        .setAuthor(`Command: ${cmd.name}`, client.config.IconURL)
        .setDescription(cmd.description)
        .setColor("0x00AE86")
        //.addField("Name", cmd.name, true)
        .addField("Aliases", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          "Usage",
          `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "Permissions",
          "Member: " +
            cmd.permissions.member.join(", ") +
            "\nBot: " +
            cmd.permissions.channel.join(", "),
          true
        )
        .setFooter(
          `Prefix - ${
            GuildDB ? GuildDB.prefix : client.config.DefaultPrefix
          }`
        );

      message.channel.send(embed);
    }
  },

SlashCommand: {
    options: [
      {
        name: "command",
        description: "Command help",
        value: "command",
        type: 3,
        required: false,
        options: [],

    run: async (client, interaction, args, { GuildDB }) => {
      let Commands = client.commands.map(
        (cmd) =>
          `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
      );
  
      let Embed = new MessageEmbed()
        .setAuthor(`Befehle für ${client.user.username}`, client.config.IconURL)
        .setColor("0x00AE86")
        .setFooter(``
        ).setDescription(`${Commands.join("\n")}
  
  Discord Music Bot Version: v${require("../package.json").version}
  [✨ Support Discord](https://discord.gg/8tg6twfq) | By [MindOF]`);
      if (!args[0]) interaction.send(Embed);
      else {
        let cmd =
          client.commands.get(args[0]) ||
          client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
        if (!cmd)
          return client.sendError(interaction, "Unable to find that command");
  
        let embed = new MessageEmbed()
          .setAuthor(`Command: ${cmd.name}`, client.config.IconURL)
          .setDescription(cmd.description)
          .setColor("0x00AE86")
          //.addField("Name", cmd.name, true)
          .addField("Aliases", cmd.aliases.join(", "), true)
          .addField(
            "Usage",
            `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${
              cmd.name
            }\`${cmd.usage ? " " + cmd.usage : ""}`,
            true
          )
          .addField(
            "Permissions",
            "Member: " +
              cmd.permissions.member.join(", ") +
              "\nBot: " +
              cmd.permissions.channel.join(", "),
            true
          )
          .setFooter(
            `Prefix - ${
              GuildDB ? GuildDB.prefix : client.config.DefaultPrefix
            }`
          );
  
        interaction.send(embed);
      }
  }},
],
}};
