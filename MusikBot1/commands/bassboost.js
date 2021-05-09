const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");
const levels = {
    none: 0.0,
    low: 0.2,
    medium: 0.3,
    high: 0.35,
};
module.exports = {
    name: "bassboost",
    description: "Aktiviert den Audioeffekt zur Bassverstärkung",
    usage: "<none|low|medium|high>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["bb", "bass"],
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
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Sie befinden sich in keinen Sprachkanal!**");
        else if(message.guild.me.voice && message.guild.me.voice.channel.id !== message.member.voice.channel.id)return client.sendTime(message.channel, `❌ | **You must be in ${guild.me.voice.channel} to use this command.**`);
        
        if (!args[0]) return client.sendTime(message.channel, "**Bitte geben Sie einen Bassboost-Level an. \nAvailable Levels:** `none`, `low`, `medium`, `high`");

        let level = "none";
        if (args.length && args[0].toLowerCase() in levels) level = args[0].toLowerCase();

        player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

        return client.sendTime(message.channel, `✅ | **Stellen Sie den Bassboost-Pegel auf ein** \`${level}\``);
    },
    SlashCommand: {
        options: [
                {
                  name: "level",
                  description: `Bitte geben Sie einen Bassboost-Pegel an. Verfügbare Stufen: low, medium, high oder none!`,
                  value: "[level]",
                  type: 3,
                  required: true,
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
          const levels = {
            none: 0.0,
            low: 0.2,
            medium: 0.3,
            high: 0.35,
        };

            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Momentan spielt der Musik Bot keine Musik!**");
            if (!args) return client.sendTime(interaction, "**Bitte geben Sie einen Bassboost-Pegel an. \nAvailable Levels:** `none`, `low`, `medium`, `high`");

            let level = "none";
            if (args.length && args[0].value in levels) level = args[0].value;

            player.setEQ(...new Array(3).fill(null).map((_, i) => ({ band: i, gain: levels[level] })));

            return client.sendTime(interaction, `💠 | **Stellen Sie den Bassboost-Pegel auf ein** \`${level}\``);
        },
    },
};