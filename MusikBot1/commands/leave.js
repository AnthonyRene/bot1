const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "leave",
    description: "Trennen des Bots vom Sprachkanal",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["stop", "exit", "quit", "dc", "disconnect"],
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
        await client.sendTime(message.channel, "💠 | ** Der Spieler hat angehalten und die Warteschlange wurde gelöscht.**");
        await message.react("✅");
        player.destroy();
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
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Sie müssen sich in einem Sprachkanal befinden, um diesen Befehl verwenden zu können.**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | **Du musst drin sein ${guild.me.voice.channel} um diesen Befehl zu verwenden.**`);

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Momentan spielt der Musik Bot keine Musik!**");
            player.destroy();
            client.sendTime(interaction, "💠 | ** Der MusikBot hat die Musik angehalten und die Warteschlange wurde gelöscht.**");
        },
    },
};
