module.exports.eachMinute = function (begin, end, command) {
    const rows = [];
    if (begin.getUTCMinutes() != 0) {
        const minutes = [];
        let earlyHour = begin.getUTCHours();
        for (let m = begin.getUTCMinutes(); m < 60; m++) {
            minutes.push(m);
        }
        rows.push(`${minutes.join(',')} ${earlyHour} * * * ${command}`);

        begin.setUTCMinutes(begin.getUTCMinutes() + (60 - begin.getUTCMinutes()));
    }

    if (end.getUTCMinutes != 0) {
        const minutes = [];
        let lateHour = end.getUTCHours();
        for (let m = 0; m <= end.getUTCMinutes(); m++) {
            minutes.push(m);
        }
        rows.push(`${minutes.join(',')} ${lateHour} * * * ${command}`);

        end.setUTCMinutes(-1);
    }

    rows.push(`* ${begin.getUTCHours()}-${end.getUTCHours()} * * * ${command}`);

    return rows;
}
