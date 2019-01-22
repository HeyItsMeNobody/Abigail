const Discord = require('discord.js');
const client = new Discord.Client();
const commands = new Discord.Collection();
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

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
    if (commandfile) commandfile.run(client, message, args, config);
});

client.on('error', error => {
    console.error(error);
    process.exit(0);
});

client.login(config.discord.token);