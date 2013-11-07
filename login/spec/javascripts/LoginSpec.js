// Generated by CoffeeScript 1.6.3
(function() {
  describe("Login", function() {
    var login, newUser, resetTracker, sampleEmail, testWindow;
    login = null;
    testWindow = null;
    sampleEmail = "foo@example.com";
    newUser = "new";
    resetTracker = function() {
      tracker.path = backupTracker.path;
      return tracker.path_refinements = backupTracker.path_refinements;
    };
    beforeEach(function() {
      var ready;
      ready = false;
      require(['../../login', 'jasmine-jquery'], function(Login) {
        Login.init();
        login = Login.instance;
        testWindow = $('<div></div>');
        ready = true;
        return loadFixtures("login.html");
      });
      return waitsFor(function() {
        return ready;
      });
    });
    describe("#_setEmail", function() {
      it("assigns the zmail", function() {
        login._setEmail(sampleEmail);
        return expect(login.my.zmail).toEqual(sampleEmail);
      });
      return it("assigns the a cookie", function() {
        login._setEmail(sampleEmail);
        return expect($.cookie('zmail')).toEqual(sampleEmail);
      });
    });
    return describe("#_toggleLogIn", function() {
      describe("with a temp or perm session", function() {
        beforeEach(function() {
          login.my.session = "temp";
          return $.cookie('z_type_email', '');
        });
        it("hides register link", function() {
          login._toggleLogIn();
          return expect($('a.register').parent()).toHaveClass('hidden');
        });
        return it("hides the account link when z_type_email", function() {
          $.cookie('z_type_email', 'profile');
          login._toggleLogIn();
          return expect($('a.account').parent()).not.toHaveClass('hidden');
        });
      });
      return describe("without a session", function() {});
    });
  });

}).call(this);
