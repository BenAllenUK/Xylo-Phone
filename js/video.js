var contextSource;

// Put event listeners into place
    window.addEventListener("DOMContentLoaded", function() {
      // Grab elements, create settings, etc.

        var timeOut;
        var canvasSource = $("#canvas-source")[0];
        var canvasBlended = $("#canvas-blended")[0];
        contextSource = canvasSource.getContext('2d');
        var contextBlended = canvasBlended.getContext('2d');
        var soundContext, bufferLoader;
        var notes = [];

        contextSource.translate(canvasSource.width, 0);
        contextSource.scale(-1, 1);

        update();
        video = document.getElementById("video"),
        videoObj = { "video": true },
        errBack = function(error) {
          console.log("Video capture error: ", error.code); 
        };

      // Put video listeners into place
      if(navigator.getUserMedia) { // Standard
        navigator.getUserMedia(videoObj, function(stream) {
          video.src = stream;
          video.play();
        }, errBack);
      } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
        navigator.webkitGetUserMedia(videoObj, function(stream){
          video.src = window.webkitURL.createObjectURL(stream);
          video.play();
        }, errBack);
      } else if(navigator.mozGetUserMedia) { // WebKit-prefixed
        navigator.mozGetUserMedia(videoObj, function(stream){
          video.src = window.URL.createObjectURL(stream);
          video.play();
        }, errBack);
      }

      function update() {
        drawVideo();
        blend();
        checkAreas();
        timeOut = setTimeout(update, 1000/60);
      }

      function drawVideo() {
        contextSource.drawImage(video, 0, 0, video.width, video.height);
      }

      function fastAbs(value) {
        // equivalent to Math.abs();
        return (value ^ (value >> 31)) - (value >> 31);
      }

      function difference(target, data1, data2) {
        // blend mode difference
        if (data1.length != data2.length) return null;
        var i = 0;
        while (i < (data1.length * 0.25)) {
          target[4*i] = data1[4*i] == 0 ? 0 : fastAbs(data1[4*i] - data2[4*i]);
          target[4*i+1] = data1[4*i+1] == 0 ? 0 : fastAbs(data1[4*i+1] - data2[4*i+1]);
          target[4*i+2] = data1[4*i+2] == 0 ? 0 : fastAbs(data1[4*i+2] - data2[4*i+2]);
          target[4*i+3] = 0xFF;
          ++i;
        }
      }

      function threshold(value) {
        return (value > 0x15) ? 0xFF : 0;
      }

      function differenceAccuracy(target, data1, data2) {
        if (data1.length != data2.length) return null;
        var i = 0;
        while (i < (data1.length * 0.25)) {
          var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
          var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
          var diff = threshold(fastAbs(average1 - average2));
          target[4*i] = diff;
          target[4*i+1] = diff;
          target[4*i+2] = diff;
          target[4*i+3] = 0xFF;
          ++i;
        }
      }

      function blend() {
        var width = canvasSource.width;
        var height = canvasSource.height;
        // get webcam image data
        var sourceData = contextSource.getImageData(0, 0, width, height);
        // create an image if the previous image doesn’t exist
        if (!baseImage) {
          // baseImage = sourceData;
          // baseImage = contextSource.getImageData(0, 0, width, height);
        } else {
          // create a ImageData instance to receive the blended result
          var blendedData = contextSource.createImageData(width, height);
          // blend the 2 images
          differenceAccuracy(blendedData.data, sourceData.data, baseImage.data);
          // draw the result in a canvas
          contextBlended.putImageData(blendedData, 0, 0);
          // store the current webcam image
        }
      }

    function checkAreas() {
      // loop over the note areas
      for (var r=0; r<8; ++r) {
        // get the pixels in a note area from the blended image
        var blendedData = contextBlended.getImageData(
          0,
          0,
          480,
          640);
        var i = 0;
        var count = 0;
        // loop over the pixels
        for (var i=0; i < (blendedData.data.length / 4); i++) {
          // make an average between the color channel
          if(((blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3) > 200) {
            count++;
          }

        }
        if(count > blendedData.data.length / 40) {
          onHover();
        } else {
          onHoverStop();
        }
      }
    }

    }, false);