const Discord = require('discord.js');
const config = require("./config.json");
const db = require("quick.db");
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	const bot = client.users.cache.get(config.botID)
	const user = client.users.cache.get(config.yourID)
	setInterval(
		async function () {
			const channelExist = await db.get('channel');
			const messageExist = await db.get('message');
			console.log(channelExist)
			console.log(messageExist)
			if (!channelExist) {
				const embed = new Discord.MessageEmbed()
					.setColor('#ff0000')
					.setDescription('Please setup the bot first using `!setup` command.')
				return user.send(embed)
			}
			if (!messageExist) {
				const embed = new Discord.MessageEmbed()
					.setColor('#ff0000')
					.setDescription('Please setup the bot again using `!setup` command.')
				return user.send(embed)
			}
			if (bot.presence.status === "offline") {
				const embed = new Discord.MessageEmbed()
					.setColor('#999999')
					.setTitle(`${bot.username} is offline`)
					.setAuthor(`${bot.username}`, `${bot.displayAvatarURL()}`)
					.setDescription(`Hey **${user.username}**, your [**${bot.username}**](https://discord.com/users/${bot.id}) is offline.`)
					.setTimestamp()
					.setThumbnail('https://cdn.discordapp.com/emojis/706739039310577674.png?v=1')
					.setFooter(`${bot.username}`, `${bot.displayAvatarURL()}`);
				user.send(embed)
			}
			const msg = await client.channels.cache.get(channelExist).messages.fetch(messageExist);
			const embed = new Discord.MessageEmbed()
				.setTitle(`${bot.username} Status`)
				.setAuthor(`${bot.username}`, `${bot.displayAvatarURL()}`)
				.setTimestamp()
				.setFooter(`${bot.username}`, `${bot.displayAvatarURL()}`);
			if (bot.presence.status === "offline") {
				embed.setColor('#999999')
				embed.setDescription(`${bot.username} is **offline**`)
				embed.setThumbnail('https://cdn.discordapp.com/emojis/706739039310577674.png?v=1')
			}
			if (bot.presence.status === 'online') {
				embed.setColor('#7bcba7')
				embed.setDescription(`${bot.username} is **online**`)
				embed.setThumbnail('https://cdn.discordapp.com/emojis/706739252037156884.png?v=1')
			}
			if (bot.presence.status === 'idle') {
				embed.setColor('#fcc061')
				embed.setDescription(`${bot.username} is **idle**`)
				embed.setThumbnail('https://cdn.discordapp.com/emojis/772318644737802301.png?v=1')
			}
			if (bot.presence.status === 'dnd') {
				embed.setColor('#f17f7e')
				embed.setDescription(`${bot.username} is **dnd**`)
				embed.setThumbnail('https://cdn.discordapp.com/emojis/706739698336268349.png?v=1')
			}
			msg.edit(embed)
		}, 120000);
});

client.on('message', async (message) => {
	const bot = client.users.cache.get(config.botID)
	if (message.content.startsWith("!setup")) {
		const channel = message.mentions.channels.first()
		if (!channel) {
			const embed = new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setDescription('Please mention a channel.')
			return message.channel.send(embed)
		} else {
			const embed = new Discord.MessageEmbed()
				.setTitle(`${bot.username} Status`)
				.setAuthor(`${bot.username}`, `${bot.displayAvatarURL()}`)
				.setTimestamp()
				.setFooter(`${bot.username}`, `${bot.displayAvatarURL()}`);
			if (bot.presence.status === "offline") {
				embed.setColor('#999999')
				embed.setDescription(`${bot.username} is **offline**`)
				embed.setThumbnail('https://cdn.discordapp.com/emojis/706739039310577674.png?v=1')
			}
			if (bot.presence.status === 'online') {
				embed.setColor('#7bcba7')
				embed.setDescription(`${bot.username} is **online**`)
				embed.setThumbnail('https://cdn.discordapp.com/emojis/706739252037156884.png?v=1')
			}
			if (bot.presence.status === 'idle') {
				embed.setColor('#fcc061')
				embed.setDescription(`${bot.username} is **idle**`)
				embed.setThumbnail('https://cdn.discordapp.com/emojis/772318644737802301.png?v=1')
			}
			if (bot.presence.status === 'dnd') {
				embed.setColor('#f17f7e')
				embed.setDescription(`${bot.username} is **dnd**`)
				embed.setThumbnail('https://cdn.discordapp.com/emojis/706739698336268349.png?v=1')
			}
			db.set(`channel`, `${channel.id}`)
			channel.send(embed).then(message => {
				db.set(`message`, `${message.id}`)
			})
		}
	}
})

client.login(config.token);