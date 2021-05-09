const { MessageEmbed, Message } = require("discord.js");
const { TrackUtils } = require("erela.js");
const _ = require("lodash");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "search",
    description: "Suchen Sie ein Lied / eine Wiedergabeliste",
    usage: "[Song Name|SongURL]",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["se"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **Sie müssen sich in einem Sprachkanal befinden, um etwas abspielen zu können!**");
        //else if(message.guild.me.voice && message.guild.me.voice.channel.id !== message.member.voice.channel.id)return client.sendTime(message.channel, "❌ | **Sie müssen sich im selben Sprachkanal befinden wie der Bot, um etwas zu spielen!**");
        let SearchString = args.join(" ");
        if (!SearchString) return client.sendTime(message.channel, `**Der Befehl ist => **\`${GuildDB.prefix}play [Song Name|Song URL]\``);
        let CheckNode = client.Manager.nodes.get(client.config.Lavalink.id);
        if (!CheckNode || !CheckNode.connected) {
       return client.sendTime(message.channel,"❌ | Lavalink nicht connected.");
        }
        const player = client.Manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: false,
        });

        if (player.state != "CONNECTED") await player.connect();

        let Searched = await player.search(SearchString, message.author);
        if (Searched.loadType == "NO_MATCHES") return client.sendTime(message.channel, "Keine Übereinstimmungen gefunden für " + SearchString);
        else {
            Searched.tracks = Searched.tracks.map((s, i) => {
                s.index = i;
                return s;
            });
            let songs = _.chunk(Searched.tracks, 10);
            let Pages = songs.map((songz) => {
                let MappedSongs = songz.map((s) => `\`${s.index + 1}.\` [${s.title}](${s.uri}) \nDauer: \`${prettyMilliseconds(s.duration, { colonNotation: true })}\``);

                let em = new MessageEmbed()
                    .setAuthor("Suchergebnisse von " + SearchString, client.config.IconURL)
                    .setColor("0x00AE86")
                    .setDescription(MappedSongs.join("\n\n"));
                return em;
            });

            if (!Pages.length || Pages.length === 1) return message.channel.send(Pages[0]);
            else client.Pagination(message, Pages);

            let w = (a) => new Promise((r) => setInterval(r, a));
            await w(500);
            let msg = await message.channel.send("**Geben Sie die Nummer des Songs ein, den Sie spielen möchten! Läuft in 30 Sekunden ab`.**");

            let er = false;
            let SongID = await message.channel
                .awaitMessages((msg) => message.author.id === msg.author.id, { max: 1, errors: ["time"], time: 30000 })
                .catch(() => {
                    er = true;
                    msg.edit("**Sie haben zu lange gebraucht, um zu antworten. Führen Sie den Befehl erneut aus, wenn Sie etwas spielen möchten**");
                });
            if (er) return;
            /**@type {Message} */
            let SongIDmsg = SongID.first();

            if (!parseInt(SongIDmsg.content)) return client.sendTime("Bitte senden Sie die richtige Song-ID");
            let Song = Searched.tracks[parseInt(SongIDmsg.content) - 1];
            if (!Song) return message.channel.send("Für die angegebene ID wurde kein Lied gefunden");
            player.queue.add(Song);
            if (!player.playing && !player.paused && !player.queue.size) player.play();
            let SongAddedEmbed = new MessageEmbed();
            SongAddedEmbed.setAuthor(`Zur Warteschlange hinzugefügt`, client.config.IconURL);
            SongAddedEmbed.setThumbnail(Song.displayThumbnail());
            SongAddedEmbed.setColor("0x00AE86");
            SongAddedEmbed.setDescription(`[${Song.title}](${Song.uri})`);
            SongAddedEmbed.addField("Author", `${Song.author}`, true);
            SongAddedEmbed.addField("Dauer", `\`${prettyMilliseconds(player.queue.current.duration, { colonNotation: true })}\``, true);
            if (player.queue.totalSize > 1) SongAddedEmbed.addField("Position in queue", `${player.queue.size - 0}`, true);
            message.channel.send(SongAddedEmbed);
        }
    },

    SlashCommand: {
        options: [
            {
                name: "song",
                value: "song",
                type: 3,
                required: true,
                description: "Suchen Sie ein Lied / eine Wiedergabeliste",
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
            const voiceChannel = member.voice.channel;
            let awaitchannel = client.channels.cache.get(interaction.channel_id);
            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Sie müssen sich in einem Sprachkanal befinden, um diesen Befehl verwenden zu können.**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, `❌ | **Sie müssen sich in einem Sprachkanal befinden, um diesen Befehl verwenden zu können.**`);
            let CheckNode = client.Manager.nodes.get(client.config.Lavalink.id);
            if (!CheckNode || !CheckNode.connected) {
              return client.sendTime(interaction,"❌ | Lavalink node not connected.");
            }
            let player = client.Manager.create({
                guild: interaction.guild_id,
                voiceChannel: voiceChannel.id,
                textChannel: interaction.channel_id,
                selfDeafen: false,
            });
            if (player.state != "CONNECTED") await player.connect();
            let search = interaction.data.options[0].value;
            let res;

            if (search.match(client.Lavasfy.spotifyPattern)) {
                await client.Lavasfy.requestToken();
                let node = client.Lavasfy.nodes.get(client.config.Lavalink.id);
                let Searched = await node.load(search);

                switch (Searched.loadType) {
                    case "LOAD_FAILED":
                        if (!player.queue.current) player.destroy();
                        return interaction.send(`Beim Suchen ist ein Fehler aufgetreten`);

                    case "NO_MATCHES":
                        if (!player.queue.current) player.destroy();
                        return interaction.send("Es wurden keine Ergebnisse gefunden.");
                    case "TRACK_LOADED":
                        player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        return interaction.send(`**Zur Warteschlange hinzugefügt:** \`[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri}}\`.`);

                    case "PLAYLIST_LOADED":
                        let songs = [];
                        for (let i = 0; i < Searched.tracks.length; i++) songs.push(TrackUtils.build(Searched.tracks[i], member.user));
                        player.queue.add(songs);

                        if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play();
                        return interaction.send(`**Wiedergabeliste zur Warteschlange hinzugefügt**: \n**${Searched.playlist.name}** \nEnqueued: **${Searched.playlistInfo.length} songs**`);
                }
            } else {
                try {
                    res = await player.search(search, member.user);
                    if (res.loadType === "LOAD_FAILED") {
                        if (!player.queue.current) player.destroy();
                        throw new Error(res.exception.message);
                    }
                } catch (err) {
                    return interaction.send(`Bei der Suche ist ein Fehler aufgetreten: ${err.message}`);
                }
                switch (res.loadType) {
                    case "NO_MATCHES":
                        if (!player.queue.current) player.destroy();
                        return interaction.send("Es wurden keine Ergebnisse gefunden.");
                    case "TRACK_LOADED":
                        player.queue.add(res.tracks[0]);
                        if (!player.playing && !player.paused && !player.queue.length) player.play();
                        return interaction.send(`**Zur Warteschlange hinzugefügt:** \`[${res.tracks[0].title}](${res.tracks[0].uri})\`.`);
                    case "PLAYLIST_LOADED":
                        player.queue.add(res.tracks);

                        if (!player.playing && !player.paused && player.queue.size === res.tracks.length) player.play();
                        return interaction.send(`**Wiedergabeliste zur Warteschlange hinzugefügt**: \n**${res.playlist.name}** \nEnqueued: **${res.playlistInfo.length} songs**`);
                    case "SEARCH_RESULT":
                        let max = 10,
                            collected,
                            filter = (m) => m.author.id === interaction.member.user.id && /^(\d+|end)$/i.test(m.content);
                        if (res.tracks.length < max) max = res.tracks.length;

                        const results = res.tracks
                            .slice(0, max)
                            .map((track, index) => `\`${++index}\` - [${track.title}](${track.uri}) \n\t\`${prettyMilliseconds(track.duration, { colonNotation: true })}\`\n`)
                            .join("\n");

                        const resultss = new MessageEmbed().setDescription(`${results}\n\n\t**Geben Sie die Nummer des Songs ein, den Sie spielen möchten!**\n`).setColor("0x00AE86").setAuthor(`Suchergebnisse für ${search}`, client.config.IconURL);
                        interaction.send(resultss);
                        try {
                            collected = await awaitchannel.awaitMessages(filter, { max: 1, time: 30e3, errors: ["time"] });
                        } catch (e) {
                            if (!player.queue.current) player.destroy();
                            return awaitchannel.send("❌ | **Sie haben keine Auswahl getroffen**");
                        }

                        const first = collected.first().content;

                        if (first.toLowerCase() === "cancel") {
                            if (!player.queue.current) player.destroy();
                            return awaitchannel.send("Suche abgebrochen.");
                        }

                        const index = Number(first) - 1;
                        if (index < 0 || index > max - 1) return awaitchannel.send(`Die von Ihnen angegebene Nummer war größer oder kleiner als die Suchsumme. Verwendung - \`(1-${max})\``);
                        const track = res.tracks[index];
                        player.queue.add(track);

                        if (!player.playing && !player.paused && !player.queue.length) {
                            player.play();
                        } else {
                            let SongAddedEmbed = new MessageEmbed();
                            SongAddedEmbed.setAuthor(`Zur Warteschlange hinzugefügt`, client.config.IconURL);
                            SongAddedEmbed.setThumbnail(track.displayThumbnail());
                            SongAddedEmbed.setColor("0x00AE86");
                            SongAddedEmbed.addField("Song", `[${track.title}](${track.uri})`, true);
                            SongAddedEmbed.addField("Author", track.author, true);
                            SongAddedEmbed.addField("Dauer", `\`${prettyMilliseconds(track.duration, { colonNotation: true })}\``, true);
                            awaitchannel.send(SongAddedEmbed);
                        }
                }
            }
        },
    },
};
