import type { LoggerOptions, Timezone, WriteOptions } from "./types";
import fs from "node:fs";
import path from "node:path";
import { colors } from "./colors";

/**
 * Class representing a logger
 */
export class Logger {
    #options: LoggerOptions = {
        logToStdout: true,
        timezone: "UTC",
    };

    /**
     * Instantiate a new logger
     * @param options Logger config
     */
    public constructor(options: LoggerOptions) {
        this.#options = { ...this.#options, ...options };
    }

    #color(input: string, hex: string) {
        return `\x1b[38;2;${parseInt(hex.slice(1, 3), 16)};${parseInt(hex.slice(3, 5), 16)};${parseInt(hex.slice(5, 7), 16)}m${input}\x1b[0m`;
    }

    #getDate(date: Date, timezone: Timezone = "UTC"): Date {
        if (timezone === "UTC") {
            return date;
        }

        const match = timezone.match(/^UTC([+-]\d{1,2})$/);

        if (!match || !match[1]) {
            return date;
        }

        return new Date(
            date.getTime() +
                date.getTimezoneOffset() * 60_000 +
                parseInt(match[1], 10) * 3600000
        );
    }

    #write(options: WriteOptions) {
        const now = this.#getDate(new Date(), this.#options.timezone);
        const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        const line = `[${time} ${this.#options.timezone}] [${options.level.toUpperCase()}] ${options.message.trim()}`;

        if (this.#options.logsPath) {
            const fileName = `${now.getDate().toString().padStart(2, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getFullYear()}.log`;

            fs.mkdirSync(this.#options.logsPath, { recursive: true });
            fs.appendFileSync(
                path.join(this.#options.logsPath, fileName),
                line + "\n"
            );
        }

        if (this.#options.logToStdout) {
            if (options.hex || options.color) {
                const hex = options.hex
                    ? options.hex.startsWith("#")
                        ? options.hex
                        : `#${options.hex}`
                    : colors[options.color!];

                console.log(this.#color(line, hex));
            } else {
                console.log(line);
            }
        }
    }

    /**
     * Update the logger's options
     * @param options New config
     */
    public set(options: LoggerOptions = {}) {
        this.#options = { ...this.#options, ...options };
    }

    /**
     * Info log
     * Green text, INFO level
     * @param message Log message
     * @param options Optional log options
     * @returns
     */
    public info(message: string, options?: LoggerOptions): Logger {
        this.#write({
            level: "info",
            color: "green",
            message,
            ...options,
        });

        return this;
    }
    /**
     * Warning log
     * Orange text, WARN level
     * @param message Log message
     * @param options Optional log options
     * @returns
     */
    public warn(message: string, options?: LoggerOptions): Logger {
        this.#write({
            level: "warn",
            message,
            color: "orange",
            ...options,
        });

        return this;
    }

    /**
     * Error log
     * Red text, ERROR level
     * @param message Log message
     * @param options Optional log options
     * @returns
     */
    public error(message: string, options?: LoggerOptions): Logger {
        this.#write({
            level: "error",
            message,
            color: "red",
            ...options,
        });

        return this;
    }

    /**
     * Custom logs
     * @param message Log message
     * @param options Log options
     */
    public log(
        message: string,
        options?: WriteOptions & { level?: string }
    ): Logger {
        if (!message) {
            throw new Error("Logging requires a message");
        }

        this.#write({
            ...options,
            message,
            level: options?.level ?? "log",
        });

        return this;
    }
}
