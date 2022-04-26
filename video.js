const Image = require('./image.js');
const child_process = require('child_process');

/**
 * 
 * @param {String} video 
 * @param {Number} [width] 
 * @param {Number} [height] 
 * @returns {Object} The video's fps, width, height, and frame data
 */
Video.preload = async function(video, width, height) {
    width = width || process.stdout.columns;
    height = height || process.stdout.rows;
    var ffmpegArgs = [
        '-i', video,
        '-s', 
        width + 'x' + height,
        '-vf',
        'fps=' + 25,
        '-f',         //<<
        'image2pipe', //<<
        '-vcodec',    //<<
        'png',        //<<
        'pipe:1'
    ]
    var [fps, frames] = await new Promise((resolve, reject) => {
        var fps = null;
        var current = '';
        var ffmpeg = child_process.spawn('ffmpeg', ffmpegArgs, {
            encoding: 'arraybuffer'
        });
        ffmpeg.stdout.on('data', (chunk) => {
            current += chunk.toString('hex');
        });
        ffmpeg.stdout.on('end', () => {
            return resolve([fps, current]);
        });
        ffmpeg.stderr.on('data', (data) => {
            data = data.toString('utf8');
            if (data.indexOf('fps') > -1 && fps === null) {
                fps = data.match(/(\d+) fps/)[1];
            }
        });
    });
    frames = await Promise.all(frames.split('89504e470d0a1a0a').filter(f => f.length > 0).map(f => Image(Buffer.from('89504e470d0a1a0a'+f, 'hex'))));
    return {fps, frames, width, height};
}

/**
 * 
 * @param {Object} video Video object returned from Video.preload
 */
Video.render = async function(video) {
    // if video does not contain fps, frames, width, and height, then throw error
    if (!video.fps || !video.frames || !video.width || !video.height) {
        throw new Error('Video is missing required properties');
    }
    var {fps, frames, width, height} = video;
    frames.unshift("\033["+Math.round(height/2)+";"+(Math.round(width/2)-5)+"HLoading...");
    for (var i in frames) {
        process.stdout.write('\033[0;0H' + frames[i]);
        await new Promise(r => setTimeout(r, 1000 / fps));
    }
}


/**
 * 
 * @param {String} video The path to the video
 * @param {Number} [ofps] The video's fps
 * @param {Number} [width] The video's width
 * @param {Number} [height] The video's height
 */
async function Video(video, ofps, width, height) {
    var {width, height, fps, frames} = await Video.preload(video, width, height);
    fps = ofps || fps;
    Video.render({fps, frames, width, height});
}


/**
 * 
 * @param {String} gif The path to the gif
 * @param {Number} [iterations=10] The number of times to loop the gif
 * @param {Number} [width] The gif's width
 * @param {Number} [height] The gif's height 
 */
async function Gif(gif, iterations = 10, width, height) {
    var {width, height, fps, frames} = await Video.preload(gif, width, height); 
    for (let iter = 0; iter < iterations; iter++) {
        for (var i in frames) {
            var frame = await frames[i];
            process.stdout.write('\033[0;0H' + frame);
            await new Promise(r => setTimeout(r, 1000 / fps));
        }
    }
}


module.exports = {Video, Gif};