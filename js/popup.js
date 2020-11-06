$('#open_background').click(e => {
	window.open(chrome.extension.getURL('background.html'));
});

function sendMessageToContentScript(message, callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		chrome.tabs.sendMessage(tabs[0].id, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}

$('#open_words_side').click(e => {

	sendMessageToContentScript({cmd:'openWordsSide'}, function(response)
	{
		console.log('来自content的回复：'+response);
	});

})