'use strict';
var gPrevX = -1;
var gPrevY = -1;

function onInit() {
    rendIMGs();
    gCanvas = document.getElementById('my-canvas');
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth - 8;
    gCanvas.height = elContainer.offsetHeight;
    gCanvas.height = gCanvas.width;
    gCtx = gCanvas.getContext('2d');
    renderMemeIMG();

}

// imgID = 5
function renderMemeIMG() {
    var memeImgID = getselectedImgId();
    var img = new Image();
    img.src = `./meme-imgs/${memeImgID}.JPG`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawText();
    }
}

function reRenderMemeIMG(input) {
    gMeme.lines[0].txt = input.value;
    console.log(gMeme.lines[0].txt);
    renderMemeIMG();
}

function drawText() {
    gCtx.lineWidth = '2';
    gCtx.strokeStyle = gMeme.lines[0].color;
    gCtx.fillStyle = gMeme.lines[0].color;
    gCtx.font = `${gMeme.lines[0].size}px Impact`;
    gCtx.textAlign = gMeme.lines[0].align;
    gCtx.strokeText(gMeme.lines[0].txt, 150, 150);
    gCtx.fillText(gMeme.lines[0].txt, 150, 150);

}

function viewText(text) {
    console.log('draw text');

    gCtx.strokeStyle = 'red'
    gCtx.fillStyle = 'white'
    gCtx.save()
        // drawText('after save', 100, 160)
    drawText(text, 150, 150)
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = 'red';
    drawText('after save and change', 20, 260);
    gCtx.restore();
    drawText('after restore', 100, 360);
    console.log('i drew ' + text);
}

function onGalleryImageClicked(clickedID) {
    gMeme = {
        selectedImgId: clickedID,
        selectedLineIdx: 0,
        lines: [{
            txt: '',
            size: 20,
            align: 'left',
            color: 'red'
        }]
    }
    renderMemeIMG(clickedID)


}

function rendIMGs() {
    var IMGs = getImgsToShow();
    var strHTML = '';
    IMGs.forEach(IMG => {
        strHTML += `<img src="${IMG.src}" class="meme-gallery-IMG" title="${IMG.id}" id="${IMG.id}" onclick="onGalleryImageClicked(this.id)" alt="meme image not found">`;
    })
    document.querySelector('.imgs-container').innerHTML = strHTML;
}

function mousedown(ev) {

    event.preventDefault()
    gIsMouseDown = true;

    gPrevX = ev.offsetX;
    gPrevY = ev.offsetY;

}

function mouseup(ev) {
    ev.preventDefault()

    gIsMouseDown = false;
}

function mousemove(ev) {
    if (!gIsMouseDown) return;
    event.preventDefault()
    draw(gPrevX, gPrevY, ev.offsetX, ev.offsetY);

}

function draw(prevX, prevY, offsetX, offsetY) {

    switch (gCurrShape) {
        case 'triangle':
            drawTriangle(prevX, prevY, offsetX, offsetY)
            break;
        case 'rect':
            drawRect(offsetX, offsetY)
            break;
        case 'text':
            drawText('Puki', offsetX, offsetY)
            break;
        case 'line':
            drawLine(prevX, prevY, offsetX, offsetY)
            break;
        case 'fan':
            drawFan(offsetX, offsetY, prevX, prevY)
            break;
        case 'soundCloud':
            drawSoundCloud(offsetX, offsetY, prevX, prevY)
            break;
        case 'circle':
            drawArc(prevX, prevY, offsetX, offsetY);
            break;
        case 'fan':
            drawArc(prevX, prevY, offsetX, offsetY);
            break;
        case 'DNA':
            drawArc(prevX, prevY, offsetX, offsetY);
            break;
        case 'none':
            console.log(offsetX, offsetY);
            break;
    }
}

function drawFan(x, y, xEnd = 250, yEnd = 250) {
    gCtx.beginPath()
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.closePath()
    gCtx.strokeStyle = 'red'
    gCtx.stroke()

}

function drawSoundCloud(x, y, xEnd = 250, yEnd = 250) {
    gCtx.beginPath()
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.closePath()
    gCtx.strokeStyle = 'red'
    gCtx.stroke()
    updatePrevs(x, y)

}

function drawLine(prevX, prevY, xEnd, yEnd) {
    gCtx.beginPath()
    gCtx.moveTo(prevX, prevY)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.closePath()
    gCtx.strokeStyle = 'red'
    gCtx.stroke()
    updatePrevs(xEnd, yEnd)

}




function drawRect(offsetX, offsetY) {
    gCtx.beginPath()
    gCtx.rect(offsetX, offsetY, 150, 150)
    gCtx.strokeStyl1e = 'black'
    gCtx.stroke()
    gCtx.fillStyle = 'orange'
    gCtx.fillRect(offsetX, offsetY, 150, 150)
    updatePrevs(offsetX, offsetY)

}

function drawArc(prevX, prevY, xEnd, yEnd) {
    gCtx.beginPath()
    gCtx.lineWidth = '0.3'
    gCtx.arc(xEnd, yEnd,
        (Math.abs(xEnd - prevX) + Math.abs(yEnd - prevY)), 0, 2 * Math.PI);
    gCtx.stroke();
    // gCtx.strokeStyle = 'black';
    updatePrevs(xEnd, yEnd);
}

function drawTriangle(prevX, prevY, xEnd, yEnd) {
    var diffXs = Math.abs(xEnd - prevX)
    var diffYs = Math.abs(yEnd - prevY)
    if (diffXs <= diffYs + 2 && diffXs > diffYs) {
        var pointAX = prevX + 0.5 * diffXs;
        var pointAY = prevY + 4 * diffYs;
        var pointBX = prevX - 0.5 * diffXs;
        var pointBY = prevY - 4 * diffYs;
    } else if (diffXs + 2 >= diffYs && diffXs < diffYs) {
        var pointAX = prevX + 4 * diffXs;
        var pointAY = prevY + 0.5 * diffYs;
        var pointBX = prevX - 4 * diffXs;
        var pointBY = prevY - 0.5 * diffYs;
    } else
        var pointAX = prevX + 2.5 * diffXs;
    var pointAY = prevY + 1.5 * diffYs;
    var pointBX = prevX - 2.5 * diffXs;
    var pointBY = prevY - 1.5 * diffYs;


    gCtx.beginPath()
    gCtx.moveTo(pointBX, pointBY)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.lineTo(pointAX, pointAY)
    gCtx.closePath() //insted of lineTo(x,y) 
    var angleRadians = 1 / (1 + Math.abs(+Math.atan2(yEnd - prevY, xEnd - prevX)));
    gCtx.lineWidth = '0.3'
    gCtx.strokeStyle = 'blue';
    // gCtx.rotate(angleRadians);
    gCtx.stroke()
        // gCtx.restore();
    updatePrevs(xEnd, yEnd);

}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function setColor(color) {

    gCtx.fillStyle = color;
    gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height);

}

function addLine() {
    if (getLinesAmount() == 3) { return; }
    newLine();
}