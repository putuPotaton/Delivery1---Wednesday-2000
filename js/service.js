'use strict'

var gNextID = 0;
var gImageSearchMapper = {
    1: ["funny", "crazy", "trump"],
    2: ["puppies", "cute", "love"],
    3: ["puppy", "dogs", "baby"],
    4: ["cats", "kittens", "virgin-meme", "cute"],
    7: ["baby", "wow", "excited"],
    9: ["evil", "baby", "scam"],
}
var gImages = _createGImages();
var gCurrShape = 'none';
var gIsMouseDown = false;

var gSearchWords = [{ word: 'funny', clicks: 3 },
    { word: 'puppies', clicks: 9 },
    { word: 'evil', clicks: 2 },
    { word: 'wow', clicks: 3 },
    { word: 'dogs', clicks: 2 },
];



var gCanvas;
var gCtx;

function getCurrShape() {
    return gCurrShape;
}


function setCurrShape(shape) {
    gCurrShape = shape;
}

function updateCurrLineTXT(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function getMemeLines() {
    return gMeme.lines;
}

function getSelectedLineIDX() {
    return gMeme.selectedLineIdx;
}

function setGmemeByImageID(ID) {
    gMeme = {
        selectedImgId: ID,
        selectedLineIdx: 0,
        lines: []

    };
}
function changeCurrLineY(diffY){
gMeme.lines[gMeme.selectedLineIdx].lineY+=diffY;
}
function changeCurrLineX(diffX){
    gMeme.lines[gMeme.selectedLineIdx].lineX+=diffX;

}

function SetSelectedLine(idx) {
    gMeme.selectedLineIdx = idx;
}

function setToNextLine() {
    gMeme.selectedLineIdx++;

}

function setCurrLineAlign(direction) {
    gMeme.lines[gMeme.selectedLineIdx].align = direction;
}

function getCurrLineTXT() {
    return gMeme.lines[gMeme.selectedLineIdx].txt;
}

function setLineX(xPos) {
    gMeme.lines[gMeme.selectedLineIdx].lineX = xPos;
}

function changeLineY(diff) {
    gMeme.lines[gMeme.selectedLineIdx].lineY += diff;

}

function changeLineX(diff) {
    gMeme.lines[gMeme.selectedLineIdx].lineX += diff;

}

function ChangeLineFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
}

function removeCurrLine() {
    gMeme.lines.splice([gMeme.selectedLineIdx], 1);

}

function setCurrLineFont(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = fontFamily;

}

function getSearchWords() {
    return gSearchWords;
}
function changeFill(color){
    gCtx.fillStyle=color;
}
function changeStroke(color){
    gCtx.strokeStyle=color;
}


function _createGImages() {
    var Images = [];
    for (var i = 1; i <= 18; i++) {
        var searchWords = [];
        if (gImageSearchMapper[i]) {
            searchWords = gImageSearchMapper[i].slice();
        }
        var src = `./meme-imgs/${i}.jpg`;
        Images.push({
            id: ++gNextID,
            src,
            searchWords
        })
    }
    return Images;

}

function getImgsToShow(searchWord = null) {
    if (!searchWord) { return gImages; }

    var imagesToShow = [];
    gImages.forEach(image => {
        // var countMatch = 0;
        // for (var i = 0; i < image.searchWords.length; i++) {
        //     if (image.searchWords[i] == searchWord)
        //         countMatch++;
        //     break;
        // }
        // if (countMatch > 0) {
        //     return image;
        // }
        var match = false;
        image.searchWords.forEach(word => {
            if (word.includes(searchWord)) {
                match = true;
            }
        })
        if (match) {
            imagesToShow.push(image)
        }





        // image.searchWords.includes(searchWord);
        // image.searchWords.forEach(word => {
        //     if (word.includes(searchWord)) { return true; };
    });
    return imagesToShow;
}


function updatePrevs(x, y) {
    gPrevY = y;
    gPrevX = x;
}

// function getLinesAmount() {
//     return gMeme.lines.length;
// }



function _getNextLineY(linesCount) {
    var canavasHeight = gCanvas.height;
    if (linesCount === 0) {
        return (0.2 * canavasHeight);
    } else if (linesCount === 2) {
        return (0.45 * gCanvas.height);
    } else if (gMeme.lines[0].lineY > gCanvas.height * 0.7) {
        return (0.35 * gCanvas.height);
    }
    return (0.85 * gCanvas.height);
}




function newLine() {
    var defaultLine = {
        lineX: 0,
        lineY: 0,
        txt: '',
        size: 25,
        fontFamily: 'Impact',
        align: 'left',
        color: 'black'
    };

    gMeme.selectedLineIdx = gMeme.lines.length;
    defaultLine.lineY = _getNextLineY(gMeme.lines.length);
    gMeme.lines.push(defaultLine);
}