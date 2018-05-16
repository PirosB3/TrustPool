pragma solidity ^0.4.23;

contract TrustPoolEvent {
  //NOTE: no way for Organizer to make money for now
  //Implicit - not keeping track of whether the contract has been "drained"

  struct Attendee {
    bool isRegistered;
    AttendeeState state;
  }

  enum AttendeeState { PAID, ATTENDED }

  address public organizer;
  uint public depositAmount;
  uint public payoutTime;
  bool usePayoutTime;
  mapping (address => Attendee) states;
  mapping (uint => address) attendeeIndex;
  uint public numRegistered = 0;
  uint public numAttended = 0;

  constructor(
    uint _depositAmount,
    uint _payoutTime,
    bool _usePayoutTime
  ) public {
    depositAmount = _depositAmount;
    payoutTime = _payoutTime;
    usePayoutTime = _usePayoutTime;
    organizer = msg.sender;
  }

  function isAttendeeRegistered(address attendee) public view returns (bool) {
    return states[attendee].isRegistered;
  }

  function didAttend(address attendee) public view returns (bool) {
    return states[attendee].isRegistered
      && states[attendee].state == AttendeeState.ATTENDED;
  }

  function addAttendee() public payable {
    require(msg.value >= depositAmount);
    require(msg.sender != organizer);
    if (usePayoutTime) {
      require(now < payoutTime);
    }

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
    if (usePayoutTime) {
      require(now > payoutTime);
    }
    require(msg.sender == organizer);

    uint payoutAmt = address(this).balance / numAttended;
    for (uint i = 0; i < numRegistered; i++) {
      address attendee = attendeeIndex[i];
      if (states[attendee].state == AttendeeState.ATTENDED) {
        attendee.transfer(payoutAmt);
      }
    }
    return true;
  }

}
