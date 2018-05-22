const TrustPoolEvent = artifacts.require("TrustPoolEvent");

contract('TrustPoolEvent', function(accounts) {
  it("should init deposit amount", async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 0, false);

    //When
    let depositAmount = await tpEvent.depositAmount.call();

    //Then
    assert.equal(100, depositAmount);
  });

  it('should mark attendees as not registered by default', async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 0, false);

    //When
    let isRegistered = await tpEvent.isAttendeeRegistered.call(accounts[0]);

    //Then
    assert.isFalse(isRegistered);
  });

  it("should allow new attendees to register", async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 0, false);

    //When
    await tpEvent.addAttendee.sendTransaction({
      from: accounts[1],
      value: 100
    });

    //Then
    let isRegistered = await tpEvent.isAttendeeRegistered.call(accounts[1]);
    assert.isTrue(isRegistered);
  });

  it("should not allow registration after cutoff", async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 0, true);

    //When
    await tpEvent.addAttendee.sendTransaction({
      from: accounts[1],
      value: 100
    }).then(success => {
      assert.fail("This transaction is expected to fail!");
    }, error => {
      /* do nothing, this is expected! */
    });
  });

  it('should initally mark attendees as PAID, !ATTENDED', async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 0, false);

    //When
    await tpEvent.addAttendee.sendTransaction({
      from: accounts[1],
      value: 100
    });

    //Then
    let attended = await tpEvent.didAttend.call(accounts[1]);
    assert.equal(false, attended);
  });

  it('should allow the organizer to check in attendees', async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 0, false);
    await tpEvent.addAttendee.sendTransaction({
      from: accounts[1],
      value: 100
    });

    //When
    let organizerAddress = await tpEvent.organizer.call();
    await tpEvent.checkInAttendee(accounts[1], {
      from: organizerAddress
    });

    //Then
    let attended = await tpEvent.didAttend.call(accounts[1]);
    assert.equal(true, attended);
  });


  it('should allow the organizer to trigger payout', async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 0, false);
    let organizerAddress = await tpEvent.organizer.call();

    await tpEvent.addAttendee.sendTransaction({
      from: accounts[1],
      value: 100
    });
    let contractBalance = web3.eth.getBalance(tpEvent.address)
    assert.equal(100, contractBalance);

    await tpEvent.checkInAttendee(accounts[1], {
      from: organizerAddress
    });

    //When
    await tpEvent.triggerPayout({
      from: organizerAddress
    });

    //Then
    contractBalance = web3.eth.getBalance(tpEvent.address)
    assert.equal(0, contractBalance);
  });

  it('should only payout attendees who attended', async function () {
    //Given
    let tpEvent = await TrustPoolEvent.new(100, 0, false);
    let organizerAddress = await tpEvent.organizer.call();

    await tpEvent.addAttendee.sendTransaction({
      from: accounts[1],
      value: 100
    });
    await tpEvent.addAttendee.sendTransaction({
      from: accounts[2],
      value: 100
    });
    await tpEvent.addAttendee.sendTransaction({
      from: accounts[3],
      value: 100
    });

    let balance1before = web3.eth.getBalance(accounts[1])
    let balance2before = web3.eth.getBalance(accounts[2])
    let balance3before = web3.eth.getBalance(accounts[3])

    await tpEvent.checkInAttendee(accounts[1], {
      from: organizerAddress
    });

    await tpEvent.checkInAttendee(accounts[3], {
      from: organizerAddress
    });

    //When
    await tpEvent.triggerPayout({
      from: organizerAddress
    });

    //Then
    let balance1after = web3.eth.getBalance(accounts[1])
    let balance2after = web3.eth.getBalance(accounts[2])
    let balance3after = web3.eth.getBalance(accounts[3])

    assert.equal(150, balance1after.minus(balance1before));
    assert.equal(0, balance2after.minus(balance2before));
    assert.equal(150, balance3after.minus(balance3before));
  });
});
