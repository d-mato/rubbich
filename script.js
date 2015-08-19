Date.prototype.toString = function() {
  return [//this.getFullYear(),
        this.getMonth() + 1,
        this.getDate()
        ].join( '/' ) + ' '
        + this.toLocaleTimeString().slice(0,-3);
}

function showHistory() {
  chrome.storage.local.get({history: []} ,function(result){
    $('#thread-list').html('');
    for(var i in result.history.reverse()){
      var thread = new Thread(result.history[i]);
      var threadView = new ThreadView({model: thread});
      $('#thread-list').append(threadView.render().el);
    }
  });
}

function updateHistory(thread) { // 引数はBackboneのModel
  chrome.storage.local.get({history: []} ,function(result){
    result.history = result.history.filter(function(history){
      if(thread.get('url').indexOf(history['url'])===-1){
        return true;
      }else{
        return false;
      }
    });

    thread.set('last_read', new Date());
    result.history.push(thread.toJSON());
    chrome.storage.local.set({history: result.history});
  });
}

// thread
var Thread = Backbone.Model.extend({
  defaults: {
    url: 'url',
    title: 'title',
    bbs_url: 'bbs_url',
    bbs_title: 'bbs_title',
    last_read: 0,
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
    updateHistory(this.model);
    return false;
  },
  template: _.template($('#thread-template').html()),
  render: function() {
    var t = this.template( this.model.toJSON() );
    this.$el.html(t);
    return this;
  },
});

// button
$('.popup').click(function(e) {
  $(this).show();
  e.stopPropagation();
});
$(document).click(function() {
  $('.popup').hide();
});

$('.open-search').click(function(e){
  $('.popup').hide();
  $('#search').toggle();
  e.stopPropagation();
});
$('.open-form').click(function(e){
  $('.popup').hide();
  $('#form').toggle();
  e.stopPropagation();
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


// スレ閲覧用の拡張スクリプト
$('#thread').on('click', 'a', function() {
  var href = $(this).attr('href');
  var m = href.match(/\.\.\/test\/read\.cgi\/[\d\w]+?\/\d+?\/(\d+)/);
  console.log(m[1]);
  return false;
});


showHistory();
