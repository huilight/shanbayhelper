
function getDateOfToday(){
    let date = new Date();
    let year = '' + date.getFullYear();
    let month = date.getMonth() + 1 + '';
    let day = date.getDate();
    return year + month + day;
}
let today = getDateOfToday();


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{

    let date = today;
    let temp = getDataByDate(date);

    setTimeout(function(){
        if (request.wrongwords.length > 0 ){
            console.log(temp);
            console.log(request);
            for (let word of request.wrongwords){

                if (temp[date][word]){
                    temp[date][word]++;
                }else{
                    temp[date][word] = 1;
                }
                if (temp.allList[word]){
                    temp.allList[word]++;
                }else{
                    temp.allList[word] = 1;
                }
            }

            console.log(temp);
            chrome.storage.sync.set(temp, function() {
                console.log('保存成功！');
            });
    }    },200)

	sendResponse(JSON.stringify(request));
});

document.onload = renderTable(today);


function renderTable(date){
    data = getDataByDate(date);

    table = $("#wrongWordList");

    setTimeout(function(){
        console.log(data[date]);
        if (Object.keys(data[date]).length === 0){
            table.html("<p>当前日期没有学习记录</p>");
            return;
        }
        for (let k of Object.keys(data[date])){
            let row = '<tr><td>'+ k +'</td><td>'+data[date][k]+'</td><td>'+ data.allList[k] +'</td></tr>';
            table.append(row)
        }
    }, 200);
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