const Discord = require("discord.js")
const client = new Discord.Client({
    intents: 131071, // Tutti gli intents
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
})

require("dotenv").config()

client.login(process.env.TOKEN);

// 3 == "3" -> true  3 === "3" -> false

client.on("ready", () => {
    console.log("BOT ON");
    client.user.setActivity("!help", { type: "COMPETING" })
})

client.on("messageCreate", async (message) => {

    const prefix = process.env.PREFIX

    console.log(message);

    const args = message.content.trim().split(/ +/g)  //!ping @rikvik2006 ciao -> ["!ping", "@rikvik2006", "ciao"] 
    const cmd = args[0].slice(prefix.length).toLowerCase()  //!ping @rikvik2006 ciao -> "ping"

    if (cmd === "echo") {
        if (message.author.bot) return
        message.channel.send(args.slice(1).join(" ")) //!ehco ciao sono un bot -> "ciao sono un bot" perché args.slice(1) -> ["ciao", "sono", "un", "bot"]
    }

    if (message.content === "!help") {
        message.channel.send("!ping -> pong")
        message.channel.send("!echo -> echo")
    }

    if (cmd === "ban") {
        if (message.author.bot) return
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.send("Non hai i permessi per eseguire questo comando")
            .then((msg) => msg.react("❌"))

        const user = message.mentions.users.first();

        if (!user) return message.reply("Questo utente non è un membero del server")
            .then((msg) => msg.react("❌"))

        const member = message.guild.members.cache.get(user.id);




        if (!member.bannable) return message.reply("Questo utente non può essere bannato")
            .then((msg) => msg.react("❌"))

        const reason = message.csubstring(2, message.length - 2)
        console.log(reason)

        let days = message.slice(-1)
        days = Math.floor(days)
        console.log(days)

        member.ban({ reason: reason, days: days })
            .then(() => {
                const banned_member = new Discord.MessageEmbed()
                    .setAuthor({ name: user.tag, avatar: user.displayAvatarURL() })
                    .setColor("RED")
                    .setDescription(`**Reason:** ${reason}\n**Moderator:** <@${message.author.id}>`)

                message.reply({ embeds: [banned_member] })
            }
            )
    } else if (cmd === "kick") {
        if (message.author.bot) return
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.send("Non hai i permessi per eseguire questo comando")
            .then((msg) => msg.react("❌"))

        const user = message.mentions.users.first();

        if (!user) return message.reply("Questo utente non è un membero del server")
            .then((msg) => msg.react("❌"))

        const member = message.guild.members.cache.get(user.id);




        if (!member.kickable) return message.reply("Questo utente non può essere bannato")
            .then((msg) => msg.react("❌"))

        const reason = message.csubstring(2, message.length - 2)
        console.log(reason)

        member.kick(reason)
            .then(() => {
                const banned_member = new Discord.MessageEmbed()
                    .setAuthor({ name: user.tag, avatar: user.displayAvatarURL() })
                    .setColor("RED")
                    .setDescription(`**Reason:** ${reason}\n**Moderator:** <@${message.author.id}>`)

                message.reply({ embeds: [banned_member] })
            }
            )
    }
})
