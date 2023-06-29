import {Bot, InlineKeyboard, InputFile} from "grammy";
import {hydrateReply} from "@grammyjs/parse-mode";
import {url, l10n} from "./data.mjs";

export const {
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop()
} = process.env;

export const bot = new Bot(token);

bot.use(hydrateReply);
bot.use(l10n);

bot.callbackQuery("create", async ctx => {
    const {id} = ctx.msg.chat;
    const {username} = ctx.me;
    const bot = username.replace("@", "");
    const name = `hidden_${Date.now()}_${id}_by_${bot}`;
    const set = new URL(name, "https://t.me/addemoji/");
    const [{file_id: sticker}] = await Promise.all([
        ctx.api.uploadStickerFile(id, "animated", new InputFile(url)),
        ctx.answerCallbackQuery({text: ctx.l("answers").creating}),
        ctx.replyWithChatAction("choose_sticker"),
    ]);
    const stickers = [{sticker, emoji_list: ["✨"]}];
    const reply_markup = new InlineKeyboard().text(ctx.l("buttons").delete, "delete");
    return Promise.all([
        ctx.api.createNewStickerSet(id, name, ctx.l("title", bot), stickers, "animated", {sticker_type: "custom_emoji"}),
        ctx.replyFmt(ctx.l("ready", set), {reply_markup}),
        ctx.deleteMessage(),
    ]);
});

bot.callbackQuery("delete", async ctx => {
    const [{url} = {}] = ctx.entities("text_link");
    const name = new URL(url).pathname.replace("/addemoji/", "");
    return Promise.all([
        ctx.answerCallbackQuery({text: ctx.l("answers").deleted, show_alert: true}),
        ctx.api.deleteStickerSet(name),
        ctx.deleteMessage(),
    ]);
});

bot.on("message", async ctx => {
    const isPremium =
        ctx.from.is_premium &&
        ctx.from.id === ctx.chat.id;
    const reply_markup = new InlineKeyboard().text(ctx.l("buttons").create, "create");
    const reply = isPremium ?
        ctx.replyFmt(ctx.l("instruction"), {reply_markup}) :
        ctx.replyFmt(ctx.l("premium"));
    return Promise.all([
        ctx.deleteMessage(),
        reply,
    ]);
});
