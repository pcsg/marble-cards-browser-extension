"use strict";

import Queue from './assets/javascript/classes/Queue.js';
import Job from './assets/javascript/classes/Job.js';

import {
    isAllowed,
    getCard,
    checkCard
} from './assets/javascript/utils.js';

let CardQueue = new Queue();

/**
 * global sheet handling
 *
 * @type {{hideAllSheets: (function(): Promise), show: (function(*=): Promise)}}
 */
let Sheets = {

    hideAllSheets: function () {
        let sheets = document.querySelectorAll('.app-sheet');

        return new Promise(function (resolve) {
            sheets.forEach(function (sheet) {
                sheet.classList.remove('app-sheet--show');
            });

            resolve();
        });
    },

    show: function (sheetName) {
        return this.hideAllSheets().then(function () {
            document.querySelector(sheetName).classList.add('app-sheet--show');
        });
    }
};

/**
 * Global loader
 *
 * @type {{hide: Loader.hide, show: Loader.show}}
 */
let Loader = {
    show: function () {
        document.querySelector('.loader').classList.add('loader--show');
    },

    hide: function () {
        document.querySelector('.loader').classList.remove('loader--show');
    }
};

// test active url
document.querySelector('button').addEventListener('click', () => {
    Loader.show();

    chrome.tabs.query({
        active           : true,
        lastFocusedWindow: true
    }, tabs => {
        CardQueue.addJob(
            new Job(tabs[0].url)
        );

        //
        // isAllowed(url).then(function (result) {
        //     if (result.allowed_for_marbling === false) {
        //         Loader.hide();
        //         Sheets.show('.app-status--cant-be-marbled')
        //         return;
        //     }
        //
        //     // check availability
        //     Sheets.hideAllSheets().then(function () {
        //         return checkCard(url);
        //     }).then(function (details) {
        //
        //         if (details.result.is_valid) {
        //             Sheets.show('.app-status--new-card').then(function () {
        //                 // is available
        //                 let Image = document.createElement('img');
        //                 Image.classList.add('marble-card')
        //                 Image.src = details.card_preview;
        //
        //                 Image.innerHTML = '';
        //                 document.querySelector('.app-status--new-card-image').append(Image);
        //
        //                 Loader.hide();
        //             });
        //
        //             return;
        //         }
        //
        //         getCard(details.result.additional_data.nft_id).then(function (card) {
        //             Loader.hide();
        //
        //             Sheets.show('.app-status--taken-card').then(function () {
        //                 // is available
        //                 let Image = document.createElement('img');
        //                 Image.classList.add('marble-card')
        //                 Image.src = card.image;
        //
        //                 Image.innerHTML = '';
        //
        //                 document.querySelector('.app-status--taken-card-image').append(Image);
        //                 document.querySelector('.app-status--taken-card-owner-value').appendChild(
        //                     document.createTextNode(card.owner_address)
        //                 );
        //             });
        //         });
        //     });
        // });
    });
});

// init
document.querySelector('.app-check').classList.add('app-sheet--show');

let CardJobList = document.querySelector('.app-check-jobs table tbody');

CardQueue.getJobs().forEach(function (Job) {
    let Row        = document.createElement('tr');
    let UrlCell    = document.createElement('td');
    let StatusCell = document.createElement('td');

    let Url       = document.createElement('div');
    Url.innerText = Job.getUrl();
    Url.classList.add('app-check-jobs-url');
    UrlCell.appendChild(Url);

    // @todo status
    StatusCell.classList.add('app-check-jobs-status');

    Row.appendChild(UrlCell);
    Row.appendChild(StatusCell);
    CardJobList.appendChild(Row);

    Job.check();
});

// request permissions for push notifications
Notification.requestPermission(function (status) {
    console.log('Notification permission status:', status);
});
