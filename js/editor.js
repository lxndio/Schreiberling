var btnNewFile, btnOpenFile, btnSaveFile;
var editor;

var newFile = true;
var saved = false;
var fileName = "New Document.md"

var gui = require("nw.gui");
var fs = require("fs");
var clipboard = gui.Clipboard.get();

var languageOverrides = {
    js: 'javascript',
    html: 'xml'
}

document.title = "Schreiberling - " + fileName;

marked.setOptions({
    highlight: function(code, lang){
        if(languageOverrides[lang]) lang = languageOverrides[lang];
        return hljs.LANGUAGES[lang] ? hljs.highlight(lang, code).value : code;
    }
});

function handleNewButton() {
    if (saved) {
        fileEntry = null;
        saved = true;
        newFile = true;
        editor.setValue("");
    } else {
        handleSaveButton();
        fileEntry = null;
        saved = true;
        newFile = true;
        editor.setValue("");
    }
}

function handleOpenButton() {
    if (saved) {
        $("#dialog-openFile").trigger("click");
        saved = true;
        newFile = false;
    } else {
        handleSaveButton();
        $("#dialog-openFile").trigger("click");
        saved = true;
        newFile = false;
    }
}

function handleSaveButton() {
    if (newFile) {
        $("#dialog-saveFile").trigger("click");
    } else {
        onChosenFileToSave(fileEntry);
    }
}

function handleExportButton() {
    if (newFile) {
        // Nothing to export
    } else {
        onChosenFileToExport(fileEntry);
    }
}

function handleSettingsButton() {
    // TODO Dieses Fenster kleiner machen. (Größe, wie Einstellungsfenster von Firefox)
    window.open("settings.html");
}

function handleAboutButton() {
    // TODO Dieses Fenster kleiner machen. (Größe, wie Infofenster von Pantheon Files unter Elementary OS)
    window.open("about.html");
}

function handleInScroll() {
    //
}

function handleOutScroll() {
    //
}

var onChosenFileToOpen = function(theFileEntry) {
    fileEntry = theFileEntry;
    hasWriteAccess = false;
    
    fs.readFile(theFileEntry, function(err, data) {
        if (err) {
            console.log("Read failed: " + err);
        }
        
        // Set title
        /* var title = theFileEntry + " - Markdown Editor";
        document.getElementById("title").innerHTML = title;
        document.title = title; */
        
        editor.setValue(String(data));
        
        newFile = false;
        saved = true;
    });
}

var onChosenFileToSave = function(theFileEntry) {
    fileEntry = theFileEntry;
    hasWriteAccess = true;
    
    var text = editor.getValue();
    fs.writeFile(theFileEntry, editor.getValue(), function(err) {
        if (err) {
            console.log("Write failed: " + err);
            return;
        }
        
        // Set title
        /* var title = theFileEntry + " - Markdown Editor";
        document.getElementById("title").innerHTML = title;
        document.title = title; */
        
        console.log("Write completed.");
        
        newFile = false;
        saved = true;
    });
}

var onChosenFileToExport = function(theFileEntry) {
    fileEntry = theFileEntry;
}

function initContextMenu() {
    menu = new gui.menu();
    
    menu.append(new gui.MenuItem({
        label: 'Copy',
        click: function() {
            // clipboard.set(editor.getSelection());
        }
    }));
    
    // TODO weitermachen
}

function handleInChange(e) {
    if (saved) {
        saved = false;
    }
    update(e);
}

function update(e){
    var val = e.getValue();
    setOutput(val);
}

function setOutput(val){
    document.getElementById('out').innerHTML = marked(val);
}

onload = function() {
    // Define buttons and button listeners
    btnNewFile    = document.getElementById("btn-newFile");
    btnOpenFile   = document.getElementById("btn-openFile");
    btnSaveFile   = document.getElementById("btn-saveFile");
    btnExportFile = document.getElementById("btn-exportFile");
    btnAbout      = document.getElementById("btn-about");
    btnSettings   = document.getElementById("btn-settings");
    
    btnNewFile.addEventListener("click", handleNewButton);
    btnOpenFile.addEventListener("click", handleOpenButton);
    btnSaveFile.addEventListener("click", handleSaveButton);
    btnExportFile.addEventListener("click", handleExportButton);
    btnAbout.addEventListener("click", handleAboutButton);
    btnSettings.addEventListener("click", handleSettingsButton);
    
    // Define file dialog listeners
    $("#dialog-openFile").change(function(evt) {
        onChosenFileToOpen($(this).val());
    });
    
    $("#dialog-saveFile").change(function(evt) {
        onChosenFileToSave($(this).val());
    });
    
    // Define editor
    editor = CodeMirror(document.getElementById("in"), {
        mode: "markdown",
        lineNumbers: false,
        matchBrackets: true,
        lineWrapping: true,
        theme: "default"
    });
    
    // Defines scroll listeners
    editor.on("scroll", handleInScroll);
    document.getElementById("out").addEventListener("scroll", handleOutScroll);
    
    // Define change listener
    editor.on("change", handleInChange);
    
    // Update at the beginning
    var val = editor.getValue();
    setOutput(val);
    
    // Set focus on editor
    editor.focus();
};