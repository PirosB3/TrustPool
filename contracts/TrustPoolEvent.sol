pragma solidity ^0.4.4;

contract TrustPoolEvent {
  //Need
  // Organizer Address
  // Fee
  // Map of Attendee to State
  // Payout Time (in block timestamp)
  //NOTE: no way for Organizer to make money for now

  //For the State
  // 0 - Paid
  // 1 - Attended

  //Implicit - not keeping track of whether the contract has been "drained"

  struct Attendee {
    bool isRegistered;
    AttendeeState state;
  }

  enum AttendeeState { PAID, ATTENDED }
  
  address organizer;
  uint public depositAmount;
  uint public payoutTime;
  mapping (address => Attendee) states;


  function TrustPoolEvent(uint _depositAmount, uint _payoutTime) {
    depositAmount = _depositAmount;
    payoutTime = _payoutTime;
    organizer = msg.sender;
  }

  function getDepositAmount() public returns (uint) {
    return depositAmount;
  } 

  function isAttendeeRegistered(address attendee) public returns (bool) {
    return states[attendee].isRegistered;
  }

  function addAttendee() payable {
    require(msg.value >= depositAmount);

    //Ensure that the attendee is not yet registered
    require(!states[msg.sender].isRegistered);

    states[msg.sender].isRegistered = true;
    states[msg.sender].state = AttendeeState.PAID;
  }

}
