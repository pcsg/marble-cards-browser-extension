/**
 * Check card availability
 *
 * @param {String} url
 */
function checkCard(url) {
    return fetch('https://ws.marble.cards/task/page/check_page_task', {
        method : 'post',
        body   : JSON.stringify({url: url}),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(data => data.text()).then((text) => {
        return JSON.parse(text);
    });
}

/**
 * Return the card details of a marbled card
 *
 * @param {String} nftId
 * @return {Promise}
 */
function getCard(nftId) {
    return fetch('https://ws.marble.cards/task/card_index/get_card_detail_task', {
        method : 'post',
        body   : JSON.stringify({nft_id: nftId}),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(data => data.text()).then((text) => {
        return JSON.parse(text);
    });
}

/**
 * checks, if the url is allowed for marbling
 *
 * @param {String} url
 * @return {Promise}
 */
function isAllowed(url) {
    return fetch('https://ws.marble.cards/task/app_config/is_domain_allowed_for_marbling_task', {
        method : 'post',
        body   : JSON.stringify({url: url}),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(data => data.text()).then((text) => {
        return JSON.parse(text);
    });
}

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
        let url = tabs[0].url;

        isAllowed(url).then(function (result) {
            if (result.allowed_for_marbling === false) {
                Loader.hide();
                Sheets.show('.app-status--cant-be-marbled')
                return;
            }

            // check availability
            Sheets.hideAllSheets().then(function () {
                return checkCard(url);
            }).then(function (details) {

                if (details.result.is_valid) {
                    Sheets.show('.app-status--new-card').then(function () {
                        // is available
                        let Image = document.createElement('img');
                        Image.classList.add('marble-card')
                        Image.src = details.card_preview;

                        Image.innerHTML = '';
                        document.querySelector('.app-status--new-card-image').append(Image);

                        Loader.hide();
                    });

                    return;
                }

                getCard(details.result.additional_data.nft_id).then(function (card) {
                    Loader.hide();

                    Sheets.show('.app-status--taken-card').then(function () {
                        console.log(card);

                        // is available
                        let Image = document.createElement('img');
                        Image.classList.add('marble-card')
                        Image.src = card.image;

                        Image.innerHTML = '';

                        document.querySelector('.app-status--taken-card-image').append(Image);
                        document.querySelector('.app-status--taken-card-owner-value').innerHTML = card.owner_address;
                    });
                });
            });
        });
    });
});

// init
document.querySelector('.app-check').classList.add('app-sheet--show');
