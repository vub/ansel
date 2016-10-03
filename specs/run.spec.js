'use strict';

// A simple test to verify a visible window is opened with a title
const Application = require('spectron').Application
const assert = require('assert')
const fs = require('fs');
const testsPath = '/tmp/ansel-tests';

describe('application launch', function () {
  this.timeout(20000);

  beforeEach(function() {
    if (!fs.existsSync(testsPath))
      fs.mkdirSync(testsPath);

    //console.log(__dirname);
    this.app = new Application({
      path: `${__dirname}/../node_modules/.bin/electron`,
      args: [`${__dirname}/../.`],
      env: { ANSEL_TEST_MODE: 1 }
    })
    console.log(this.app);
    return this.app.start()
      .catch((err) => {
        console.log('err', err);
      });
  })


  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  });

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  })

  //it('should display test mode as title', function() {
  //  return this.app.client.getTitle().then(function(title) {
  //    assert.equal(title, 'Ansel - TEST MODE');
  //  });
  //})

  //it('should be running in test mode', function() {
  //  return this.app.mainProcess.env().then(function(env) {
  //    assert.equal(env.ANSEL_TEST_MODE, true);
  //  });
  //});
})

//describe('Settings screen', function() {
//  it('should fill out the photo folder', function() {
//    return this.app.client.click('#photos-dir').then(function() {
//      console.log('hi');
//    });
//  });
//});
