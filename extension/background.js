import {
    checkCard,
    getCard,
    isAllowed
} from "./assets/javascript/utils.js";

const STATUS_NOT_CHECKED = 0;  // job is not executed
const STATUS_NOT_ALLOWED = -1; // url is not allowed
const STATUS_IS_VALID    = 1;  // url can be marbled
const STATUS_IS_MARBLED  = 2;  // url is already marbled

chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled....');

});

chrome.runtime.onStartup.addListener(() => {
    console.log('onStartup....');

});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('onMessage....');
    console.log(arguments);

    // get & check card availability
    if (request.type === "card-details") {
        isAllowed(request.url).then((result) => {
            if (result.allowed_for_marbling === false) {
                return {
                    status: STATUS_NOT_ALLOWED,
                    data  : false
                };
            }

            return checkCard(request.url).then((details) => {
                if (details.result.is_valid) {
                    return {
                        status: STATUS_IS_VALID,
                        data  : false
                    };
                }

                return getCard(details.result.additional_data.nft_id).then((card) => {
                    return {
                        status: STATUS_IS_MARBLED,
                        data  : card
                    };
                });
            });
        }).then(function (result) {
            sendResponse(result);
        });
    }
});
