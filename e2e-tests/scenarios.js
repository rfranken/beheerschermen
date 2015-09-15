'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /multiRow when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/multiRow");
  });


  describe('multiRow', function() {

    beforeEach(function() {
      browser.get('index.html#/multiRow');
    });


    it('should render multiRow when user navigates to /multiRow', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('singleRow', function() {

    beforeEach(function() {
      browser.get('index.html#/singleRow');
    });


    it('should render singleRow when user navigates to /singleRow', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
