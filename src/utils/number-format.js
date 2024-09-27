exports.nmbrFormat = (number) => {
    const formatter = new Intl.NumberFormat('en', {
        notation: 'compact',
        compactDisplay: 'short'
    });
    const num = formatter.format(number);
    return num < 10 ? `0${num}` : num;
}