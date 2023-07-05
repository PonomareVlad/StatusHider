import {bold, fmt, link} from "@grammyjs/parse-mode";
import Locale from "./empty.mjs";

export default class En extends Locale {

    buttons = {
        create: "Create set",
        delete: "Delete set",
    }

    answers = {
        creating: "Creating a set...",
        deleting: "Deleting a set...",
        deleted: "Set deleted successfully!",
    }

    bot = {
        name: "Status Hider",
        short: "This bot will help hide your premium status. \r\n\r\nDeveloped by @Ponomarev_Studio",
        description: "This bot will help hide your premium status. \r\n\r\nDeveloped by @Ponomarev_Studio",
    }

    instruction = () => fmt`
${bold("To hide the status, you need to follow these steps:")}

1. Click button to create a set with invisible emoji
2. Set invisible emoji from this set to your status
3. Return to this bot and click button to delete set

As a result, your status will be completely hidden and will not be shown on clicks
`

    premium = () => fmt`
${bold("This bot is only available to users with a premium subscription")}

Send /start command if you have activated premium subscription
`

    success = () => fmt`
Set deleted successfully!

If you want to restart the process send /start command
`

    ready = set => fmt`
Set invisible emoji from ${link("this", set)} set to your status

After that, return to this message and click button to delete set
`

    title = bot => `Delete this set using @${bot}`

}
