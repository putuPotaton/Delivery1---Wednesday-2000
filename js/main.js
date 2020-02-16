'use strict';
var gPrevX = -1;
var gPrevY = -1;

function onInit() {
    rendIMGs();
    rendSearchWords();
    gCanvas = document.getElementById('my-canvas');
    var elContainer = document.querySelector('.canvas-container');
    // gCanvas.width = elContainer.width;
    // gCanvas.height = elContainer.height;
    // gCanvas.height = gCanvas.width;
    gCtx = gCanvas.getContext('2d');
    renderMemeIMG();
    newLine();
}

function renderMemeIMG() {
    var memeImgID = getselectedImgId();
    var img = new Image();
    img.src = `./meme-imgs/${memeImgID}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawText();
    }
}

function reRenderMemeIMG(input) {
    updateCurrLineTXT(input.value);
    renderMemeIMG();
}



function drawText() {
    var lines = getMemeLines();
    lines.forEach(line => {
        gCtx.lineWidth = '2';
        gCtx.strokeStyle = line.color;
        gCtx.fillStyle = line.color;
        gCtx.font = `${line.size}px  ${line.fontFamily}`;
        gCtx.textAlign = line.align;
        // gCtx.strokeText(line.txt, line.lineX, line.lineY);
        gCtx.fillText(line.txt, line.lineX, line.lineY);
    });
}

function onGalleryImageClicked(clickedID) {
    setGmemeByImageID(clickedID);
    newLine();
    toggleSections();
    renderMemeIMG(clickedID);
    document.querySelector('.text-to-draw').value = '';
    document.querySelector('.section-shifter').innerText = 'Gallery'

}

function toggleSections(elButton = null) {
    if (document.querySelector('.meme-editor').style.display === 'flex') {
        document.querySelector('.gallery').style.display = 'block';
        document.querySelector('.meme-editor').style.display = 'none';
        if (elButton) elButton.innerText = 'Meme Maker'
    } else {
        document.querySelector('.gallery').style.display = 'none';
        document.querySelector('.meme-editor').style.display = 'flex';
        if (elButton) elButton.innerText = 'gallery'

    }

}

function rendIMGs(searchword = null) {
    var IMGs = getImgsToShow(searchword);
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
    if (lineUnderMouseY(gPrevY)>=0) {
        SetSelectedLine(lineUnderMouseY(gPrevY))
    }
}

function mouseup(ev) {
    ev.preventDefault()

    gIsMouseDown = false;
}

function mousemove(ev) {
    if (!gIsMouseDown) return;
    event.preventDefault()
    if (lineUnderMouseY(ev.offsetY)>=0)
    dragLine(ev.offsetX, ev.offsetY)
    // draw(gPrevX, gPrevY, ev.offsetX, ev.offsetY);

}

function lineUnderMouseY(mouseY) {
    var lines = getMemeLines();
    var thisLine=lines.find(line => {
        return (line.lineY > mouseY && line.lineY < mouseY + line.size)
    });
    console.log(lines.indexOf(thisLine))
    return lines.indexOf(thisLine)
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
    gCtx.stroke()
        // gCtx.rotate(angleRadians);
        // gCtx.restore();
    updatePrevs(xEnd, yEnd);

}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function setColor(FillColor) {
    gCtx.fillStyle = FillColor;
}


function addLine() {
    if (getLinesAmount() == 3) { return; }
    document.querySelector('.text-to-draw').value = '';
    newLine();
}

function switchLine() {
    var currLineIDX = getSelectedLineIDX();
    if (currLineIDX === getMemeLines().length - 1) {
        gMeme.selectedLineIdx = 0;
        SetSelectedLine(0);
    } else {
        setToNextLine();
    }
    document.querySelector('.text-to-draw').value = getCurrLineTXT();
}

function switchAlign(direction) {
    setCurrLineAlign(direction);
    switch (direction) {
        case 'start':
            setLineX(gCanvas.width * 0.1);
            break;
        case 'center':
            setLineX(gCanvas.width * 0.5);
            break;
        case 'end':
            setLineX(gCanvas.width * 0.9);

            break;
    }
    renderMemeIMG();

}

function dragLine(currX, currY){
    var diffX=currX-gPrevX;
    var diffY=currY-gPrevY;
    changeCurrLineX(diffX);
    changeCurrLineY(diffY);
    updatePrevs(currX,currY);
    renderMemeIMG();

}

function moveLine(direction) {
    event.preventDefault();

    switch (direction) {
        case 'up':
            changeLineY(-5)
            renderMemeIMG();
            break;
        case 'down':
            changeLineY(5)
            renderMemeIMG();
            break;
        case 'left':
            changeLineX(-5)
            renderMemeIMG();
            break;
        case 'right':
            changeLineX(5)
            renderMemeIMG();
            break;
    }
}

// function stopLineMove() {
//     gIsMouseDown = false;
// }


function fontSizeChange(diff) {
    ChangeLineFontSize(diff);
    renderMemeIMG();
}


function onSearchWordChanged(input) {
    if (input.value == "Show All ")
        rendIMGs();
    else
        rendIMGs(input.value);
}

function deleteCurrLine() {

    var elTxtInput = document.querySelector('.text-to-draw');
    removeCurrLine();
    var currIDX = getSelectedLineIDX();
    if (currIDX > 0) {
        SetSelectedLine(currIDX--);
        elTxtInput.value = getCurrLineTXT();
        renderMemeIMG();
    } else if (getMemeLines().length > 0) {
        elTxtInput.value = getCurrLineTXT();
        renderMemeIMG();
    } else {
        newLine();
        SetSelectedLine(0);
        elTxtInput.value = '';
        renderMemeIMG();
    }

}

function onFontChange(fontFamily) {
    setCurrLineFont(fontFamily);
}

function rendSearchWords() {
    var strHTML = '';
    var SearchWords = getSearchWords();
    SearchWords.forEach(searchWord => {
        var size = searchWord.clicks / 10 + 0.7;
        strHTML += `<span onclick="onSearchWordClicked(this.innerText)" style="font-size: ${size}rem">${searchWord.word}</span>`
        document.querySelector('.search-words-dsiplay ').innerHTML = strHTML;
    })
}

function onSearchWordClicked(clickedSearchWord) {
    rendIMGs(clickedSearchWord);
    var word = gSearchWords.find(searchword => {
        return searchword.word === clickedSearchWord;
    })
    word.clicks++;
    rendSearchWords();
}