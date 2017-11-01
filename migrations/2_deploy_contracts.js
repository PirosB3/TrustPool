var TrustPoolEvent = artifacts.require("./TrustPoolEvent.sol");

module.exports = function(deployer) {
  //deployer.deploy(ConvertLib);
  //deployer.link(ConvertLib, MetaCoin);
  //deployer.deploy(MetaCoin);
  deployer.deploy(TrustPoolEvent);
};
