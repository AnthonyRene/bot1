const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "pause",
    description: "Unterbricht die Musik",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
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
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Sie müssen sich in einem Sprachkanal befinden, um etwas abspielen zu können!**");
        //else if(message.guild.me.voice && message.guild.me.voice.channel.id !== message.member.voice.channel.id)return client.sendTime(message.channel, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);
        if (player.paused) return client.sendTime(message.channel, "❌ | **Musik ist schon angehalten!**");
        player.pause(true);
        let embed = new MessageEmbed().setAuthor(`Pausiert!`, client.config.IconURL).setColor("0x00AE86").setDescription(`Art \`${GuildDB.prefix}fortsetzen\` zu play!`);
        await message.channel.send(embed);
        await message.react("✅");
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

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Sie müssen sich in einem Sprachkanal befinden, um etwas abspielen zu können!**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Momentan spielt der Musik Bot keine Musik!**");
            if (player.paused) return client.sendTime(interaction, "Musik ist schon angehalten!");
            player.pause(true);
            client.sendTime(interaction, "**⏸ Pausiert!**");
        },
    },
};
