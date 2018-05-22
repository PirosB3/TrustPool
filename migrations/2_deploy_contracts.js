var TrustPoolEvent = artifacts.require("TrustPoolEvent");

module.exports = function(deployer) {
  //deployer.deploy(ConvertLib);
  //deployer.link(ConvertLib, MetaCoin);
  //deployer.deploy(MetaCoin);
  deployer.deploy(TrustPoolEvent, 100, 0, false);
};
