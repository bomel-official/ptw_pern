function sorted(arr, comparator = (a, b) => (a - b)) {
    return arr.concat().sort(comparator);
}

module.exports = sorted