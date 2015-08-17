console.log("background.js started");
/*
chrome.storage.local.get({history :[]}, function(result){
  for(var i in result.history){
    result.history[i]['url'] = result.history[i]['url'].replace(/read\.cgi\/(.+?)\/(\d+).*$/,function(){
      return "read.cgi/"+arguments[1]+"/"+arguments[2]+"/"});
  }
  var rev = result.history.reverse();
  var urls = [];
  result.history = rev.filter(function(history){
    if(urls.indexOf(history['url'])===-1){
      urls.push(history['url']);
      return true;
    }else return false;
  });
  chrome.storage.local.set({history: result.history});
});
*/



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log(sender.tab ?
      // "from a content script:" + sender.tab.url :
      // "from the extension");
  if (request.greeting == "hello"){
    sendResponse({farewell: "goodbye"});
  } 

  console.log(request);
});


// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({url: chrome.extension.getURL('index.html')});
});


