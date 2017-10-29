pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TrustPoolEvent.sol";

contract TestTrustPoolEvent{

  function testInitialBalanceUsingDeployedContract() {
    
    TrustPoolEvent tpEvent = new TrustPoolEvent(
      123 ether,
      1509230905
    );

    uint expected = 123 ether;

    Assert.equal(tpEvent.getDepositAmount(), expected, "The deposit amount should be initialized");
  }

  function testAttendeeIsNotRegisteredByDefault() {
    TrustPoolEvent tpEvent = new TrustPoolEvent(
      123 ether,
      1509230905
    );

    Assert.isFalse(tpEvent.isAttendeeRegistered(msg.sender), "The user has not been registered");
  }
}
