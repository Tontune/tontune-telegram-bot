import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);

bot.on(message('text'), async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
        Markup.button.webApp('Open TWA', 'https://192.168.1.106:5173/tontune-telegram-web-app/'),
    ]);

    await ctx.reply('Click the button to open TWA:', keyboard);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
