const canvas = new fabric.Canvas('mainCanvas', {
    width: 800,
    height: 500,
    backgroundColor: '#ffffff'
});

// Save states for Undo/Redo
let history = [];

function saveState() {
    history.push(JSON.stringify(canvas));
}

function addText() {
    const text = new fabric.IText('ADAVA ARTS', {
        left: 100, top: 100, fontFamily: 'Arial', fill: '#000000'
    });
    canvas.add(text);
    saveState();
}

function addRect() {
    const rect = new fabric.Rect({
        left: 150, top: 150, fill: '#ffcc00', width: 100, height: 100
    });
    canvas.add(rect);
    saveState();
}

function addCircle() {
    const circle = new fabric.Circle({
        left: 200, top: 200, fill: '#007bff', radius: 50
    });
    canvas.add(circle);
    saveState();
}

function changeBg(color) {
    canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
    saveState();
}

function changeObjColor(color) {
    const active = canvas.getActiveObject();
    if (active) {
        active.set('fill', color);
        canvas.renderAll();
        saveState();
    }
}

function changeFont(font) {
    const active = canvas.getActiveObject();
    if (active && active.type === 'i-text') {
        active.set('fontFamily', font);
        canvas.renderAll();
        saveState();
    }
}

function deleteObject() {
    const active = canvas.getActiveObjects();
    canvas.remove(...active);
    canvas.discardActiveObject().renderAll();
    saveState();
}

document.getElementById('img-input').onchange = function(e) {
    const reader = new FileReader();
    reader.onload = function(f) {
        fabric.Image.fromURL(f.target.result, function(img) {
            img.scaleToWidth(200);
            canvas.add(img);
            saveState();
        });
    };
    reader.readAsDataURL(e.target.files[0]);
};

function undo() {
    if (history.length > 0) {
        const state = history.pop();
        canvas.loadFromJSON(state, canvas.renderAll.bind(canvas));
    }
}

function exportImage() {
    const dataURL = canvas.toDataURL({ format: 'png', multiplier: 4 });
    const link = document.createElement('a');
    link.download = 'ADAVA_Design.png';
    link.href = dataURL;
    link.click();
}
  
