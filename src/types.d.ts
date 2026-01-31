import type { colors } from "./colors";

export interface LoggerOptions {
    /**
     * Path of directory to write log files to
     * @default null
     */
    logsPath?: string;

    /**
     * Whether to log to stdout
     * @default true
     */
    logToStdout?: boolean;

    /**
     * Timezone in UTC offsets
     * @example UTC
     * @example UTC+2
     * @example UTC-5
     * @default UTC
     */
    timezone?: Timezone;
}

export type Timezone = "UTC" | `UTC${"" | "+" | "-"}${number}`;

export interface WriteOptions {
    level: string;
    message: string;
    color?: keyof typeof colors;
    hex?: string;
}
