"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
const colors = {
    critical: '\x1b[31m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[32m',
    debug: '\x1b[34m',
    trace: '\x1b[35m'
};
log4js_1.default.addLayout('colored-level', config => function (logEvent) {
    const level = logEvent.level.levelStr.toUpperCase();
    const color = colors[level.toLowerCase()] || '';
    const gray = '\x1b[90m';
    const reset = '\x1b[0m';
    const time = logEvent.startTime.getDate() + "-" + (logEvent.startTime.getMonth() + 1) + "-" + logEvent.startTime.getFullYear() + " " + logEvent.startTime.getHours() + ":" + logEvent.startTime.getMinutes() + ":" + logEvent.startTime.getSeconds();
    const consoleMessage = `[${color}${level}${reset}]\t${gray}(${time})${reset} ${logEvent.data}`;
    const message = `[${level}]\t(${time}) ${logEvent.data}`;
    return consoleMessage;
});
log4js_1.default.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: { type: 'colored-level' }
        }
    },
    categories: {
        default: { appenders: ['out'], level: 'trace' }
    }
});
const logger = log4js_1.default.getLogger();
exports.default = logger;
