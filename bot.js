import 'dotenv/config';
import {Telegraf, Markup} from 'telegraf';
import {questions} from "./public/questions.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);

let currentQuestionIndex = 0;

const sendQuestion = async (ctx) => {
    const currentQuestion = questions[currentQuestionIndex];

    const keyboard = Markup.inlineKeyboard(currentQuestion.answers.map(answer => [Markup.button.callback(answer, answer)]));

    await ctx.reply(`${currentQuestionIndex + 1}/${questions.length} ${currentQuestion.question}`, keyboard);
};

const handleOtherAnswer = async (ctx) => {
    await ctx.reply('Please write your own answer:');

    bot.on('text', async (ctx) => {
        const userAnswer = ctx.message.text;
        // text answer
        console.log(userAnswer)
        currentQuestionIndex += 1;
        if (currentQuestionIndex < questions.length) {
            bot.off('text');
            sendQuestion(ctx);
        } else {
            await ctx.reply('Survey completed. Thank you for your responses!');
            currentQuestionIndex = 0;
        }
    });
};

bot.start(async (ctx) => {
    const keyboard = Markup.inlineKeyboard([Markup.button.webApp('Open App 📱', process.env.WEB_APP_URL), Markup.button.callback('Small survey 🎁', 'start_survey'),]);

    const greetingText = `
🎉 *Welcome to Tontune!*

🚀 Hey there, music enthusiast! You've just tuned into something special. Tontune is currently hitting the high notes in its development stage, and we're excited to have you on board for this journey.
🛠️ While we fine-tune the ultimate decentralized music streaming experience, feel free to explore and let your musical curiosity lead the way. Just remember, some features might still be under construction, so watch out for a few _work in progress_ 🚧 signs along the way.
Stay tuned for more updates, and thanks for being part of our symphony in the making! 🌐🎤 \n
*By the way, can we ask you for two questions?*
`;

    await ctx.replyWithMarkdown(greetingText, keyboard);
});

bot.action('start_survey', async (ctx) => {
    await ctx.reply('Great! Let\'s start the survey.');
    sendQuestion(ctx);
});

questions.forEach(question => {
    question.answers.forEach(answer => {
        bot.action(answer, async (ctx) => {
            if (answer === 'Other (Write own answer)') {
                await handleOtherAnswer(ctx);
            } else {
                // 'answer' var with user's answer
                console.log(answer)
                currentQuestionIndex += 1;
                if (currentQuestionIndex < questions.length) {
                    sendQuestion(ctx);
                } else {
                    await ctx.reply('Survey completed. Thank you for your responses!');
                    currentQuestionIndex = 0;
                }
            }
        });
    });
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
