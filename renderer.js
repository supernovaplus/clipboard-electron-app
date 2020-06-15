// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron')

// let currentClipboard;
let selectedElement;
let elementsList = [];
const myInput = document.getElementById("myInput")
const saveBtn = document.getElementById("saveBtn")
const insertClip = document.getElementById("insertClip")
const elementsListDiv = document.getElementById("elementsListDiv");

fetch("./data.json")
.then(res=>res.json())
.then(res=>{
    elementsList.push(...res);
    renderElementsList();
})

const addText = () => {
    if(!myInput.value) return; 
    elementsList.push(myInput.value);
    myInput.value = "";
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
    elementsList.push(arg);
    saveBtn.value = "NOT SAVED";
    renderElementsList();
});

// ipcRenderer.send('getCurrentClipboard', '')
// document.getElementById("getCurrentClipboardDiv").addEventListener("click", () => {
//     ipcRenderer.send('getCurrentClipboard', '')
// })

// ipcRenderer.on("getCurrentClipboard-reply", (event, arg) => {
//     console.log(Date.now())
//     currentClipboardDiv.innerText = String(arg);
// });

saveBtn.onclick = () => {
    ipcRenderer.send('saveBtn', JSON.stringify(elementsList))
    saveBtn.value = "SAVED";
}


const renderElementsList = () => {
    elementsListDiv.innerHTML = "";
    const ul = document.createElement("ul");
    elementsListDiv.appendChild(ul);

    for (let i = 0; i < elementsList.length; i++) {
        const element = elementsList[i];

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
    }
};