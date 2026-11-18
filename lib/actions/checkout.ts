import type { CheckoutRedirect } from '../../types/courses';

/** Sends the browser to the payment provider. */
export function followCheckout(checkout: CheckoutRedirect): void {
  if (checkout.kind === 'redirect') {
    window.location.assign(checkout.url);
    return;
  }
  // eSewa: a signed form POSTed to its checkout page.
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = checkout.url;
  form.hidden = true;
  for (const [name, value] of Object.entries(checkout.fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
