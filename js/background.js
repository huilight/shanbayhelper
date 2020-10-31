
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


function renderTable(date, sortByCol=null){
    var data = getDataByDate(date);
    var words = [];

    var table = $("#wrongWordList");
    table.html('<tr><th>序号</th><th data-sort=0 class="sort">单词</th><th data-sort=1 class="sort">今日错误次数</th><th data-sort=2 class="sort">总错误次数</th></tr>');
    setTimeout(function(){
        console.log(data[date]);
        if (Object.keys(data[date]).length === 0){
            table.html("<p>当前日期没有学习记录</p>");
            return;
        }
        for (let k of Object.keys(data[date])){
            words.push([k, data[date][k], data.allList[k]])
        }

        if (sortByCol !== null && sortByCol !== 0){
            words.sort(function(value1, value2){
                return value2[sortByCol] - value1[sortByCol];
            })
        }
        console.log(words)
        for(let i in words){
            let row = '<tr>'+'<td>'+ (parseInt(i)+1) +'</td>'+'<td>'+ words[i][0] +'</td><td>'+words[i][1]+'</td><td>'+ words[i][2] +'</td></tr>';
            table.append(row)
        }
    }, 200);
}

document.onload = renderTable(today);
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


$(document).on('click', '.sort', function (){renderTable(today, $(this).data('sort'))});
