const Jimp = require('jimp');

function rgbToAnsi256(r, g, b) {
    if (r === g && g === b) {
        if (r < 8) {
            return 16;
        }
        if (r > 248) {
            return 231;
        }
        return Math.round(((r - 8) / 247) * 24) + 232;
    }
    var ansi = 16
        + (36 * Math.round(r / 255 * 5))
        + (6 * Math.round(g / 255 * 5))
        + Math.round(b / 255 * 5);
    return ansi;
}


/**
 * 
 * @param {String|Buffer|Jimp} image 
 * @param {Number} [width]
 * @param {*} [height] 
 * @returns {String} The image as a string of ANSI escape codes
 */
async function Image(image, width, height) {
    width = width || process.stdout.columns;
    height = height || process.stdout.rows;
    var resize = width !== process.stdout.columns;
    return new Promise((resolve, reject) => {
        var pixels = [];
        var result = "";
        Jimp.read(image, (err, image) => {
            if (err) throw err;
            image = image.resize(width, height)
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                var red = this.bitmap.data[idx + 0];
                var green = this.bitmap.data[idx + 1];
                var blue = this.bitmap.data[idx + 2];
                pixels.push(rgbToAnsi256(red, green, blue))
            });
            pixels.forEach((item, i) => {
                result = result + "\033[48;5;" + item + "m \033[0;00m"
                if (resize && i > 0 && i % width === 0) {
                    result = result + '\n'
                }
            });
            return resolve(result)
        })
    })
}

module.exports = Image;
