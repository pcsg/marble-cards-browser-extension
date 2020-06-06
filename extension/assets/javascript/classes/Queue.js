"use strict";

import Job from "./Job.js";

const STORAGE_QUEUE_KEY = 'mc-queue';

/**
 * Queue of Jobs
 */
class Queue {

    constructor() {
        this.queue = [];

        // fetch queue from local storage
        let queue = localStorage.getItem(STORAGE_QUEUE_KEY);
        queue     = JSON.parse(queue);

        if (queue && queue.length) {
            for (let i = 0, len = queue.length; i < len; i++) {
                this.queue.push(
                    new Job(queue[i])
                );
            }
        }
    }

    save() {
        let result = this.queue.map(function (Entry) {
            return Entry.toArray();
        });

        result = JSON.stringify(result);
        console.log('SAVE Queue', result);
        localStorage.setItem(STORAGE_QUEUE_KEY, result);
    }

    /**
     * Return all current jobs
     *
     * @return {[]}
     */
    getJobs() {
        return this.queue;
    }

    /**
     * Add a new marbling job to the queue
     *
     * @param {Job} NewJob
     */
    addJob(NewJob) {
        // check if job already exists
        for (let i = 0, len = this.queue.length; i < len; i++) {
            if (this.queue[i].getUrl() === NewJob.getUrl()) {
                // @todo job is already running
                console.log('job is already running');
                this.queue[i].check();
                return;
            }
        }

        this.queue.push(NewJob);

        this.run();
        this.save();
    }

    /**
     *
     * @param url
     * @return {boolean|*}
     */
    getJobByUrl(url) {
        for (let i = 0, len = this.queue.length; i < len; i++) {
            if (this.queue[i].getUrl() === url) {
                return this.queue[i];
            }
        }

        return false;
    }

    /**
     * run all jobs
     */
    run() {
        this.queue.forEach(function (Job) {
            Job.run();
        });
    }
}

export default Queue;
