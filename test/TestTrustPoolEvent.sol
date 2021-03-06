pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TrustPoolEvent.sol";

contract TestTrustPoolEvent{

  function testInitialBalanceUsingDeployedContract() public {

    TrustPoolEvent tpEvent = new TrustPoolEvent(
      123 ether,
      1509230905,
      false
    );

    uint expected = 123 ether;

    Assert.equal(tpEvent.depositAmount(), expected, "The deposit amount should be initialized");
  }

  function testAttendeeIsNotRegisteredByDefault() public {
    TrustPoolEvent tpEvent = new TrustPoolEvent(
      123 ether,
      1509230905,
      false
    );

    Assert.isFalse(tpEvent.isAttendeeRegistered(msg.sender), "The user has not been registered");
  }
}
