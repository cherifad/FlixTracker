"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
(0, index_1.createCli)()
    .then((program) => program.parseAsync(process.argv))
    .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
