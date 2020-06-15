const {app, BrowserWindow, clipboard, ipcMain} = require('electron')
const fs = require("fs");
const path = require('path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('index.html')

  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(createWindow)

ipcMain.on('getCurrentClipboard', (event, arg) => {
  console.log("got a args request")
  event.reply('getCurrentClipboard-reply', String(clipboard.readText('selection')))
})

ipcMain.on('setClipboard', (event, arg) => {
  clipboard.writeText(String(arg));
})

ipcMain.on('saveBtn', (event, arg) => {
  fs.writeFile("./data.json",arg,(err,data) => {
    if(err){return console.log(err)}
    console.log("saved")
  })
})

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})