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
  
  address public organizer;
  uint public depositAmount;
  uint public payoutTime;
  mapping (address => Attendee) states;
  mapping (uint => address) attendeeIndex;
  uint public numRegistered = 0;
  uint public numAttended = 0;


  function TrustPoolEvent(uint _depositAmount, uint _payoutTime) {
    depositAmount = _depositAmount;
    payoutTime = _payoutTime;
    organizer = msg.sender;
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
    attendeeIndex[numRegistered] = msg.sender;
    numRegistered++;
  }

  function checkInAttendee(address attendee) public returns (bool) {
    require(msg.sender == organizer);
    require(states[msg.sender].state == AttendeeState.PAID);

    states[attendee].state = AttendeeState.ATTENDED;
    numAttended++;
    return true;
  }

  function triggerPayout() public returns (bool) {
    require(now > payoutTime);
    require(msg.sender == organizer);

    uint payoutAmt = this.balance / numAttended;
    for (uint i = 0; i < numRegistered; i++) {
      address attendee = attendeeIndex[i];
      if (states[attendee].state == AttendeeState.ATTENDED) {
        attendee.send(payoutAmt);
      }
    }
    return true;
  }

}
