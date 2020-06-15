const { ipcRenderer } = require('electron')

let selectedElement;
let elementsList = [];
const clipInput = document.getElementById("clipInput")
const saveBtn = document.getElementById("saveBtn")
const insertClip = document.getElementById("insertClip")
const clipList = document.getElementById("clipList");

fetch("./data.json")
.then(res=>res.json())
.then(res=>{
    elementsList = res;
    renderElementsList();
})

const addText = () => {
    if(!clipInput.value) return; 
    elementsList.push(clipInput.value);
    clipInput.value = "";
    saveBtn.value = "NOT SAVED";
    renderElementsList();
}

const removeItem = (key) => {
    elementsList = elementsList.filter((k,i) => i!==key)
    saveBtn.value = "NOT SAVED";
    renderElementsList();
}

const selectItem = (e) => {
    if(!e.target.innerText) return;    

    if(selectedElement){
        selectedElement.style.color = "inherit";
    }
    
    selectedElement = e.target;
    e.target.style.color = "red";
    ipcRenderer.send('setClipboard', String(e.target.innerText))
}

document.getElementById("addTextDiv").addEventListener("click", addText)

insertClip.onclick = () => {
    ipcRenderer.send('getCurrentClipboard', '');
}

ipcRenderer.on("getCurrentClipboard-reply", (event, arg) => {
    elementsList.push(String(arg));
    saveBtn.value = "NOT SAVED";
    renderElementsList();
});

saveBtn.onclick = () => {
    ipcRenderer.send('saveBtn', JSON.stringify(elementsList))
    saveBtn.value = "SAVED";
}

const renderElementsList = () => {
    clipList.innerHTML = "";
    const ul = document.createElement("ul");
    clipList.appendChild(ul);

    elementsList.forEach((element, i) => {
        const li = document.createElement("li")
        li.className = "listItem";

        const spanLeft = document.createElement("span");
        spanLeft.innerText = element;
        spanLeft.className = "left";
        spanLeft.onclick = selectItem;
        
        const spanRight = document.createElement("input");
        spanRight.type = "button";
        spanRight.value= "x";
        spanRight.className = "right";
        spanRight.onclick = () => removeItem(i);


        li.appendChild(spanLeft);
        li.appendChild(spanRight);
        ul.appendChild(li);
    })
};