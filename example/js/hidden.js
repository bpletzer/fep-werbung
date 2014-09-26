function isHidden(el) {
    return (el.offsetParent === null)
}
function isHiddenSlow(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}