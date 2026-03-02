const { Client, ActivityType, GatewayIntentBits, Partials, Events } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;

// CONFIGURACIÓN
const VERIFICATION_CHANNEL = "1258102961079582826";
const VERIFICATION_ROLE = "1477994183448068126";
const MESSAGE_ID = "1478038133927972984"; // pon aquí el ID del mensaje si ya existe
const EMOJI = "🔑";
const VERIFICATION_TEXT = "Reacciona con 🔑 para verificarte.";

client.once(Events.ClientReady, async () => {
    console.log(`Bot listo como ${client.user.tag}`);
    
    client.user.setActivity("https://discord.gg/gWxJ36zc", {
        type: ActivityType.Watching
    })

    const channel = await client.channels.fetch(VERIFICATION_CHANNEL);

    try {
        // Intentar obtener el mensaje existente
        const message = await channel.messages.fetch(MESSAGE_ID);
        console.log("Mensaje de verificación encontrado");
    } catch {
        // Si no existe, crearlo
        const newMessage = await channel.send(VERIFICATION_TEXT);
        await newMessage.react(EMOJI);
        console.log("Nuevo mensaje creado con ID:", newMessage.id);
    }
});

// DAR ROL
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();

    if (reaction.message.id !== MESSAGE_ID) return;
    if (reaction.emoji.name !== EMOJI) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    await member.roles.add(VERIFICATION_ROLE);
});

// QUITAR ROL
client.on(Events.MessageReactionRemove, async (reaction, user) => {
    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();

    if (reaction.message.id !== MESSAGE_ID) return;
    if (reaction.emoji.name !== EMOJI) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    await member.roles.remove(VERIFICATION_ROLE);
});

client.login(TOKEN);