var lastWord = "";
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



document.addEventListener("click", getWrongList, true);
document.addEventListener("keydown", getWrongList, true);