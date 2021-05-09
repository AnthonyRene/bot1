const { MessageEmbed } = require("discord.js");
const _ = require("lodash");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "queue",
  description: "Die Serverwarteschlange",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["q"],
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

    if (!player.queue || !player.queue.length || player.queue === 0) {
      let QueueEmbed = new MessageEmbed()
        .setAuthor("Spielt gerade", client.config.IconURL)
        .setColor("0x00AE86")
        .setDescription(`[${player.queue.current.title}](${player.queue.current.uri})`)
        .addField("Angefordert von", `${player.queue.current.requester}`, true)
        .addField(
          "Dauer",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`[${prettyMilliseconds(player.position, {colonNotation: true})} / ${prettyMilliseconds(player.queue.current.duration, {colonNotation: true})}]\``
        )
        .setThumbnail(player.queue.current.displayThumbnail());
      return message.channel.send(QueueEmbed);
    }

    let Songs = player.queue.map((t, index) => {
      t.index = index;
      return t;
    });

    let ChunkedSongs = _.chunk(Songs, 10);

    let Pages = ChunkedSongs.map((Tracks) => {
      let SongsDescription = Tracks.map(
        (t) => `\`${t.index + 1}.\` [${t.title}](${t.uri}) \n\`${prettyMilliseconds(t.duration, {colonNotation: true})}\` **|** Angefordert von: ${t.requester}\n`
      ).join("\n");

      let Embed = new MessageEmbed()
      .setAuthor("Spielt gerade", client.config.IconURL)
      .setColor("0x00AE86")
      .setDescription(`[${player.queue.current.title}](${player.queue.current.uri})`)
      .addField("Angefordert von", `${player.queue.current.requester}`, true)
      .addField(
        "Dauer",
          `${player.queue.current.requester}`,
          true
        )
        .addField(
          "Current song duration:",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`${prettyMilliseconds(player.position, {colonNotation: true})} / ${prettyMilliseconds(player.queue.current.duration, {colonNotation: true})}\``
        )
        .setThumbnail(player.queue.current.displayThumbnail())
        

      return Embed;
    });

    if (!Pages.length || Pages.length === 1)
      return message.channel.send(Pages[0]);
    else client.Pagination(message, Pages);
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
    if (!player) return interaction.send("❌ | **Momentan spielt der Musik Bot keine Musik!**");

    if (!player.queue || !player.queue.length || player.queue === 0) {
      let QueueEmbed = new MessageEmbed()
      .setAuthor("Spielt gerade", client.config.IconURL)
      .setColor("0x00AE86")
      .setDescription(`[${player.queue.current.title}](${player.queue.current.uri})`)
      .addField("Angefordert von", `${player.queue.current.requester}`, true)
      .addField(
        "Dauer",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`[${prettyMilliseconds(player.position, {colonNotation: true})} / ${prettyMilliseconds(player.queue.current.duration, {colonNotation: true})}]\``
        )
        .setThumbnail(player.queue.current.displayThumbnail());
      return interaction.send(QueueEmbed);
    }

    let Songs = player.queue.map((t, index) => {
      t.index = index;
      return t;
    });

    let ChunkedSongs = _.chunk(Songs, 10);

    let Pages = ChunkedSongs.map((Tracks) => {
      let SongsDescription = Tracks.map(
        (t) => `\`${t.index + 1}.\` [${t.title}](${t.uri}) \n\`${prettyMilliseconds(t.duration, {colonNotation: true})}\` **|** Angefordert von: ${t.requester}\n`
      ).join("\n");

      let Embed = new MessageEmbed()
      .setAuthor("Spielt gerade", client.config.IconURL)
      .setColor("0x00AE86")
      .setDescription(`[${player.queue.current.title}](${player.queue.current.uri})`)
      .addField("Angefordert von", `${player.queue.current.requester}`, true)
      .addField(
        "Dauer",
          `${player.queue.current.requester}`,
          true
        )
        .addField(
          "Aktuelle Songdauer:",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`[${prettyMilliseconds(player.position, {colonNotation: true})} / ${prettyMilliseconds(player.queue.current.duration, {colonNotation: true})}]\``
        )
        .setThumbnail(player.queue.current.displayThumbnail())
        

      return Embed;
    });

    if (!Pages.length || Pages.length === 1)
      return interaction.send(Pages[0]);
    else client.Pagination(interaction, Pages);
  },
  }
};
