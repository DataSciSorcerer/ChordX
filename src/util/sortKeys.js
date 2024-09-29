// MIDI排序
function sortKeys(keyArray) {
    var noteOrder = {
        'C': 1, 'C#': 2, 'D': 3, 'D#': 4, 'E': 5, 'F': 6, 'F#': 7, 'G': 8, 'G#': 9, 'A': 10, 'A#': 11, 'B': 12
    };

    keyArray.sort(function (a, b) {
        var numA = parseInt(a.slice(-1));
        var numB = parseInt(b.slice(-1));

        if (numA !== numB) {
            return numA - numB;
        } else {
            var noteA = a.slice(0, -1);
            var noteB = b.slice(0, -1);

            if (noteOrder[noteA] < noteOrder[noteB]) {
                return -1;
            } else if (noteOrder[noteA] > noteOrder[noteB]) {
                return 1;
            } else {
                return 0;
            }
        }
    });

    return keyArray;
}

export { sortKeys };