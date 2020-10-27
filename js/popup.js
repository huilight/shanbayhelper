$('#open-background').click(e => {
	window.open(chrome.extension.getURL('background.html'));
});