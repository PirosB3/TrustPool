var TrustPoolEvent = artifacts.require("./TrustPoolEvent.sol");

contract('TrustPoolEvent', function(accounts) {
  it('should mark attendees as not registered by default', async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 1509230905);

    //When
    let isRegistered = await tpEvent.isAttendeeRegistered.call(accounts[0]);

    //Then
    assert.isFalse(isRegistered);
  });

  it("should allow new attendees to register", async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 1509230905);

    //When
    await tpEvent.addAttendee.sendTransaction({
      from: accounts[0],
      value: 100
    });

    //Then
    let isRegistered = await tpEvent.isAttendeeRegistered.call(accounts[0]);
    assert.isTrue(isRegistered);
  });

  it("should init deposit amount", async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 1509230905);

    //When
    let depositAmount = await tpEvent.getDepositAmount.call();

    //Then
    assert.equal(100, depositAmount);
  });

  it('should initally mark attendees as PAID, !ATTENDED', async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 1509230905);

    //When
    await tpEvent.addAttendee.sendTransaction({
      from: accounts[0],
      value: 100
    });

    //Then
    let attended = await tpEvent.didAttend.call(accounts[0]);
    assert.equal(false, attended);
  });

  it('should allow the organizer to check in attendees', async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 1509230905);
    await tpEvent.addAttendee.sendTransaction({
      from: accounts[0],
      value: 100
    });

    //When
    let organizerAddress = await tpEvent.getOrganizer.call();
    await tpEvent.checkInAttendee(accounts[0], {
      from: organizerAddress
    });

    //Then
    let attended = await tpEvent.didAttend.call(accounts[0]);
    assert.equal(true, attended);
  });
});
