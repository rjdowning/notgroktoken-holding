/* KROG / KORG / GORK name survey. Same FormSubmit alias as the waitlist. */
var FORMSUBMIT_AJAX = 'https://formsubmit.co/ajax/16c3fd2f90386ce57010528db6d40163';

function ngtPost(fields) {
  var fs = new FormData();
  Object.keys(fields).forEach(function (k) {
    if (fields[k] != null && fields[k] !== '') fs.set(k, fields[k]);
  });
  fs.set('_template', 'table');
  fs.set('_captcha', 'false');
  return fetch(FORMSUBMIT_AJAX, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: fs
  }).then(function (r) { return r.json(); }).then(function (d) {
    if (d && (d.success === true || d.success === 'true')) return d;
    throw new Error((d && d.message) || 'fail');
  });
}

(function () {
  var form = document.getElementById('ngt-survey');
  var backdrop = document.getElementById('krog-modal');
  if (!form || !backdrop) return;

  var msg = form.querySelector('.survey-msg');
  var modalForm = document.getElementById('krog-modal-form');
  var modalMsg = modalForm.querySelector('.modal-msg');
  var formView = document.getElementById('krog-modal-form-view');
  var thanksView = document.getElementById('krog-modal-thanks');
  var closeBtn = document.getElementById('krog-modal-close');
  var chips = modalForm.querySelectorAll('.ngt-chip');
  var state = { email: '', picks: '', vibe: '' };

  function setMsg(el, text, isError) {
    el.textContent = text;
    if (isError) el.classList.add('is-error');
    else el.classList.remove('is-error');
  }

  function openModal() {
    formView.hidden = false;
    thanksView.hidden = true;
    modalForm.reset();
    state.vibe = '';
    Array.prototype.forEach.call(chips, function (c) { c.setAttribute('aria-pressed', 'false'); });
    setMsg(modalMsg, '', false);
    backdrop.hidden = false;
    var first = modalForm.querySelector('input[name="three_words"]');
    if (first) first.focus();
  }

  function closeModal() {
    backdrop.hidden = true;
  }

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      var on = chip.getAttribute('aria-pressed') === 'true';
      Array.prototype.forEach.call(chips, function (c) { c.setAttribute('aria-pressed', 'false'); });
      if (!on) {
        chip.setAttribute('aria-pressed', 'true');
        state.vibe = chip.getAttribute('data-vibe') || '';
      } else {
        state.vibe = '';
      }
    });
  });

  Array.prototype.forEach.call(form.querySelectorAll('input[name="picks"]'), function (cb) {
    cb.addEventListener('change', function () {
      var any = form.querySelectorAll('input[name="picks"]:checked').length;
      if (any) setMsg(msg, '', false);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var picks = Array.prototype.map.call(
      form.querySelectorAll('input[name="picks"]:checked'),
      function (cb) { return cb.value; }
    );
    if (!picks.length) {
      setMsg(msg, 'Pick at least one \u2014 or all of them.', true);
      return;
    }
    var email = (form.querySelector('input[name="email"]') || {}).value || '';
    var honey = (form.querySelector('input[name="_honey"]') || {}).value || '';
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    setMsg(msg, 'Sending\u2026', false);

    ngtPost({
      email: email,
      choices: picks.join(', '),
      _subject: 'KROG survey',
      _honey: honey,
      page: location.href
    }).then(function () {
      state.email = email;
      state.picks = picks.join(', ');
      setMsg(msg, 'Saved. One more question\u2026', false);
      form.reset();
      openModal();
    }).catch(function () {
      setMsg(msg, 'Couldn\u2019t send \u2014 try again in a moment.', true);
    }).finally(function () { btn.disabled = false; });
  });

  modalForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var three = (modalForm.querySelector('input[name="three_words"]').value || '').trim();
    var vibeText = (modalForm.querySelector('input[name="vibe_text"]').value || '').trim();
    var vibe = [state.vibe, vibeText].filter(Boolean).join(' / ');
    if (!three && !vibe) {
      setMsg(modalMsg, 'Three words is plenty \u2014 or close if you\u2019d rather skip.', true);
      return;
    }
    var btn = modalForm.querySelector('button.send');
    btn.disabled = true;
    setMsg(modalMsg, 'Sending\u2026', false);

    ngtPost({
      email: state.email,
      choices: state.picks,
      three_words: three || '(skipped)',
      vibe: vibe || '(skipped)',
      _subject: 'KROG survey \u2014 character',
      page: location.href
    }).then(function () {
      formView.hidden = true;
      thanksView.hidden = false;
      setTimeout(closeModal, 2200);
    }).catch(function () {
      setMsg(modalMsg, 'Couldn\u2019t send \u2014 try again in a moment.', true);
    }).finally(function () { btn.disabled = false; });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !backdrop.hidden) closeModal();
  });
})();
