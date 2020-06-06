"use strict";

import {
    isAllowed,
    getCard,
    checkCard
} from '../utils.js';

const STATUS_NOT_CHECKED = 0;  // job is not executed
const STATUS_NOT_ALLOWED = -1; // url is not allowed
const STATUS_IS_VALID    = 1;  // url can be marbled
const STATUS_IS_MARBLED  = 2;  // url is already marbled

/**
 * Marble Job
 * - Checking an url
 */
class Job {

    constructor(data) {
        this.data = [];

        this.status  = STATUS_NOT_CHECKED;
        this.done    = false;
        this.running = false;
        this.url     = '';

        if (typeof data === 'string') {
            this.url = data;
        } else {
            this.running = parseInt(data.running);
            this.done    = data.done;
            this.status  = data.status;
            this.data    = data.data;
            this.url     = data.url;
        }
    }

    /**
     * @return {boolean}
     */
    getStatus() {
        return this.status;
    }

    /**
     * @return {number}
     */
    isRunning() {
        return this.running;
    }

    /**
     * @return {boolean}
     */
    isDone() {
        return this.done;
    }

    /**
     * @return {[]}
     */
    getCardDetails() {
        return this.data;
    }

    /**
     * @return {String}
     */
    getUrl() {
        return this.url;
    }

    /**
     *
     * @return {{running: number, data: *[], done: boolean, url: *, status: boolean}}
     */
    toArray() {
        return {
            data   : this.getCardDetails(),
            status : this.getStatus(),
            running: this.isRunning(),
            done   : this.isDone(),
            url    : this.url
        }
    }

    /**
     * check marbling background status
     */
    check() {
        chrome.runtime.sendMessage({
            type: 'card-marbling-status',
            url : this.url
        }, (response) => {
            console.log('CHECK');
            console.log(response);
        });
    }

    /**
     * runs the job
     */
    run() {
        if (this.isRunning()) {
            return;
        }

        if (this.isDone()) {
            return;
        }

        this.running = true;

        chrome.runtime.sendMessage({
            type: 'card-details',
            url : this.url
        }, (response) => {
            console.log(response.data);

            this.status = response.status;
            this.data   = response.data;

            this.done    = true;
            this.running = false;

            // push a message

            if (Notification.permission === 'granted') {
                navigator.serviceWorker.getRegistration().then(function (reg) {
                    reg.showNotification('Hello world!');
                });
            }
        });
    }

    fetch() {

    }
}

export default Job;
