export default class MediaBrowser {};

MediaBrowser.gallery = function(options) {
  return new Promise((resolve, reject) => {
    let tempFileInputObject = false;
    let fileInput = (options) ? options.fileInput : null;

    if (fileInput == null) {
      tempFileInputObject = true;
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';

      fileInput.onchange = function(e) {
        var f = e.target.files[0];
        var reader = new FileReader();
        reader.onload = (function(theFile) {
          return function(e) {
            resolve(e.target.result);
          };
        })(f);

        reader.readAsDataURL(f);
      };

      fileInput.click();
    }
  });
}
MediaBrowser.userMedia = function() {
  return navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia || null;
};
MediaBrowser.capture = function(options) {
  return new Promise((resolve, reject) => {
    if (this.userMedia()) {
      var tempVideoObject = false;
      var video = options ? options.video : null;

      if (video == null) {
        tempVideoObject = true;
        video = document.createElement('video');
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.zIndex = 10000000;
        video.style.position = 'absolute';
        video.style.top = 0;
        video.style.left = 0;
      }

      var media = navigator.getUserMedia({
        video: true,
        audio: false
      }, (stream) => {
        // URL Object is different in WebKit
        var url = window.URL || window.webkitURL;

        // create the url and set the source of the video element
        video.src = url ? url.createObjectURL(stream) : stream;

        document.body.appendChild(video);

        // Start the video
        video.play();

        video.onclick = (e) => {
          var canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);
          var data = canvas.toDataURL('image/jpeg');

          if (tempVideoObject == true) {
            video.pause();
            video.src = '';
            video.load();
            document.body.removeChild(video);
          }

          if (tempVideoObject || !options || !options.dontStopVideo || options.dontStopVideo == false)
            stream.getTracks()[0].stop();

          resolve(data);
        };
      }, (error) => {
        reject(error);
      });
    } else {
      reject('UserMedia not supported!');
    }
  });
};
