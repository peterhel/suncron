module.exports = async function (command) {
    const https = require('https');
    const cronify = require('./cronify.js');
    const parseTime = (function () {
        const regexp = new RegExp(/^(\d+):(\d+):(\d+)\s(AM|PM)$/);

        return time => {
            let [, hours, minutes, seconds, apm] = regexp.exec(time);
            if (apm === 'PM') {
                hours = (hours | 0) + 12;
            }

            minutes = minutes | 0;
            seconds = (seconds | 0);
            seconds = seconds && seconds + (60 - seconds);

            const now = new Date();

            now.setUTCHours(hours);
            now.setUTCMinutes(minutes);
            now.setUTCSeconds(seconds);
            now.setUTCMilliseconds(0);

            return now;
        };
    })();

    async function getSun() {
        return await new Promise((resolve, reject) => {
            const request = https.get('https://api.sunrise-sunset.org/json?lat=59.8534028&lng=17.3536985&date=today', response => {
                let data = '';

                response.on('data', chunk => {
                    data += chunk;
                });

                response.on('end', () => resolve(JSON.parse(data).results));
            })
        });
    }

    const sunData = await getSun();
    const sunrise = parseTime(sunData.sunrise);
    const sunset = parseTime(sunData.sunset);
    const cronData = cronify.eachMinute(sunrise, sunset, command);

    return cronData;
}