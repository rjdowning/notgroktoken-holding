/* Hidden delights for curious humans. Purely decorative: no tracking, no network calls. */
(function () {
  // 1. Console hello for people who open DevTools.
  try {
    var bot = [
      '      .-----------.',
      '      |  [=] [=]  |   beep.',
      '      |    ___    |   oh, hi.',
      '      |   \\___/   |',
      '      \'-----------\'',
      '        /|  ok |\\',
      '       / |_____| \\',
      '         ||   ||',
      '        [__] [__]'
    ].join('\n');
    console.log('%c' + bot, 'color:#d4a017;font-family:monospace;font-size:12px;line-height:1.2');
    console.log('%cYou found the robot\'s back door. Curious humans are the best humans.\nTry the old cheat code on this page: \u2191 \u2191 \u2193 \u2193 \u2190 \u2192 \u2190 \u2192 B A', 'color:#f4efe6;font-family:monospace;font-size:12px');
  } catch (e) {}

  // 2. Bobble-wiggle: Konami code on keyboards, or tap the robot 7 times fast on phones.
  var css = document.createElement('style');
  css.textContent =
    '@keyframes ngtBobble{0%{transform:rotate(0)}10%{transform:rotate(-9deg)}22%{transform:rotate(8deg)}34%{transform:rotate(-7deg)}46%{transform:rotate(6deg)}58%{transform:rotate(-4deg)}70%{transform:rotate(3deg)}82%{transform:rotate(-1.5deg)}100%{transform:rotate(0)}}' +
    '.ngt-bobble{animation:ngtBobble 1.6s cubic-bezier(.36,.07,.19,.97) 2;transform-origin:50% 92%}' +
    '.ngt-confetti{position:fixed;top:-12px;width:8px;height:12px;border-radius:2px;pointer-events:none;z-index:9999;will-change:transform,opacity}' +
    '.ngt-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);max-width:calc(100vw - 32px);background:#161618;color:#f4efe6;border:1px solid #d4a017;border-radius:999px;padding:.6rem 1rem;font:500 14px/1.3 "IBM Plex Mono",monospace;z-index:10000;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.4);opacity:0;transition:opacity .3s}' +
    '.ngt-toast.on{opacity:1}' +
    '@media (prefers-reduced-motion: reduce){.ngt-bobble{animation:none}}';
  document.head.appendChild(css);

  var lines = [
    'Bobble mode unlocked. The robot approves.',
    'Head wobble at maximum. Shades stayed on.',
    'You found a secret. The robot is impressed.'
  ];
  var busy = false;

  function robots() {
    return document.querySelectorAll('img.hero, .shot.art img, img.ngt-robot');
  }

  function toast(text) {
    var t = document.createElement('div');
    t.className = 'ngt-toast';
    t.setAttribute('role', 'status');
    t.textContent = text;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('on'); });
    setTimeout(function () { t.classList.remove('on'); setTimeout(function () { t.remove(); }, 400); }, 3200);
  }

  function confetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var colors = ['#d4a017', '#f4efe6', '#e8b93a', '#9a9488'];
    for (var i = 0; i < 40; i++) {
      (function (i) {
        var c = document.createElement('div');
        c.className = 'ngt-confetti';
        c.style.left = (Math.random() * 100) + 'vw';
        c.style.background = colors[i % colors.length];
        document.body.appendChild(c);
        var drift = (Math.random() - 0.5) * 160;
        var spin = (Math.random() * 720 - 360);
        var dur = 1800 + Math.random() * 1400;
        if (c.animate) {
          c.animate([
            { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
            { transform: 'translate(' + drift + 'px,' + (window.innerHeight + 40) + 'px) rotate(' + spin + 'deg)', opacity: 0.9 }
          ], { duration: dur, delay: Math.random() * 300, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' });
        }
        setTimeout(function () { c.remove(); }, dur + 500);
      })(i);
    }
  }

  function bobble() {
    if (busy) return;
    busy = true;
    var list = robots();
    for (var i = 0; i < list.length; i++) {
      list[i].classList.remove('ngt-bobble');
      void list[i].offsetWidth;
      list[i].classList.add('ngt-bobble');
    }
    confetti();
    toast(lines[Math.floor(Math.random() * lines.length)]);
    setTimeout(function () {
      for (var j = 0; j < list.length; j++) list[j].classList.remove('ngt-bobble');
      busy = false;
    }, 3400);
  }
  window.ngtBobble = bobble;

  var code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var pos = 0;
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    var k = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === code[pos]) {
      pos++;
      if (pos === code.length) { pos = 0; bobble(); }
    } else {
      pos = (k === code[0]) ? 1 : 0;
    }
  });

  var taps = [];
  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el || !el.matches || !el.matches('img.hero, .shot.art img, img.ngt-robot')) return;
    var now = Date.now();
    taps.push(now);
    taps = taps.filter(function (t) { return now - t < 2500; });
    if (taps.length >= 7) { taps = []; bobble(); }
  });
})();
