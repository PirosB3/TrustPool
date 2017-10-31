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

  function getOrganizer() public returns (address) {
    return organizer;
  }

  function getDepositAmount() public returns (uint) {
    return depositAmount;
  } 

  function isAttendeeRegistered(address attendee) public returns (bool) {
    return states[attendee].isRegistered;
  }

  function didAttend(address attendee) public returns (bool) {
    return states[attendee].state == AttendeeState.ATTENDED;
  }

  function addAttendee() payable {
    require(msg.value >= depositAmount);
    require(msg.sender != organizer);

    //Ensure that the attendee is not yet registered
    require(!states[msg.sender].isRegistered);

    states[msg.sender].isRegistered = true;
    states[msg.sender].state = AttendeeState.PAID;
  }

  function checkInAttendee(address attendee) public returns (bool) {
    require(msg.sender == organizer);
    require(states[msg.sender].state == AttendeeState.PAID);

    states[attendee].state = AttendeeState.ATTENDED;
    return true;
  }

  //Remaining functions
  // - checkInAttendee
  // - checkInAttendees (in bulk)
  // - payout

}
