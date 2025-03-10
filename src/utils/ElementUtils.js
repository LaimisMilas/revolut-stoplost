// Where el is the DOM element you'd like to test for visibility
function isHidden(el) {
    return (el.offsetParent === null)
}

function isHiddenByStyle(el) {
    const style = window.getComputedStyle(el);
    return (style.display === 'none')
}

function isVisibleById(elId){
    let element = document.getElementById(elId);
    return element.checkVisibility({
        opacityProperty: true,   // Check CSS opacity property too
        visibilityProperty: true // Check CSS visibility property too
    });
}
