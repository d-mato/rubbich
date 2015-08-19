Date.prototype.toString = function() {
  return [//this.getFullYear(),
        this.getMonth() + 1,
        this.getDate()
        ].join( '/' ) + ' '
        + this.toLocaleTimeString().slice(0,-3);
}

// Model
var History = Backbone.Model.extend({
});

var Histories = Backbone.Collection.extend({
  model: History,
  //comparatorメソッドが正しく定義されていたらsortが行われる
  comparator: function(a, b) {
    return b.get('date') - a.get('date');
  },
});

// thread
var Thread = Backbone.Model.extend({
  defaults: {
    url: 'url',
    title: 'title',
    bbs_url: 'bbs_url',
    bbs_title: 'bbs_title'
  },
});
var Threads = Backbone.Collection.extend({
  model: Thread,
});
var ThreadView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click .thread_url': 'open_thread'
  },
  open_thread: function() {
    $('#thread').html('読み込み中 ...');
    $('#thread').load(this.model.get('url') + " [class=thread]");
    return false;
  },
  template: _.template($('#thread-template').html()),
  render: function() {
    var t = this.template( this.model.toJSON() );
    this.$el.html(t);
    return this;
  },
});

/*
// View
var HistoryView = Backbone.View.extend({
  tagName: 'tr',
  initialize: function() {
    // このviewが管理するmodelに対してdestroyが実行されたらremoveを実行してviewを削除する
    this.model.on('destroy', this.remove, this);
  },
  events: {
    'click .delete': 'destory',
    'click .thread_url': 'open_thread'
  },
  destory: function() {
    if (confirm('Are you sure ?')) {
      this.model.destroy();// modelを削除する
    }
  },
  open_thread: function(){
    $('#thread').html('読み込み中 ...');
    $('#thread').load(this.model.get('url') + " [class=thread]");
    return false;
  },
  // remove: function() {
    // this.$el.remove();// viewを削除する
  // },

  template: _.template($('#history-template').html()),
  render: function() {
    var t = this.template( this.model.toJSON() );
    this.$el.html(t);
    return this;
  },
});

var HistoriesView = Backbone.View.extend({
  tagName: 'tbody',
  render: function() {
    this.collection.each(function(history) {
      var historyView = new HistoryView({ model: history });
      this.$el.append(historyView.render().el);
    },this);
    return this;
  }
});

chrome.storage.local.get({history: []} ,function(result){
   var histories = new Histories();
  for(var i in result.history){
    // result.history[i]['id'] = i;
    var history = new History(result.history[i]);
    histories.add(history);
    // var historyView = new HistoryView({ model: history });
    // $('#history > tbody').append(historyView.render().el);
  }
  // histories.sort();
  var historiesView = new HistoriesView({collection: histories});
  $('#history').append(historiesView.render().el);
});
*/

// button
$('.open-search').click(function(){
  $('.popup').hide();
  $('#search').toggle();
});
$('.open-form').click(function(){
  $('.popup').hide();
  $('#form').toggle();
});
$('.open-browser').click(function(){
  chrome.tabs.create({url: 'http://2ch.net/'});
});
$('.go-bottom').click(function(){
  $('#thread').animate({
    scrollTop: $('#thread >').height()
  },500);
});

$('#search form').submit(function(){
  var query_url = 'http://ff2ch.syoboi.jp/?q=' + $('[name="q"]',this).val(); 
  $('#thread-list').html('読み込み中 ...');
  $.get(query_url, function(data){
    $('#thread-list').html('');
    var html = $.parseHTML(data); // Array

    $('li', $(html)).each(function() {
      // console.log($(this).text());
      var url,title,bbs_url,bbs_title;
      $('a',this).each(function() {
        var href = $(this).attr('href');
        if(href.indexOf('read.cgi')!==-1){
          url = href; title = $(this).text();
        }else if(href.match(/2ch\.net\/[\w\d]+?\/$/)){
          bbs_url = href; bbs_title = $(this).text();
        }
      });

      var thread = new Thread({
        url: url,
        title: title,
        bbs_url: bbs_url,
        bbs_title: bbs_title,
      });

      var threadView = new ThreadView({model: thread});
      $('#thread-list').append(threadView.render().el);
    });

    $('#search').hide();
  });
  return false;
});

$('#form form').submit(function(){
  var ref = "";
  var data = {
    mail: $('[name="mail"]',this).val(),
    bbs: $('[name="bbs"]',this).val(),
    key: $('[name="key"]',this).val(),
    time: $('[name="time"]',this).val(),
    MESSAGE: $('[name="MESSAGE"]',this).val(),
  };
  
  /*
  $.ajax({
    type: "POST",
    url: $(this).attr('action'),
    // url: "http://127.0.0.1/",
    headers: {'X-Alt-Referer': ref },
    data: data,
    success: function(result){
      console.log(result);
    },
  });
  */
  alert("未実装だよ");
  return false;
});



