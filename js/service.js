'use strict'

var gNextiID = 0;
var gImages = _createGImages();
var gCurrShape = 'none';
var gIsMouseDown = false;

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{
        txt: 'I never eat Falafel',
        size: 25,
        align: 'left',
        color: 'red'
    }]
}

var gCanvas;
var gCtx;

function getselectedImgId() {
    return gMeme.selectedImgId;
}

function getCurrShape() {
    return gCurrShape;
}


function setCurrShape(shape) {
    gCurrShape = shape;
}

var imageSearvhMapper = {
    1: ["funy", "sad"],
    3: [""]
}

function _createGImages() {
    var Images = [];
    for (var i = 1; i <= 18; i++) {
        var image = new Image();
        image.src = `./meme-imgs/${i}.jpg`;
        Images.push({
            id: ++gNextiID,
            src: image.src,
            searchWords: []
        })
    }
    return Images;

}

function getImgsToShow() {
    return gImages;
}


function updatePrevs(x, y) {
    gPrevY = y;
    gPrevX = x;
}

function getLinesAmount() {
    return gMeme.lines.length;
}


function newLine() {
    gMeme.lines.push({
        txt: 'add text',
        size: 25,
        align: 'left',
        color: 'red'
    })
}