if (!window.cordova) {
  // Disable overscroll
  document.addEventListener("DOMContentLoaded", function(event) {
    document.body.addEventListener('touchmove',function(e){
       e.preventDefault();
     });
  });
}
