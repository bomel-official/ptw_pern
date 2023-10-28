module.exports = function (text) {
    text = text.toString().toLowerCase().trim();


    return text
        .replace(/\s+/g, '-')    // Replace spaces with -
        .replace(/[^-a-zа-я\u0370-\u03ff\u1f00-\u1fff]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-')    // Replace multiple - with single -
        .replace(/^-+/, '')      // Trim - from start of text
        .replace(/-+$/, '')      // Trim - from end of text
}