const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "volume",
    description: "Ändert die Lautstärke",
    usage: "<volume>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["vol", "v"],
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
        if (!parseInt(args[0])) return message.channel.send("Bitte wählen Sie zwischen 1 - 100");
        let vol = parseInt(args[0]);
        player.setVolume(vol);
        message.channel.send(`🔉 | Lautstärke eingestellt auf \`${player.volume}\``);
    },
    SlashCommand: {
        options: [
            {
                name: "nummer",
                value: "Bitte wählen Sie zwischen 1 - 100",
                type: 4,
                required: true,
                description: "Auf was möchten Sie die Lautstärke ändern??",
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
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | Sie müssen sich in einem Sprachkanal befinden, um diesen Befehl Benutzen zu können!");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | Du musst dran sein ${guild.me.voice.channel} um diesen Befehl zu verwenden.`);
            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Momentan spielt der Musik Bot keine Musik!**");
            if (!args.length) return client.sendTime(interaction, `🔉 | Aktuelle Lautstärke \`${player.volume}\`.`);
            let vol = parseInt(args[0].value);
            if (!vol || vol < 1 || vol > 100) return client.sendTime(interaction, `Bitte wählen Sie zwischen \`1 - 100\``);
            player.setVolume(vol);
            client.sendTime(interaction, `🔉 | Lautstärke eingestellt auf \`${player.volume}\``);
        },
    },
};
