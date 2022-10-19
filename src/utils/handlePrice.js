const handlePriceDisCount = (price, disCount) => {
    if (!price) return;
    if (!disCount) disCount = 0;

    return price - (price * disCount) / 100;
};

module.exports = handlePriceDisCount;
