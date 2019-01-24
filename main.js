const Discord = require('discord.js');
const client = new Discord.Client();
const commands = new Discord.Collection();
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

// Quick sqlite stuff
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('abibase');
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS `joinlog` (`guildid` char(18) NOT NULL, `channelid` char(18) NOT NULL)");
});

client.on('ready', () => {
    console.log(`Loaded and logged in as ${client.user.tag}`);
    client.user.setStatus('dnd');
    client.user.setActivity('with No Loli No Life#7222');
});

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
    fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

getDirectories('./commands').forEach(folder => {
    fs.readdir(folder, (err, files) => {
        if (err) console.log(err);

        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
            console.log(`Couldn't find commands in ${folder}`);
            return;
        }

        jsfile.forEach((f, i) => {
            let props = require(`./${folder}/${f}`);
            console.log(`Loaded ${f}`);
            commands.set(props.about.name, props);
        });
    });
});

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type == "dm") return;

    let prefix = config.Abi.prefix;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    var messageStr = message.toString();
    if (!(messageStr.startsWith(prefix))) return;
    let commandfile = commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(client, message, args, config, db);
});

client.on('guildMemberAdd', (user) => {
    db.all(`SELECT * FROM 'joinlog' WHERE guildid = ${user.guild.id}`, (err, rows) => {
        rows.forEach(function(row) {
            const embed = new Discord.RichEmbed()
                .setTitle(`${user.user.tag} (${user.id})`)
                .setDescription(`**Joined Discord:** ${user.user.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')}\n**Member Count:** ${user.guild.memberCount.toString()}`)
                .setColor("#3AC476")
                .setThumbnail(user.user.avatarURL)
                .setFooter(`Member Joined`)
            client.channels.get(row.channelid).send({embed});
        });
    });
});

client.on('guildMemberRemove', (user) => {
    db.all(`SELECT * FROM 'joinlog' WHERE guildid = ${user.guild.id}`, (err, rows) => {
        rows.forEach(function(row) {
            const embed = new Discord.RichEmbed()
                .setTitle(`${user.user.tag} (${user.id})`)
                .setDescription(`**Joined Discord:** ${user.user.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')}\n**Member Count:** ${user.guild.memberCount.toString()}`)
                .setColor("#DA5246")
                .setThumbnail(user.user.avatarURL)
                .setFooter(`Member Left`)
            client.channels.get(row.channelid).send({embed});
        });
    });
});

client.on('error', error => {
    console.error(error);
    process.exit(0);
});

client.login(config.discord.token);