const { exec } = require('child_process');
const Discord = require('discord.js');

module.exports.run = async (client, message, args, config) => {
    if (message.author.id == config.discord.ownerId) {
        if (client.user.id == "537308565505966081") {
            const embed = new Discord.RichEmbed()
            embed.setTitle('Output');
            embed.setColor('#BA55D3');
            exec('sudo git pull origin master', (error, stdout, stderr) => {
                if (error) {embed.setDescription('```' + error + '```'); console.log(error);}
                else if (stdout.includes('Already up-to-date')) {embed.setDescription('Bot already up to date!');}
                else embed.setDescription('```Stdout: ' + stdout + ' stderr: ' + stderr + '```'); console.log('Stdout: ' + stdout + ' stderr: ' + stderr);
                message.channel.send(embed);
            });
        } else {
            message.channel.send('The update command can only be run on the actual bot');
        }
    }
}

module.exports.about = {
    name: "update"
}