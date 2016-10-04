/*
 * created by Krystian Mezyk
 * github.com/mezykr | 2016
 */

(function () {
  'use strict';

  var button, node, last;
  var ANIMATION_DURATION = 500;
  var SUPPORTED_CSS_CLASSES = ['button', 'press-animation'];

  if (isTouchDevice()) {
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchend', processEnd);
  } else {
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', processEnd);
  }

  function isTouchDevice() {
    try {
      document.createEvent("TouchEvent");
      return true;
    } catch (e) {
      return false;
    }
  }

  function onTouchStart(ev) {
    processStart(ev.touches[0].target, {
      x: ev.touches[0].clientX,
      y: ev.touches[0].clientY
    }, ev.timeStamp);
  }

  function onMouseDown(ev) {
    processStart(ev.target, {
      x: ev.clientX,
      y: ev.clientY
    }, ev.timeStamp);
  }

  function processStart(target, position, timestamp) {
    var buttonBounding, size;

    button = getButton(target);
    if (!button || button.disabled) {
      return;
    }
    button.style.position = 'relative';
    button.style.overflow = button.className.match('round') && button.parentNode.className.match('nav-icons')
      ? 'visible' : 'hidden';

    removeNode();

    buttonBounding = button.getBoundingClientRect();
    size = buttonBounding.width / 5;

    node = document.createElement('div');
    node.style.left = position.x - buttonBounding.left + 'px';
    node.style.top = position.y - buttonBounding.top + 'px';
    node.setAttribute('id', 'button-pressed');

    button.appendChild(node);

    setTimeout(function () {
      node.style.transform = 'scale(' + size + ')';
      last = timestamp;
    }, 0);
  }

  function processEnd(ev) {
    if (!node) {
      return;
    }

    if (last && ev.timeStamp - last >= ANIMATION_DURATION) {
      removeNode({easy: true});
    } else {
      setTimeout(removeNode, ANIMATION_DURATION - (ev.timeStamp - last), {easy: true});
    }
  }

  function getButton(target) {
    if (!target || target.nodeName === 'ARTICLE') {
      return;
    }
    return targetHasSupportedClass(target) || target.nodeName === 'BUTTON' ? target : getButton(target.parentNode);
  }

  function targetHasSupportedClass(target) {
    return SUPPORTED_CSS_CLASSES.some(function(className) {
      return target.className.match(className) !== null;
    });
  }

  function removeNode(options) {
    var target = document.getElementById('button-pressed');
    if (!target) {
      return;
    }

    if (options && options.easy) {
      node.style.opacity = '0';
      setTimeout(removeNode, ANIMATION_DURATION / 2);
    } else {
      target.parentNode.removeChild(target);
    }
  }

})();
