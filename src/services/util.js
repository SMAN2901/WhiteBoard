export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray(a) {
    for (var i = 0; i < a.length; i++) {
        var p = getRandomInt(0, a.length - 1);
        var q = getRandomInt(0, a.length - 1);

        var tmp = a[p];
        a[p] = a[q];
        a[q] = tmp;
    }
    return a;
}

export function formatDate(dateString) {
    if (!dateString || dateString === "") return "";
    var date = new Date(dateString);
    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = ("0" + date.getMinutes()).slice(-2);
    var ampm = "AM";

    if (hour >= 12) ampm = "PM";
    if (hour >= 13) hour -= 12;

    return `${day} ${monthNames[monthIndex]} ${year} at ${hour}.${minute} ${ampm}`;
}

export function getTimeDifference(a) {
    var diff = Math.abs(Date.now() - new Date(a)) / 1000;
    var year = 365 * 24 * 60 * 60;
    var month = 30 * 24 * 60 * 60;
    var week = 7 * 24 * 60 * 60;
    var day = 24 * 60 * 60;
    var hour = 60 * 60;
    var minute = 60;
    var second = 1;
    var t = [year, month, week, day, hour, minute, second];
    var s = ["year", "month", "week", "day", "hour", "minute", "second"];

    for (var i = 0; i < t.length; i++) {
        if (diff >= t[i]) {
            var d = Math.floor(diff / t[i]).toString();
            var e = s[i] + (d > 1 ? "s" : "");
            return d + " " + e;
        }
    }

    return "Few moments";
}
