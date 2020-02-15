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

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: []

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

    var imagesToShow = gImages.map(image => {
        var countMatch = 0;
        for (var i = 0; i < image.searchWords.length; i++) {
            if (image.searchWords[i] == searchWord)
                countMatch++;
            break;
        }
        if (countMatch > 0) {
            return image;
        }
    })
    return imagesToShow;
}


function updatePrevs(x, y) {
    gPrevY = y;
    gPrevX = x;
}

function getLinesAmount() {
    return gMeme.lines.length;
}



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