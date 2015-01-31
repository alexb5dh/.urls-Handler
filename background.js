function getUrls(url, callback){
	var url = url;
	var xhr = new XMLHttpRequest();	

	xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4)
    	{
			var urls = null;

			if(!url.indexOf('file://') || !url.indexOf('ftp://'))
			{
				if(xhr.status == 0)
					urls = xhr.responseText.split('\n');
			}
		
			else if(xhr.status == 200)
			{
				var contentType = xhr.getResponseHeader('Content-Type');
				if((contentType && contentType.indexOf('application/x-url-list') != -1))
					urls = xhr.responseText.split('\n');
			}
        	
        	callback(urls);
    	}
    }

    xhr.open("get", url);
    xhr.send();
}

function downloadUrls(urls){
	for(var i = 0; i < urls.length; i++)
	{
		var url = urls[i].trim();
		if(url) chrome.downloads.download({url: url});
	}
}

function modifyRequest(details){
	if(details.tabId == -1) return;
	getUrls(details.url, function(urls){
		if (urls && urls.length != 0) downloadUrls(urls); 
	});
	
	return {redirectUrl: "javascript:"};
}

chrome.webRequest.onBeforeRequest.addListener(
	modifyRequest, {urls: ['*://*/*.urls?*', '*://*/*.urls', 'ftp://*/*.urls', 'file://*/*.urls']}, ['blocking']);