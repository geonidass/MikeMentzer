// index.js
const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// ⚠️ Importante: TOKEN nunca en el código
const TOKEN = process.env.TOKEN;

// CONFIGURACIÓN DE VERIFICACIÓN
const VERIFICATION_ROLE = "1477994183448068126"; // reemplaza con tu rol
const MESSAGE_ID = "1478038133927972984"; // reemplaza con el ID del mensaje
const EMOJI = ":key: "; // emoji que dará el rol

client.once(Events.ClientReady, () => {
    console.log(`Bot listo como ${client.user.tag}`);
});

// DAR ROL AL REACCIONAR
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.id !== MESSAGE_ID) return;
    if (reaction.emoji.name !== EMOJI) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    member.roles.add(VERIFICATION_ROLE);
});

// QUITAR ROL AL QUITAR REACCIÓN
client.on(Events.MessageReactionRemove, async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.id !== MESSAGE_ID) return;
    if (reaction.emoji.name !== EMOJI) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    member.roles.remove(VERIFICATION_ROLE);
});

client.login(TOKEN);