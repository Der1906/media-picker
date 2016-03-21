/*
MODULE DEPENDENCIES
*/

import MediaBrowser from './mediaBrowser';
import domready from 'domready';

domready(() => {
  document.getElementById('capturar').addEventListener('click', () => {
    MediaBrowser.capture()
      .then( (imageDataUrl) => {
        document.getElementById('photo').src = imageDataUrl;
      }).catch((e) => {
        document.getElementById('photo').src = '';
        alert('Error tomando foto: ' + JSON.stringify(e));
      });
  });
  document.getElementById('galeria').addEventListener('click', () => {
    MediaBrowser.gallery()
      .then((imageDataUrl) => {
        document.getElementById('photo').src = imageDataUrl;
      }).catch((e) => {
        document.getElementById('photo').src = '';
        alert('Error usando foto local: ' + e);
      });
  });
});
