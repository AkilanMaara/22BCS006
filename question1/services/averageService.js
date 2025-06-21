let window = [];
const WINDOW_SIZE = 10;

function updateWindowAndCalculateAverage(numbersFromAPI) {
    let previousWindow = [...window];

    for (let i = 0; i < numbersFromAPI.length; i++) {
        let num = numbersFromAPI[i];

        if (window.indexOf(num) === -1) {
            window.push(num);
        }

        if (window.length > WINDOW_SIZE) {
            window.shift();
        }
    }

    let total = 0;
    for (let i = 0; i < window.length; i++) {
        total += window[i];
    }

    let average = 0;
    if (window.length > 0) {
        average = total / window.length;
        average = Math.round(average * 100) / 100;
    }

    return {
        windowPrevState: previousWindow,
        windowCurrState: [...window],
        numbers: numbersFromAPI,
        avg: average
    };
}

module.exports = {
    updateWindowAndCalculateAverage
};
