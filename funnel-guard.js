/**
 * Which funnel steps a draft may open, by draft status.
 *
 * Prod decides this on mount, before any step renders. TenderRequestDraftForm
 * sends CONFIRM_PUBLISHED (or ADD_MISSING_IMAGES for `?step=add-images`), and
 * tenderFormMachine's root handlers route a published, in-review or queued
 * draft straight to its waiting/success screen. The draft save endpoint also
 * refuses those three statuses with a 422, so there is no way back into the
 * steps once an ad is submitted.
 *
 * A REJECTED draft has exactly two ways back in, and they differ:
 *
 *   store.rejection = 'other'           "Päivitä tarjouspyyntöä" — EDIT_DRAFT,
 *                                        enters at the equipment step
 *                                        (details.html). Re-submitting sends it
 *                                        back to review (ReviewRejections).
 *   store.rejection = 'missing-images'  the add-photos link, prod's own
 *                                        `?step=add-images`. Enters at the
 *                                        photos step, and Jatka there skips
 *                                        price and contact. Re-submitting
 *                                        publishes without review
 *                                        (DoNotReviewAdQualityRejections).
 *
 * `store.rejection` is the draft's status while it is rejected, not a UI flag:
 * it is cleared by whichever step re-submits the draft.
 *
 * Entry params:
 *   ?step=add-images  prod's param, verbatim
 *   ?edit=rejected    proto-only. Prod fires EDIT_DRAFT in-page; the proto
 *                     crosses a page boundary, so the event travels as a param.
 *
 * The guard is skipped when the URL carries `?scenario=` (a tester forcing a
 * state), `?plate=` (the front page starting a new draft) or `?mode=mobile`
 * (the photo-upload frame opened from a QR code).
 *
 * Load in <head>, after proto-mock.js, so seeding has happened and the redirect
 * fires before the step paints.
 */
(function () {
  var KEY = 'autovex_funnel';

  function getStore() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function setStore(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }

  /* Same rule success.html applies: prod's publish step refuses an ad below the
     minimum, which leaves the draft `open` and the funnel editable. */
  function photosComplete(s) {
    var ph = s.photos || {};
    var total = Object.keys(ph).reduce(function (n, k) { return n + (ph[k] ? ph[k].length : 0); }, 0);
    return total >= 5 && !!(ph.ulkopuoli && ph.ulkopuoli.length) && !!(ph.sisatilat && ph.sisatilat.length);
  }

  function isSubmitted(s) {
    return !s.rejection && !!s.successVisited && photosComplete(s);
  }

  /* Re-submitting a rejected draft either publishes it, which ends the
     rejection, or is refused for too few photos, which leaves it rejected and
     parks the funnel on the publish step's "Lisää vielä kuvat autostasi"
     screen. prod persists that screen with the form state, so a reload shows it
     again; `publishRefused` stands in for that. */
  function recordPublishAttempt(s) {
    if (photosComplete(s)) {
      delete s.rejection;
      delete s.publishRefused;
    } else {
      s.publishRefused = true;
    }
    return s;
  }

  window.FunnelGuard = {
    rejection: function (s) { return (s || getStore()).rejection || null; },
    photosComplete: photosComplete,
    isSubmitted: isSubmitted,
    recordPublishAttempt: recordPublishAttempt
  };

  var params = new URLSearchParams(window.location.search);
  var entry = params.get('step') === 'add-images' ? 'missing-images'
            : params.get('edit') === 'rejected'   ? 'other'
            : null;

  var store = getStore();
  if (entry) {
    store.rejection = entry;
    delete store.publishRefused;
    setStore(store);
    params.delete('step');
    params.delete('edit');
    var qs = params.toString();
    history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
  }

  var bypass = params.has('scenario') || params.has('plate') || params.get('mode') === 'mobile';
  if (!bypass && isSubmitted(store)) {
    window.location.replace('success.html');
  }
})();
