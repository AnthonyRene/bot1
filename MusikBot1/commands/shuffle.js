const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "shuffle",
    description: "Mischt die Warteschlange",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["shuff"],
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

        if (!player.queue || !player.queue.length || player.queue.length === 0) return message.channel.send("Nicht genug Songs in der Warteschlange, um zu mischen!");
        player.queue.shuffle();
        let embed = new MessageEmbed().setColor("0x00AE86").setDescription(`Mischte die Warteschlange!`);
        await message.channel.send(embed);
        await message.react("✅");
    },
    SlashCommand: {
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Sie müssen sich in einem Sprachkanal befinden, um etwas abspielen zu können!**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | **Du musst drin sein ${guild.me.voice.channel} um diesen Befehl zu verwenden.**`);

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction.channel, "❌ | **Momentan spielt der Musik Bot keine Musik!**");
            if (!player.queue || !player.queue.length || player.queue.length === 0) return interaction.send("**❌ **| Nicht genug Songs in der Warteschlange, um zu mischen!");
            player.queue.shuffle();
            interaction.send("**💠 **| Mischte die Warteschlange!");
        },
    },
};
