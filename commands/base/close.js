module.exports.run = async (client, message, args, config) => {
    if (message.author.id == config.discord.ownerId) {
        process.exit(0);
    }
}

module.exports.about = {
    name: "close"
}