/**
 * Execute a request to an url
 *
 * @param url
 * @param params
 * @return {Promise<string>}
 */
function request(url, params) {
    let query = Object.keys(params)
                      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                      .join('&');

    url = url + '/?' + query;
    console.log(url);
    return fetch(url).then(data => data.text());
}

/**
 * Return the card details
 *
 * @param url
 */
function getCardDetails(url) {

}

/**
 * checks, if the url is allowed for marbling
 *
 * @param url
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

// test active url
document.querySelector('button').addEventListener('click', () => {
    chrome.tabs.query({
        active           : true,
        lastFocusedWindow: true
    }, tabs => {
        let url = tabs[0].url;

        isAllowed(url).then(function (result) {
            if (result.allowed_for_marbling === false) {

                return;
            }

            // check availability
            console.log(result);
        });
    });
});

