const Discord = require('discord.js');

module.exports.run = async (client, message, args, config, db) => {
    db.serialize(function() {
        db.get(`SELECT guildid, channelid FROM 'joinlog' WHERE guildid = '${message.guild.id}' AND channelid = '${message.channel.id}'`, (err, rows) => {
            if (rows == undefined) {
                const embed = new Discord.RichEmbed()
                    .setTitle(`Do you want to turn on join and leave logs?`)
                    .setColor("#7C44BF")
                message.channel.send({embed})
                .then(async function (msg) {
                    await msg.react('✅').then(() => msg.react('❌'))
                    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    const collector = msg.createReactionCollector(filter, { time: 60000 });
                    collector.on('collect', r => {
                        msg.delete();
                        if (r.emoji.name == '✅') {
                            db.run(`INSERT INTO 'joinlog' VALUES ('${message.guild.id}', '${message.channel.id}')`);
                            const embed = new Discord.RichEmbed()
                                .setTitle(`Okay! You will now receive join and leave messages here!`)
                                .setColor("#7C44BF")
                            message.channel.send({embed});
                        } else {
                            const embed = new Discord.RichEmbed()
                                .setTitle(`Okay.. You won't receive join and leave logs here..`)
                                .setColor("#7C44BF")
                            message.channel.send({embed});
                        }
                    });
                });
            } else {
                const embed = new Discord.RichEmbed()
                    .setTitle(`Join logs are already enabled here.. Do you want to turn that off?`)
                    .setColor("#7C44BF")
                message.channel.send({embed})
                .then(async function (msg) {
                    await msg.react('✅').then(() => msg.react('❌'))
                    const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    const collector = msg.createReactionCollector(filter, { time: 60000 });
                    collector.on('collect', r => {
                        msg.delete();
                        if (r.emoji.name == '✅') {
                            db.run(`DELETE FROM 'joinlog' WHERE guildid = ${message.guild.id} AND channelid = ${message.channel.id}`);
                            const embed = new Discord.RichEmbed()
                                .setTitle(`Okay! I turned joinlogs off in this channel..`)
                                .setColor("#7C44BF")
                            message.channel.send({embed})
                        } else {
                            const embed = new Discord.RichEmbed()
                                .setTitle(`Okay.. I didn't turn joinlogs off!`)
                                .setColor("#7C44BF")
                            message.channel.send({embed})
                        }
                    });
                });
            }
        })
    });
}

module.exports.about = {
    name: "joinlog"
}