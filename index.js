const {app, BrowserWindow, Tray, Menu, clipboard, MenuItem, ipcMain} = require('electron')
const nativeImage = require('electron').nativeImage
const Store = require('electron-store');
const store = new Store();
let win, tray, contextMenu, i, menuContext;

// settings init
function resetAll() {
    store.set({
        "names":{
            "1":"Suspition Lenny",
            "2":"The Best Text",
            "3":"._.",
            "4":"Guns 'N Roses",
            "5":"(ᴗ ͜ʖ ᴗ)",
            "6":"Speech"
        },
        "1":"( ‾ ʖ̫ ‾)",
        "2":"Cool Text",
        "3":"._.",
        "4":"̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з=( ͠° ͟ʖ ͡°)=ε/̵͇̿̿/'̿̿ ̿ ̿ ̿ ̿ ̿ ",
        "5":"(ᴗ ͜ʖ ᴗ)",
        "6":"Today we fight the good fight, we make ends meet, and make filler content like this. Today we, the developers, will make the best speech ever to fill the 'speech' button on your screen."
    })
    console.log('reset')
}
if (store.has('names') == false) {
    resetAll()
}

//menu
menuContext = [
    {
        label: "Clippy",
        submenu: [
            {
                role: "copy"
            },
            {
                role: "paste"
            },
            {
                role: "close"
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(menuContext)

//window create function
function createWindow() {
    win = new BrowserWindow({height: 450, width: 700, titleBarStyle: 'hidden', resizable: false, show: false})
    win.loadFile('index.html')
    win.on('ready-to-show', () => {
        win.show()
    })
    app.dock.show()
    win.on('close',()=>{
        app.dock.hide()
    })
}

//app init
app.on('ready', ()=>{
    trayCreate()
    Menu.setApplicationMenu(menu)
    tray = new Tray(nativeImage.createFromPath(__dirname + '/build/icons/icon.png'))
    tray.setContextMenu(contextMenu)
    app.dock.hide()
})

//app not quit on window close
app.on('window-all-closed', ()=>{
    win = null;
    app.hide()
})

//tray function
const trayCreate = () =>{
    //init tray
    contextMenu = null;
    contextMenu = new Menu.buildFromTemplate([
        {label: 'Change Clips', click(){createWindow()}},
        {label: 'Quit', role: 'quit'}
    ])
    //create items in tray
    for (i = 0; i < 6; i++) {
        let m = 0;
        let l = i+1
        let item = new MenuItem({label: store.get('names.'+l), click(){cAdd(l)}})
        contextMenu.insert(i, item)
    }
    //create separator after items
    let sep = new MenuItem({type: "separator"})
    contextMenu.insert(6, sep)
}

//clipboard add
function cAdd(itemNumber) {
    let text = store.store[itemNumber]
    clipboard.writeText(text)
}
ipcMain.on('updateTray',()=>{
    console.log('updated')
    trayCreate()
    tray.setContextMenu(contextMenu)
})