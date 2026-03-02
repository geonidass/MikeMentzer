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
const VERIFICATION_CHANNEL = "1258102961079582826"; // Reemplaza con el ID del canal de verificación
const VERIFICATION_ROLE = "1477994183448068126"; // reemplaza con tu rol
const MESSAGE_ID = "1478038133927972984"; // reemplaza con el ID del mensaje
const EMOJI = ":key: "; // emoji que dará el rol

client.once(Events.ClientReady, async () => {
    console.log(`Bot listo como ${client.user.tag}`);

    // Obtener canal
    const channel = await client.channels.fetch(VERIFICATION_CHANNEL);

    // Enviar mensaje y agregar emoji
    let messages = await channel.messages.fetch({ limit: 10 });
    let botMessage = messages.find(m => m.author.id === client.user.id && m.content.includes("Reacciona"));
    
    // Solo enviar si no existe ya
    if (!botMessage) {
        botMessage = await channel.send(VERIFICATION_TEXT);
        await botMessage.react(EMOJI);

        // Guardar el ID del mensaje automáticamente para usar en reacciones
        console.log("Mensaje de verificación enviado con ID:", botMessage.id);
    }
});

// DAR ROL AL REACCIONAR
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.id !== botMessage.id) return;
    if (reaction.emoji.name !== EMOJI) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    member.roles.add(VERIFICATION_ROLE);
});

// QUITAR ROL AL QUITAR REACCIÓN
client.on(Events.MessageReactionRemove, async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.id !== botMessage.id) return;
    if (reaction.emoji.name !== EMOJI) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    member.roles.remove(VERIFICATION_ROLE);
});

client.login(TOKEN);