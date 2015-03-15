import Ember from "ember";

export default Ember.Object.extend({
  open: function(authorization) {
    let store = this.get("container").lookup("store:main");

    return new Ember.RSVP.Promise((resolve) => {
      return store.find("user", authorization.uid).then(function(user){
        Ember.run.bind(null, resolve({currentUser: user}));
      }, () => {
        let newUser = store.createRecord("user", {
          id: authorization.uid,
          handle: this._handleFor(authorization)
        });

        newUser.save().then(function(user) {
          Ember.run.bind(null, resolve({currentUser: user}));
        });
      });
    });
  },

  fetch: function() {
    let firebase = this.get("container").lookup("adapter:application").firebase;
    let authData = firebase.getAuth();
    let store = this.get("container").lookup("store:main");

    return new Ember.RSVP.Promise(function(resolve, reject) {
      if(authData) {
        store.find("user", authData.uid).then(function(user) {
          Ember.run.bind(null, resolve({currentUser: user}));
        }, function() {
          Ember.run.bind(null, reject("no session"));
        });
      } else {
        Ember.run.bind(null, reject("no session"));
      }
    });
  },

  close: function() {
    let firebase = this.get("container").lookup("adapter:application").firebase;
    let store = this.get("container").lookup("store:main");

    return new Ember.RSVP.Promise(function(resolve) {
      store.unloadAll("user");
      store.unloadAll("message");
      firebase.unauth();
      resolve({currentUser: null});
    });
  },

  _handleFor: function(authorization) {
    if(authorization.twitter) {
      return authorization.twitter.displayName;
    }  else {
      throw new Error("couldn't find a username!");
    }
  }
});
