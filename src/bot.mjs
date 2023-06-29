import {url, buttons, instruction, premium, success, title, ready} from "./data.mjs";
import {Bot, InlineKeyboard, InputFile} from "grammy";
import {hydrateReply} from "@grammyjs/parse-mode";

export const {
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop()
} = process.env;

export const bot = new Bot(token);

bot.use(hydrateReply);

bot.callbackQuery("create", async ctx => {
    const {id} = ctx.msg.chat;
    const {username} = ctx.me;
    const bot = username.replace("@", "");
    const name = `hidden_${Date.now()}_${id}_by_${bot}`;
    const set = new URL(name, "https://t.me/addemoji/");
    const [{file_id: sticker}] = await Promise.all([
        ctx.replyWithChatAction("choose_sticker"),
        ctx.api.uploadStickerFile(id, "animated", new InputFile(url)),
    ]);
    const stickers = [{sticker, emoji_list: ["✨"]}];
    const reply_markup = new InlineKeyboard().text(buttons.delete, "delete");
    return Promise.all([
        ctx.api.createNewStickerSet(id, name, title(bot), stickers, "animated", {sticker_type: "custom_emoji"}),
        ctx.replyFmt(ready(set), {reply_markup}),
        ctx.deleteMessage(),
    ]);
});

bot.callbackQuery("delete", async ctx => {
    const [{url} = {}] = ctx.entities("text_link");
    const name = new URL(url).pathname.replace("/addemoji/", "");
    return Promise.all([
        ctx.api.deleteStickerSet(name),
        ctx.replyFmt(success),
        ctx.deleteMessage(),
    ]);
});

bot.on("message", async ctx => {
    const isPremium =
        ctx.from.is_premium &&
        ctx.from.id === ctx.chat.id;
    const reply_markup = new InlineKeyboard().text(buttons.create, "create");
    const reply = isPremium ?
        ctx.replyFmt(instruction, {reply_markup}) :
        ctx.replyFmt(premium);
    return Promise.all([
        ctx.deleteMessage(),
        reply,
    ]);
});
