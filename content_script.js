$(function(){

  var res_box = $('<div>').css({
    border:'solid 1px #000',
    position:'absolute',
    width:'800px',
    backgroundColor:'#ddd',
    display:'none',
  }).appendTo($('body'));

  var anchor_count_data = [];

  $('dt').each(function(){
    var m = $(this).text().match(/(\d+)\s：/);
    var $dd = $(this).next();
    if(m){
      var res_id = m[1];
      $(this).addClass('res_'+res_id);
      $dd.addClass('res_'+res_id);
    }
    if(m = $dd.text().match(/>>(\d+)/)){
      if(anchor_count_data[m[1]] == undefined)
        anchor_count_data[m[1]] = 1;
      else
        anchor_count_data[m[1]] += 1;
    }
  });
  /*
  $('dd').each(function(){
    var m;
    if(m = $(this).text().match(/>>(\d+)/)){
      var anchor_id = m[1];
      $('dt.res_'+anchor_id);
    }

  });
  */
  for(var id in anchor_count_data){
    var $dt = $('dt.res_'+id);
    if($dt.html() == undefined)continue;
    $dt.html($dt.html().replace(/(\d+)(\s：[\s\S]+)$/,function(){
      return arguments[1] + "<a href='#' class='anchor_jump'>(" + anchor_count_data[id] + ")</a>" + arguments[2];
    }));
  }

  $('a.anchor_jump').click(function(){
    return false;
  });

  $("a[href^='../test']").hover(function(e){
    var m = $(this).text().match(/^>>(\d+)$/);
    if(m){
      var res_id = m[1];
      res_box.html('')
        .append($('dt.res_'+res_id).clone())
        .append($('dd.res_'+res_id).clone())
        .css({
          left:($(this).offset().left)+'px',
          top:($(this).offset().top+10)+'px',
          display:'block',
        })
        .hover(null,function(){
          res_box.hide();
        });
    }
  });

  /*
  $("a[href^='../test']").each(function(){
    if((m = $(this).text().match(/>(\d+)/))==false)return false;
    console.log(m);
    var res_id = m[1];
    console.log(res_id);
    
    $(this).mouseover(function(e){
      //if(res_box.css('display')=='block')return false;
      res_box.html('')
      .append($('dt:eq('+(res_id-1)+')').clone())
      .append($('dd:eq('+(res_id-1)+')').clone())
      .css({
        left:(e.pageX-20)+'px',
        top:(e.pageY-20)+'px',
        display:'block',
      });
      
    });
    
    $(this).click(function(){
      return false;
    });
    
  });
  */
  
  /* 画面のどこかをクリックしたらres_boxを隠す */
  $('body').click(function(){
    if(res_box.css('display')=='block'){
      res_box.hide();
    }
  })

  chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });

  chrome.storage.local.get({history :[]}, function(result){
    var url = document.URL.replace(/read\.cgi\/(.+?)\/(\d+).*$/,function(){
      return "read.cgi/"+arguments[1]+"/"+arguments[2]+"/"});

    var new_data = {
      "url": url,
      "title": document.title,
      "date": Date.now()
    }
    for(var i in result.history){
      if(result.history[i]['url'] == new_data['url']){
        result.history.splice(i,1);
      }
    }
    result.history.push(new_data);
    chrome.storage.local.set({history: result.history});
  });

});
