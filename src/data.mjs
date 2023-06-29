import {bold, fmt, link} from "@grammyjs/parse-mode";
import {getURL} from "vercel-grammy";

export const url = new URL(getURL({path: "sticker.tgs"}));

export const buttons = {
    create: "Создать набор",
    delete: "Удалить набор"
}

export const premium = fmt`
Этот бот доступен только для пользователей с премиум подпиской
`;

export const instruction = fmt`
${bold("Для скрытия статуса вам нужно выполнить следующие шаги:")}

1. Нажмите кнопку для создания набора с невидимым emoji
2. Установите невидимый emoji из этого набора в свой статус
3. Вернитесь в этот бот и нажмите кнопку для удаления набора

В результате, ваш статус будет полностью скрыт и не будет отображаться при нажатиях
`;

export const success = fmt`
Набор успешно удален!

Если вы хотите повторить процесс, отправьте команду /start
`;

export const ready = set => fmt`
Установите невидимый emoji из ${link("этого", set)} набора в ваш статус

После этого, вернитесь к этому сообщению и нажмите кнопку для удаления набора
`;

export const title = bot => `Удалите этот набор с помощью @${bot}`;
