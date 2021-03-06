const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const lyricsFinder = require("lyrics-finder");
const _ = require("lodash");

module.exports = {
  name: "lyrics",
  description: "Suche nach Texten für jedes Lied",
  usage: "[Song Name]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["ly"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    let SongTitle = args.join(" ");
    if (!args[0] && !player)
      return message.channel.send("❌ | **Momentan spielt der Musik Bot keine Musik!**");
    if (!args[0]) SongTitle = player.queue.current.title;
    if (!args[0]) SongURL = player.queue.current.uri;

    let lyrics = await lyricsFinder(SongTitle);
    if (!lyrics)
      return message.channel.send(`**Keine Texte gefunden für -** \`${SongTitle}\``);
    lyrics = lyrics.split("\n"); //spliting into lines
    let SplitedLyrics = _.chunk(lyrics, 45); //45 lines each page

    let Pages = SplitedLyrics.map((ly) => {
      let em = new MessageEmbed()
        .setAuthor(SongTitle + "  — Text", client.config.IconURL)
        .setColor("0x00AE86")
        .setDescription(ly.join("\n"));

      if (args.join(" ") !== SongTitle)
        em.setThumbnail(player.queue.current.displayThumbnail());

      return em;
    });

    if (!Pages.length || Pages.length === 1)
      return message.channel.send(Pages[0]);
    else return client.Pagination(message, Pages);
  },

  SlashCommand: {
    options: [

      {
        name: "song",
        value: "song",
        type: 3,
        description: "Holen Sie sich die Texte eines Liedes",
        required: false,
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
      let SongTitle = interaction.data.options[0].value
      if (!SongTitle && !player)
        return interaction.send("❌ | Momentan spielt der Musik Bot keine Musik!");
      if (!SongTitle) SongTitle = player.queue.current.title;

      let lyrics = await lyricsFinder(SongTitle);
      if (!lyrics)
        return interaction.send("❌ | Keine Texte gefunden für " + SongTitle);
      lyrics = lyrics.split("\n"); //spliting into lines
      let SplitedLyrics = _.chunk(lyrics, 45); //45 lines each page

      let Pages = SplitedLyrics.map((ly) => {
        let em = new MessageEmbed()
          .setAuthor(SongTitle + "  — Lyrics", client.config.IconURL)
          .setColor("0x00AE86")
          .setDescription(ly.join("\n"));

        if (SongTitle !== SongTitle)
          em.setThumbnail(player.queue.current.displayThumbnail());

        return em;
      });

        return interaction.send(Pages[0]);
    }
  }
}