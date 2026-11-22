/*
 * Pricing page — Paddle checkout.
 * Loaded synchronously in <head>, right after paddle.js and BEFORE the analytics
 * scripts, so the customer's email is removed from the URL before analytics read it.
 * Plain JS on purpose (no bundling): load order matters here.
 */
Paddle.Initialize({
  token: 'live_ddcdb19600d20ee3bdd88bdef84',
});

var PRICES = {
  essential: 'pri_01jjevdqjqnxdyt62xxh64ztfm',
  'pro-annual': 'pri_01kjfswp1vfxyb9z44rdygmj7e',
  'pro-monthly': 'pri_01kjfstvqbm4ey3r9syx5e53s9',
};

// The add-on passes the user's email in the URL fragment (#email=...) so it is
// never sent to the server or recorded by analytics. Read it, then strip it from
// the address bar. The ?email= query form is still accepted for links from older
// add-on versions and is stripped the same way.
var customerEmail = (function () {
  var hashParams = new URLSearchParams(window.location.hash.slice(1));
  var queryParams = new URLSearchParams(window.location.search);
  var email = hashParams.get('email') || queryParams.get('email');

  if (hashParams.has('email') || queryParams.has('email')) {
    hashParams.delete('email');
    queryParams.delete('email');
    var query = queryParams.toString();
    var hash = hashParams.toString();
    history.replaceState(
      null,
      '',
      window.location.pathname + (query ? '?' + query : '') + (hash ? '#' + hash : '')
    );
  }

  return email ? email.toLowerCase().trim() : email;
})();

function openCheckout(priceId) {
  var settings = { items: [{ priceId: priceId, quantity: 1 }] };
  if (customerEmail) settings.customer = { email: customerEmail };
  Paddle.Checkout.open(settings);
}

document.addEventListener('DOMContentLoaded', function () {
  // Deep link from the add-on: /pricing.html?plan=essential|pro-annual|pro-monthly
  var plan = new URLSearchParams(window.location.search).get('plan');
  if (plan) {
    document.querySelectorAll('.paddle_button').forEach(function (btn) {
      btn.classList.remove('paddle_button');
    });
    if (PRICES[plan]) openCheckout(PRICES[plan]);
  }

  // Pro plan: annual / monthly switch
  var price = document.getElementById('pro-price');
  var button = document.getElementById('pro-checkout-button');
  document.querySelectorAll('input[name="pro-billing"]').forEach(function (input) {
    input.addEventListener('change', function () {
      var annual = input.value === 'annual' && input.checked;
      price.innerHTML = annual
        ? '<span class="price-amount">$59.88</span> <span class="price-period">($4.99/mo)</span>'
        : '<span class="price-amount">$10.99</span> <span class="price-period">/mo</span>';
      button.setAttribute(
        'data-items',
        JSON.stringify([{ priceId: PRICES[annual ? 'pro-annual' : 'pro-monthly'], quantity: 1 }])
      );
    });
  });
});
