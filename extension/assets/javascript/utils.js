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

export {
    checkCard,
    getCard,
    isAllowed
};
