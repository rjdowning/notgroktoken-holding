/* NGT merged signup / pre-order interest form. Used on / and /preorder/.
 * Interim back end: FormSubmit (emails each signup to the shop owner).
 * Sheet back end: paste the Apps Script web app /exec URL below. Both then receive every signup.
 */
var APPS_SCRIPT_URL = ''; // <- paste the Google Apps Script web app URL (ends in /exec) between the quotes
var FORMSUBMIT_AJAX = 'https://formsubmit.co/ajax/16c3fd2f90386ce57010528db6d40163';

(function () {
  var forms = document.querySelectorAll('form.ngt-form');
  Array.prototype.forEach.call(forms, function (f) {
    var msg = f.querySelector('.ngt-msg');

    // Quantity boxes switch on only when their product is ticked.
    Array.prototype.forEach.call(f.querySelectorAll('input[name="products"]'), function (cb) {
      var qty = f.querySelector('input[name="qty_' + cb.value + '"]');
      var sync = function () { if (qty) { qty.disabled = !cb.checked; if (cb.checked && !qty.value) qty.value = 1; } };
      cb.addEventListener('change', sync); sync();
    });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = f.querySelector('button[type="submit"]');
      btn.disabled = true; msg.textContent = 'Saving…';

      var fd = new FormData(f);
      var picks = fd.getAll('products');
      fd.set('type', picks.length ? 'interest' : 'waitlist');
      fd.set('page', location.href);

      // FormSubmit copy: one readable "products" field plus one quantity per pick.
      var fs = new FormData();
      fd.forEach(function (v, k) { if (k !== 'products') fs.append(k, v); });
      fs.set('products', picks.length ? picks.join(', ') : 'none (waitlist only)');
      fs.set('_subject', picks.length ? 'NGT pre-order interest: ' + picks.join(', ') : 'NGT waitlist signup');

      if (APPS_SCRIPT_URL) {
        var asBody = new URLSearchParams();
        fd.forEach(function (v, k) { asBody.append(k === '_honey' ? 'website' : k, v); });
        fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: asBody }).catch(function () {});
      }

      fetch(FORMSUBMIT_AJAX, { method: 'POST', headers: { 'Accept': 'application/json' }, body: fs })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && (d.success === true || d.success === 'true')) {
            msg.textContent = picks.length
              ? 'You\u2019re on the list. The robot felt that. We\u2019ll email you when it\u2019s time to order. Shades on. \uD83D\uDE0E'
              : 'You\u2019re on the list. The robot felt that. Shades on. \uD83D\uDE0E';
            f.reset();
            Array.prototype.forEach.call(f.querySelectorAll('input[name^="qty_"]'), function (q) { q.disabled = true; });
          } else { throw new Error('fail'); }
        })
        .catch(function () { f.submit(); }) // Fallback: normal form post to FormSubmit.
        .finally(function () { btn.disabled = false; });
    });
  });
})();
