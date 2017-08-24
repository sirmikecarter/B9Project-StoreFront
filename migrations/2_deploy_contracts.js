var StoreFront = artifacts.require("./StoreFront.sol");

module.exports = function(deployer) {
  deployer.deploy(StoreFront);
};
