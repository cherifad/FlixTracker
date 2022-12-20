"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobQueue = void 0;
class JobQueue {
    constructor() {
        this.running = false;
        this.jobs = [];
    }
    enqueue(job) {
        this.jobs.push(job);
        if (!this.running) {
            this.run();
        }
    }
    async run() {
        this.running = true;
        while (this.jobs.length > 0) {
            const job = this.jobs.shift();
            await job();
        }
        this.running = false;
    }
}
exports.JobQueue = JobQueue;
