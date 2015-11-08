(function() {
  var MessageModel = Backbone.Model.extend({
    initialize: function(options) {
      this.author = options.author || 'anonymous';
      this.content = options.content || '';
    }
  });

  var MessageCollection = Backbone.Collection.extend({
    url: '/messages',
    model: MessageModel
  });

  var MessageView = Backbone.View.extend({
    initialize: function(options) {
      this.model = options.model;
      this.$el = options.$el;
    },
    template: _.template($('#messageTemplate').html()),
    render: function() {
      return this.$el.html(this.template(this.model.attributes));
    }
  });

  var MessageRouter = Backbone.Router.extend({
    routes: {
      '#chat': 'chat',
      '#rooms/': 'rooms',
      '#rooms/:roomName': 'room',
      '#private': 'private',
      '#private/personId': 'privateChat'
    },
    chat: function() {
      messages = new MessageCollection();
    },
    rooms: function() {
      rooms = new RoomCollection();
    },
    room: function(roomName) {
      if (rooms.contains(roomName)) {
        var room = rooms.filter(function(room) { room.name === roomName; })[0];
        room.render();
      } else {
        this.navigate('#chat', { trigger: true });
      }
    },
    private: function() {
      var privateMessages = new PrivateMessageCollection();
    },
    privateChat: function(personId) {
      var personalMessages = new PrivateMessageCollection({ id: personId });
    }
  });

  var messageModel = new MessageModel({ author: 'Bryan', content: 'Hello' });
  var messageView = new MessageView({ $el: $('.messages'), model: messageModel });
  messageView.render();

  var socket = io();
})();
