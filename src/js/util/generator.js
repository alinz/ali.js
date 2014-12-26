var idGenCounter = 0;

module.exports = {
  genId: function () {
    return ++idGenCounter;
  }
};
