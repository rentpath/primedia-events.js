// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['jquery', './lib/browserdetect', 'jquery-cookie-rjs'], function($, browserdetect) {
    var WH;
    return WH = (function() {

      function WH() {
        this.obj2query = __bind(this.obj2query, this);

        this.firedTime = __bind(this.firedTime, this);

        this.fire = __bind(this.fire, this);

        this.elemClicked = __bind(this.elemClicked, this);

        this.init = __bind(this.init, this);

      }

      WH.prototype.cacheBuster = 0;

      WH.prototype.domain = '';

      WH.prototype.firstVisit = null;

      WH.prototype.lastLinkClicked = null;

      WH.prototype.metaData = null;

      WH.prototype.path = '';

      WH.prototype.performance = window.performance || {};

      WH.prototype.sessionID = '';

      WH.prototype.userID = '';

      WH.prototype.warehouseTag = null;

      WH.prototype.init = function(opts) {
        if (opts == null) {
          opts = {};
        }
        this.clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img';
        if (opts.exclusions != null) {
          this.clickBindSelector = this.clickBindSelector.replace(/,\s+/g, ":not(" + opts.exclusions + "), ");
        }
        this.domain = document.location.host;
        this.exclusionList = opts.exclusionList || [];
        this.fireCallback = opts.fireCallback;
        this.parentTagsAllowed = opts.parentTagsAllowed || /div|ul/;
        this.path = "" + document.location.pathname + document.location.search;
        this.warehouseURL = opts.warehouseURL;
        this.setCookies();
        this.determineDocumentDimensions(document);
        this.determineWindowDimensions(window);
        this.determinePlatform(window);
        this.metaData = this.getDataFromMetaTags(document);
        this.firePageViewTag();
        return this.bindBodyClicked(document);
      };

      WH.prototype.bindBodyClicked = function(doc) {
        return $(doc).on('click', this.clickBindSelector, this.elemClicked);
      };

      WH.prototype.determineParent = function(elem) {
        var el, _i, _len, _ref;
        _ref = elem.parents();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          if (el.tagName.toLowerCase().match(this.parentTagsAllowed)) {
            return this.firstClass($(el));
          }
        }
      };

      WH.prototype.determineWindowDimensions = function(obj) {
        obj = $(obj);
        return this.windowDimensions = "" + (obj.width()) + "x" + (obj.height());
      };

      WH.prototype.determineDocumentDimensions = function(obj) {
        obj = $(obj);
        return this.browserDimensions = "" + (obj.width()) + "x" + (obj.height());
      };

      WH.prototype.determinePlatform = function(win) {
        return this.platform = browserdetect.platform(win);
      };

      WH.prototype.elemClicked = function(e, opts) {
        var attr, attrs, domTarget, href, item, jQTarget, realName, subGroup, trackingData, value, _i, _len, _ref;
        if (opts == null) {
          opts = {};
        }
        domTarget = e.target;
        jQTarget = $(e.target);
        attrs = domTarget.attributes;
        item = this.firstClass(jQTarget) || '';
        subGroup = this.determineParent(jQTarget) || '';
        value = jQTarget.text() || '';
        trackingData = {
          sg: subGroup,
          item: item,
          value: value,
          type: 'click',
          x: e.clientX,
          y: e.clientY
        };
        for (_i = 0, _len = attrs.length; _i < _len; _i++) {
          attr = attrs[_i];
          if (attr.name.indexOf('data-') === 0 && (_ref = attr.name, __indexOf.call(this.exclusionList, _ref) < 0)) {
            realName = attr.name.replace('data-', '');
            trackingData[realName] = attr.value;
          }
        }
        href = jQTarget.attr('href');
        if (href && (opts.followHref != null) && opts.followHref) {
          this.lastLinkClicked = href;
          e.preventDefault();
        }
        this.fire(trackingData);
        return e.stopPropagation();
      };

      WH.prototype.fire = function(obj) {
        var _this = this;
        obj.ft = this.firedTime();
        obj.cb = this.cacheBuster++;
        obj.sess = "" + this.userID + "." + this.sessionID;
        obj.fpc = this.userID;
        obj.site = this.domain;
        obj.path = this.path;
        obj.title = $('title').text();
        obj.bs = this.windowDimensions;
        obj.sr = this.browserDimensions;
        obj.os = this.platform.OS;
        obj.browser = this.platform.browser;
        obj.ver = this.platform.version;
        obj.ref = document.referrer;
        obj.registration = $.cookie('sgn') === '1' ? 1 : 0;
        obj.person_id = $.cookie('zid');
        obj.email_registration = $.cookie('provider') === 'identity' ? 1 : 0;
        obj.facebook_registration = $.cookie('provider') === 'facebook' ? 1 : 0;
        obj.googleplus_registration = $.cookie('provider') === 'google_oauth2' ? 1 : 0;
        obj.twitter_registration = $.cookie('provider') === 'twitter' ? 1 : 0;
        if (typeof this.fireCallback === "function") {
          this.fireCallback(obj);
        }
        if (this.firstVisit) {
          obj.firstVisit = this.firstVisit;
          this.firstVisit = null;
        }
        return this.obj2query($.extend(obj, this.metaData), function(query) {
          var lastLinkRedirect, requestURL;
          requestURL = _this.warehouseURL + query;
          if (requestURL.length > 2048 && navigator.userAgent.indexOf('MSIE') >= 0) {
            requestURL = requestURL.substring(0, 2043) + "&tu=1";
          }
          if (_this.warehouseTag) {
            _this.warehouseTag[0].src = requestURL;
          } else {
            _this.warehouseTag = $('<img/>', {
              id: 'PRMWarehouseTag',
              border: '0',
              width: '1',
              height: '1',
              src: requestURL
            });
          }
          _this.warehouseTag.onload = $('body').trigger('WH_pixel_success_' + obj.type);
          _this.warehouseTag.onerror = $('body').trigger('WH_pixel_error_' + obj.type);
          if (_this.lastLinkClicked) {
            lastLinkRedirect = function(e) {
              if (this.lastLinkClicked.indexOf('javascript:') === -1) {
                return document.location = this.lastLinkClicked;
              }
            };
            return _this.warehouseTag.unbind('load').unbind('error').bind('load', lastLinkRedirect).bind('error', lastLinkRedirect);
          }
        });
      };

      WH.prototype.firedTime = function() {
        var now;
        now = this.performance.now || this.performance.webkitNow || this.performance.msNow || this.performance.oNow || this.performance.mozNow;
        return ((now != null) && now.call(this.performance)) || new Date().getTime();
      };

      WH.prototype.firePageViewTag = function() {
        return this.fire({
          type: 'pageview'
        });
      };

      WH.prototype.firstClass = function(elem) {
        var klasses;
        if (!(klasses = elem.attr('class'))) {
          return;
        }
        return klasses.split(' ')[0];
      };

      WH.prototype.getDataFromMetaTags = function(obj) {
        var metaTag, metas, name, retObj, _i, _len;
        retObj = {
          cg: ''
        };
        metas = $(obj).find('meta');
        for (_i = 0, _len = metas.length; _i < _len; _i++) {
          metaTag = metas[_i];
          metaTag = $(metaTag);
          if (metaTag.attr('name') && metaTag.attr('name').indexOf('WH.') === 0) {
            name = metaTag.attr('name').replace('WH.', '');
            retObj[name] = metaTag.attr('content');
          }
        }
        return retObj;
      };

      WH.prototype.obj2query = function(obj, cb) {
        var key, rv, val;
        rv = [];
        for (key in obj) {
          if (obj.hasOwnProperty(key) && ((val = obj[key]) != null)) {
            rv.push("&" + key + "=" + (encodeURIComponent(val)));
          }
        }
        cb(rv.join('').replace(/^&/, '?'));
      };

      WH.prototype.setCookies = function() {
        var sessionID, timestamp, userID;
        userID = $.cookie('WHUserID');
        sessionID = $.cookie('WHSessionID');
        timestamp = new Date().getTime();
        if (!userID) {
          userID = timestamp;
          $.cookie('WHUserID', userID, {
            expires: 3650,
            path: '/'
          });
        }
        if (!sessionID) {
          sessionID = timestamp;
          this.firstVisit = timestamp;
          $.cookie('WHSessionID', sessionID, {
            path: '/'
          });
        }
        this.sessionID = sessionID;
        return this.userID = userID;
      };

      return WH;

    })();
  });

}).call(this);
