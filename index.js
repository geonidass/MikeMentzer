const { Client, ActivityType, GatewayIntentBits, Partials, Events } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;

// CONFIGURACIÓN
const VERIFICATION_CHANNEL = "1258102961079582826";
const VERIFICATION_ROLE = "1477994183448068126";
const MESSAGE_ID = ""; // pon aquí el ID del mensaje si ya existe
const EMOJI = "🔑";
const VERIFICATION_TEXT = "Reacciona con 🔑 para verificarte.";
// ===== ANTILINK =====
const GENERAL_CHANNEL = "1258102959506718732";

// ===== AUTOMODERACIÓN =====
const BAD_WORDS = [
    "verga",
    "mierda",
    "puta",
    "puto",
    "hijo de puta",
    "hijodeputa",
    "maricon",
    "maricón",
    "pendejo",
    "pendeja",
    "cabron",
    "cabrón",
    "culero",
    "culera",
    "coño",
    "chingar",
    "chingada",
    "chingado",
    "pinche",
    "perra",
    "perro",
    "malparido",
    "gonorrea",
    "careverga",
    "carepinga",
    "mamaguevo",
    "mamagueba"
];

client.once(Events.ClientReady, async () => {
    console.log(`Bot listo como ${client.user.tag}`);
    
    client.user.setActivity("https://discord.gg/gWxJ36zc", {
        type: ActivityType.Watching
    })

    const channel = await client.channels.fetch(VERIFICATION_CHANNEL);

    const newMessage = await channel.send(VERIFICATION_TEXT);
    await newMessage.react(EMOJI);

    console.log("Nuevo mensaje creado:", newMessage.id);
});

// DAR ROL
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return;

    try {
        if (reaction.partial) await reaction.fetch();

        console.log("Reacción detectada:", reaction.emoji.name, "de", user.tag);

        if (reaction.message.id !== MESSAGE_ID) {
            console.log("No es el mensaje de verificación");
            return;
        }

        if (reaction.emoji.name !== EMOJI) {
            console.log("Emoji incorrecto");
            return;
        }

        const member = await reaction.message.guild.members.fetch(user.id);

        if (member.roles.cache.has(VERIFICATION_ROLE)) {
            console.log("El usuario ya tiene el rol");
            return;
        }

        await member.roles.add(VERIFICATION_ROLE);
        console.log("Rol de verificación dado a", user.tag);

    } catch (error) {
        console.error("Error al dar el rol:", error);
    }
});

// ===== FILTRO DE MALAS PALABRAS =====
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    const containsBadWord = BAD_WORDS.some(word => content.includes(word));

    if (containsBadWord) {
        try {
            await message.delete();

            const warning = await message.channel.send(
                `${message.author}, No no no, malas palabras no`
            );

            // El mensaje del bot se borra después de 5 segundos
            setTimeout(() => {
                warning.delete().catch(() => {});
            }, 5000);

        } catch (error) {
            console.log("Error en automoderación:", error);
        }
    }
});

// ===== FILTRO DE LINKS SOLO EN GENERAL =====
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    // Solo actuar en el canal General
    if (message.channel.id !== GENERAL_CHANNEL) return;

    // Detectar links (http, https, discord.gg, www, etc.)
    const linkRegex = /(https?:\/\/|www\.|discord\.gg|discord\.com\/invite)/gi;

    if (linkRegex.test(message.content)) {
        try {
            await message.delete();

            const warning = await message.channel.send(
                `${message.author}, No se permiten links en este canal`
            );

            setTimeout(() => {
                warning.delete().catch(() => {});
            }, 5000);

        } catch (error) {
            console.log("Error en anti-link:", error);
        }
    }
});

client.login(TOKEN);