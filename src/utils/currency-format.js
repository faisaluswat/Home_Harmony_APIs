exports.usdFormat = (price) => {
    const USDollor = new Intl.NumberFormat('en-Us', {
        style: 'currency',
        currency: 'USD'
    })
    return USDollor.format(price);
}