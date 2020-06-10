import {
    checkCard,
    getCard,
    isAllowed
} from "./assets/javascript/utils.js";

import Queue from "./assets/javascript/classes/Queue.js";


const STATUS_NOT_CHECKED = 0;  // job is not executed
const STATUS_NOT_ALLOWED = -1; // url is not allowed
const STATUS_IS_VALID    = 1;  // url can be marbled
const STATUS_IS_MARBLED  = 2;  // url is already marbled

let marbleRequests = [];
let CardQueue      = new Queue();

function cardDetails(url) {
    return isAllowed(url).then((result) => {
        if (result.allowed_for_marbling === false) {
            return {
                url   : url,
                status: STATUS_NOT_ALLOWED,
                data  : false
            };
        }

        return checkCard(url).then((details) => {
            if (details.result.is_valid) {
                return {
                    url   : url,
                    status: STATUS_IS_VALID,
                    data  : false
                };
            }

            return getCard(details.result.additional_data.nft_id).then((card) => {
                return {
                    url   : url,
                    status: STATUS_IS_MARBLED,
                    data  : card
                };
            });
        });
    });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled....');

});

chrome.runtime.onStartup.addListener(() => {
    console.log('onStartup....');

});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('onMessage....');
    console.log(request);

    // get & check card availability
    if (request.type === "card-details") {
        let Prom = cardDetails(request.url);

        marbleRequests.push({
            url    : request.url,
            Request: Prom
        });

        Prom.then(function (result) {
            sendResponse(result);
        });

        return;
    }

    // get the current checking status
    if (request.type === 'card-marbling-status') {
        // check current running request
        for (let i = 0, len = marbleRequests.length; i < len; i++) {
            if (marbleRequests[i].url === request.url) {
                let Job = CardQueue.getJobByUrl(request.url);

                sendResponse(Job.toArray());
                return;
            }
        }

        // not found, then start new
        let Prom = cardDetails(request.url);

        marbleRequests.push({
            url    : request.url,
            Request: Prom
        });

        Prom.then(function (result) {
            sendResponse(result);
        });

        return;
    }

    sendResponse(404);
});
