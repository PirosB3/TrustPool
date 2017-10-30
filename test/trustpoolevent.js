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

  it("should init deposit amount", function() {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 1509230905);

    //When
    let depositAmount = await instance.getDepositAmount.call();

    //Then
    assert.equal(100, depositAmount);
  });
});
