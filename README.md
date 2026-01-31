<h1 align="center">@wlix/logger</h1>

> Tiny file-based logger for Node.js projects

## Installation

```bash
npm install @wlix/logger
# or
yarn add @wlix/logger
# or
pnpm add @wlix/logger
# or
bun add @wlix/logger
```

## Example

```js
import { Logger } from "@wlix/logger";

// all options are optional
const logger = new Logger({
    logsPath: "./logs", // where log files will go
    logToStdout: true, // log to console (default: true)
    timezone: "UTC", // timezone (UTC offsets, e.g., UTC+3 or UTC-7)
});

logger.info("This is information"); // green [INFO] log
logger.warn("This is a warning"); // orange [WARN] log
logger.error("This is an error"); // red [ERROR] log

// custom logs
logger.log("This is a custom log", {
    level: "example", // appears as [EXAMPLE] This is a custom log
    color: "blue", // suppots multiple color presets, ...or:
    hex: "#0000FF", // supports hex colors
});

logger.set({
    // ...change logger config
    // same options when initialising
    timezone: "UTC+2",
});
```

## Contributing

Pull requests are always welcomed. For more major changes, please open an issue to discuss what you wish to change.

## License

[MIT](LICENSE)
