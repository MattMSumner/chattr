import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find("message");
  },

  actions: {
    createMessage: function() {
      const handle = this.get("session.currentUser.handle");
      const body = this.controller.get("body");

      let message = this.store.createRecord("message", {handle: handle, body: body});
      message.save();

      this.controller.set("body", "");
    },

    logout: function() {
      this.get("session").close();
    }
  }
});
