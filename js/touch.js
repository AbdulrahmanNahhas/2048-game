let container = document.querySelector('body');
let listener = SwipeListener(container);
container.addEventListener('swipe', function (e) {
    if (e.detail.x[0] < e.detail.x[1] && (e.detail.y[0] + 150) >= e.detail.y[1] && (e.detail.y[0] - 150) <= e.detail.y[1]) {
        alert('right')
    } else if (e.detail.x[0] > e.detail.x[1] && (e.detail.y[0] + 150) >= e.detail.y[1] && (e.detail.y[0] - 150) <= e.detail.y[1]) {
        alert('left')
    } else {
        alert('hello, hi, bye!')
    }
});