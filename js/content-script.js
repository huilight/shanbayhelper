var lastWord = "";
function getDateOfToday(){
    let date = new Date();
    let year = '' + date.getFullYear();
    let month = date.getMonth() + 1 + '';
    let day = date.getDate();
    return year + month + day;
}
let today = getDateOfToday();

function getWrongList(){
    let wrongList = []
    if (document.getElementsByClassName("StudySummary_studySummary__32y_I").length){
        let list = document.getElementsByTagName('tr');
        for (let i=0; i<list.length; ++i){
            if (list[i].className.endsWith("wrong")){
                temp = list[i].getElementsByClassName('StudySummaryItem_word__2Nx4Z');
                if (temp){
                    wrongList.push(temp[0].textContent);
                }
            }
        }
    }
    if (wrongList.length !== 0){
        if (lastWord == wrongList[0]){
            wrongList = [];
        }else{
            lastWord = wrongList[0];
            chrome.runtime.sendMessage({wrongwords: wrongList}, function(response) {
                console.log('收到来自后台的回复：' + response);
            });
        }
    }

    return wrongList;
};


function wordSide(){
    side = document.createElement('div');
    side.setAttribute("id", "words_side")
    side.style = "position: fixed; top: 200px; right: 20px; background: rgba(0,0,0,0.7);color: white;";
    html = "<div id=\"close_words_side\" style=\"width: 20px; cursor:pointer; margin-bottom:2px; font-size: 20px;text-align: center;background:black; float: right;\">X</div><ul style='list-style: none;font-size:2em;margin:0;padding:20px;line-height:1.2em'>##</ul>";
    lis = []
    keys = Object.keys(data[today]);

    if (keys.length === 0){return;}

    for(let i of keys){
    	lis.push('<li>'+i+'</li>');
    }

    html = html.replace(/##/, lis.slice(0,10).join(''));
    side.innerHTML = html;
    document.body.appendChild(side);
    document.getElementById("close_words_side").addEventListener('click', closeWordsSide)
}

function getDataByDate(date){
    // 按日期获取单词列表
    let temp = {};
    temp[date] = {};
    temp.allList = {};

    chrome.storage.sync.get(temp, function(items) {
            temp[date] = items[date];
            temp.allList = items.allList;
    });
    return temp;
}
data = getDataByDate(today)

function closeWordsSide(){
    side = document.getElementById("words_side");
    side.hidden = true;
}

setTimeout(wordSide, 2000);


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.cmd == 'openWordsSide'){
        document.getElementById("words_side").hidden = false;
    }
	sendResponse('opened');
});

document.addEventListener("click", getWrongList, true);
document.addEventListener("keydown", getWrongList, true);
