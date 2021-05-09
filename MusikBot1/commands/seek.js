const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "seek",
    description: "Suchen Sie eine Position im Lied",
    usage: "<time s/m/h>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["forward"],
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
        if (!player.queue.current.isSeekable) return message.channel.send("**❌ **| Dieses Lied kann nicht suchen.");
        let SeekTo = client.ParseHumanTime(args.join(" "));
        if (!SeekTo) return message.channel.send("**💠 **| Bitte geben Sie eine Zeit ein, um zu suchen!");
        player.seek(SeekTo * 1000);
        message.react("✅");
    },

    SlashCommand: {
        options: [
            {
                name: "time",
                description: "Suchen Sie nach einem beliebigen Teil eines Songs",
                value: "time",
                type: 1,
                required: true,
                options: [],
                run: async (client, interaction, args, { GuildDB }) => {
                    const guild = client.guilds.cache.get(interaction.guild_id);
                    const member = guild.members.cache.get(interaction.member.user.id);

                    if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Sie befinden sich in keinen Sprachkanal!**");
                    if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | **Du musst drin sein ${guild.me.voice.channel} um diesen Befehl zu verwenden.**`);

                    let player = await client.Manager.get(interaction.guild_id);
                    if (!player) return interaction.send("❌ | **Momentan spielt der Musik Bot keine Musik!**");
                    if (!player.queue.current.isSeekable) return interaction.send("Dieses Lied kann nicht suchen.");
                    let SeekTo = client.ParseHumanTime(interaction.data.options[0].value);
                    if (!SeekTo) return interaction.send("**💠 **| Bitte geben Sie eine Zeit ein, um zu suchen!");
                    player.seek(SeekTo * 1000);
                    interaction.send("**💠 **| Das Lied wurde erfolgreich nach verschoben ", Seekto);
                },
            },
        ],
    },
};
