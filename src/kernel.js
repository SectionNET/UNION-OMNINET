// Global scope variables
const defaultServerAddress = "fortudo";
let serverDatabase = {};
let userDatabase = {};
let userList = [];
let mailList = [];
let cmdLine_;
let output_;
let serverDate = { day: "", month: "", year: "", reference: "" };

function initDateObject() {
    const date = new Date();
    const day = serverDatabase.day || date.getDate();
    const month = serverDatabase.month || date.getMonth() + 1;
    const year = serverDatabase.year || date.getFullYear();
    const reference = serverDatabase.reference || "()";
    serverDate = { day, month, year, reference };
}

function debugObject(obj) {
    for (const property in obj) {
        console.log(`${property}: ${JSON.stringify(obj[property])}`);
        output(`${property}: ${JSON.stringify(obj[property])}`);
    }
}

function setHeader(msg) {
    const promptText = `[${userDatabase.userName}@${serverDatabase.terminalID}] # `;
    initDateObject();
    const dateStr = `${serverDate.day}/${serverDate.month}/${serverDate.year}`;
    const imgUrl = `config/network/${serverDatabase.serverAddress}/${serverDatabase.iconName}`;
    const imgSize = serverDatabase.iconSize || 100;
    const header = `
    <img src="${imgUrl}" width="${imgSize}" height="${imgSize}"
         style="float: left; padding-right: 10px" class="${serverDatabase.iconClass || ""}">
    <h2 style="letter-spacing: 4px">${serverDatabase.serverName}</h2>
    <p>Logged in: ${serverDatabase.serverAddress} (&nbsp;${dateStr}&nbsp;)</p>
    ${serverDatabase.headerExtraHTML || ""}
    <p>Enter "help" for more information.</p>
    `;
    output_.innerHTML = "";
    cmdLine_.value = "";
    if (term) term.loadHistoryFromLocalStorage(serverDatabase.initialHistory);
    output([header, msg]).then(() => applySFX());
    $(".prompt").html(promptText);
}

function getDocHeight_() {
    const doc = document;
    return Math.max(
        Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
        Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
        Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
    );
}

function newLine() {
    window.scrollTo(0, getDocHeight_());
    cmdLine_.value = "";
}

function output(data) {
    return new Promise((resolve) => {
        let delayed = 0;
        if (data && data.constructor === Object) {
            delayed = data.delayed;
            data = data.text;
        }

        if (Array.isArray(data)) {
            if (delayed && data.length > 0) {
                outputLinesWithDelay(data, delayed, () => resolve(newLine()));
                return;
            }
            data.forEach(value => printLine(value));
        } else if (data) {
            printLine(data);
        }
        resolve(newLine());
    });
}

function outputLinesWithDelay(lines, delayed, resolve) {
    const line = lines.shift();
    printLine(line);
    if (lines.length > 0) {
        setTimeout(outputLinesWithDelay, delayed, lines, delayed, resolve);
    } else if (resolve) {
        resolve();
    }
}

function printLine(data) {
    data ||= "";
    if (!data.startsWith("<")) data = `<p>${data}</p>`;
    output_.insertAdjacentHTML("beforeEnd", data);
    applySFX();
}

function applySFX() {
    $(output_).find(".desync").each((_, elem) => {
        const text = elem.textContent.trim();
        if (text) elem.dataset.text = text;
    });
    $(output_).find("img.glitch").filter(once).each((_, img) => glitchImage(img));
    $(output_).find("img.particle").filter(once).each((_, img) => particleImage(img));
    $(output_).find(".hack-reveal").filter(once).each((_, elem) => hackRevealText(elem, elem.dataset));
}

function once(_, elem) {
    if (elem.dataset.marked) return false;
    elem.dataset.marked = true;
    return true;
}

system = {
    clear() {
        return new Promise((resolve) => {
            setHeader();
            resolve(false);
        });
    },

    date() {
        return new Promise((resolve) => {
            const date = new Date();
            const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            resolve(`${serverDate.month} ${serverDate.day} ${serverDate.year} ${time} ${serverDate.reference}`);
        });
    },

    exit() {
        return new Promise(() => location.reload());
    },

    help(args) {
        return new Promise((resolve) => {
            if (args.length === 0) {
                resolve([
                    "You can read the help of a specific command by entering as follows: 'help commandName'",
                    "List of useful commands:",
                    `<div class="ls-files">${["clear", "date", "exit", "help", "mail"].join("<br>")}</div>`,
                    "You can navigate in the commands usage history using the UP & DOWN arrow keys.",
                    "The TAB key will provide command auto-completion."
                ]);
            } else {
                const cmd = args[0];
                const helpTexts = {
                    clear: ["Usage:", "> clear", "Wipes the terminal screen."],
                    date: ["Usage:", "> date", "Displays the current server date and time."],
                    exit: ["Usage:", "> exit", "Logs out and reloads the page."],
                    help: ["Usage:", "> help", "Displays a list of available commands."],
                    mail: ["Usage:", "> mail", "Shows your inbox if you're logged in."]
                };
                resolve(helpTexts[cmd] || [`Unknown command ${cmd}`]);
            }
        });
    },

    mail() {
        return new Promise((resolve, reject) => {
            const messages = mailList.filter(m => m.to.includes(userDatabase.userId))
                                     .map((m, i) => `[${i}] ${m.title}`);
            if (messages.length === 0) {
                reject(new MailServerIsEmptyError());
            } else {
                resolve(messages);
            }
        });
    },

    read(args) {
        return new Promise((resolve, reject) => {
            const index = Number(args[0]);
            const mail = mailList[index];
            if (!mail || !mail.to.includes(userDatabase.userId)) {
                reject(new InvalidMessageKeyError());
            } else {
                let message = [
                    "---------------------------------------------",
                    `From: ${mail.from}`,
                    `To: ${userDatabase.userId}@${serverDatabase.terminalID}`,
                    "---------------------------------------------",
                    ...mail.body.split("  ")
                ];
                resolve(message);
            }
        });
    }
};

function userPasswordFrom(creds) {
    if (!creds.includes(":")) return [creds, ""];
    const parts = creds.split(":");
    if (parts.length !== 2) throw new InvalidCredsSyntaxError();
    return parts;
}

function kernel(appName, args) {
    const program = allowedSoftwares()[appName];
    if (program) return software(appName, program, args);
    const systemApp = system[appName] || system[appName.replace(".", "_")];
    if (!systemApp || program === null) return Promise.reject(new CommandNotFoundError(appName));
    return systemApp(args);
}

kernel.init = function(cmdLineContainer, outputContainer) {
    return new Promise((resolve, reject) => {
        cmdLine_ = document.querySelector(cmdLineContainer);
        output_ = document.querySelector(outputContainer);
        $.when(
            $.get("config/software.json", (softwareData) => {
                softwareInfo = softwareData;
                kernel.connectToServer(defaultServerAddress);
            })
        ).done(() => resolve(true)).fail((err, msg) => {
            console.error("[init] Failure:", err, msg);
            reject(new JsonFetchParseError(msg));
        });
    });
};

function allowedSoftwares() {
    const softwares = {};
    for (const app in softwareInfo) {
        const program = softwareInfo[app];
        if (program === null) {
            softwares[app] = null;
        } else if (
            (!program.location || program.location.includes(serverDatabase.serverAddress)) &&
            (!program.protection || program.protection.includes(userDatabase.userId))
        ) {
            softwares[app] = program;
        }
    }
    return softwares;
}
