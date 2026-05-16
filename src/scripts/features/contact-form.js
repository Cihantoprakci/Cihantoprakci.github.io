const SUCCESS_MSG = 'Merci, votre message est bien arrivé. Je vous réponds très vite.';
const ERROR_MSG = 'Une erreur est survenue. Réessayez ou écrivez-moi directement.';
const VALIDATION_MSG = 'Vérifiez les champs en rouge.';

export function initContactForm() {
  initClock();

  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const status = form.querySelector('[data-form-status]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validate(form)) {
      setStatus(status, VALIDATION_MSG, 'error');
      return;
    }

    setStatus(status, '', '');
    submitBtn?.classList.add('is-loading');
    submitBtn?.setAttribute('aria-disabled', 'true');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      submitBtn?.classList.remove('is-loading');
      submitBtn?.removeAttribute('aria-disabled');

      if (response.ok) {
        submitBtn?.classList.add('is-success');
        setStatus(status, SUCCESS_MSG, 'success');
        form.reset();

        setTimeout(() => {
          submitBtn?.classList.remove('is-success');
        }, 4000);
      } else {
        setStatus(status, ERROR_MSG, 'error');
      }
    } catch (err) {
      submitBtn?.classList.remove('is-loading');
      submitBtn?.removeAttribute('aria-disabled');
      setStatus(status, ERROR_MSG, 'error');
      console.error('Contact form error', err);
    }
  });

  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('input', () => {
      field.parentElement?.classList.remove('is-invalid');
    });
  });

  const messageEl = form.querySelector('#message');
  const countEl = form.querySelector('[data-message-count]');
  if (messageEl && countEl) {
    const max = parseInt(messageEl.getAttribute('maxlength') || '1000', 10);
    const updateCount = () => {
      const len = messageEl.value.length;
      countEl.textContent = `${len} / ${max}`;
      countEl.classList.toggle('is-near-limit', len > max * 0.85);
    };
    messageEl.addEventListener('input', updateCount);
    updateCount();
  }
}

function validate(form) {
  let valid = true;

  form.querySelectorAll('[required]').forEach((field) => {
    const value = field.value.trim();
    const isEmail = field.type === 'email';
    const ok = value && (!isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

    field.parentElement?.classList.toggle('is-invalid', !ok);
    field.setAttribute('aria-invalid', String(!ok));
    if (!ok) valid = false;
  });

  return valid;
}

function setStatus(el, message, state) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('is-success', 'is-error');
  if (state === 'success') el.classList.add('is-success');
  if (state === 'error') el.classList.add('is-error');
}

function initClock() {
  const timeEl = document.querySelector('[data-clock-time]');
  if (!timeEl) return;
  const update = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hh}:${mm}`;
  };
  update();

  const msToNextMinute = 60000 - (Date.now() % 60000);
  setTimeout(() => {
    update();
    setInterval(update, 60000);
  }, msToNextMinute);
}
