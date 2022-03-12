let myElement = window

let hammer = new Hammer(myElement);

hammer.on('swipeleft', function (ev) {
    alert('Left');
});
hammer.on('swiperight', function (ev) {
    alert('Right');
});
hammer.on('swipeup', function (ev) {
    alert('Up');
});
hammer.on('swipedown', function (ev) {
    alert('Down');
});