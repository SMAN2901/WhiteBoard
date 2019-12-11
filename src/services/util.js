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
