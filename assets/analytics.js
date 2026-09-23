(() => {
  const OWNER_KEY = 'kisetsu_owner';
  const params = new URLSearchParams(location.search);

  // このブラウザを自分の端末として登録
  if (params.get('owner') === '1') {
    localStorage.setItem(OWNER_KEY, '1');

    const cleanUrl = new URL(location.href);
    cleanUrl.searchParams.delete('owner');

    history.replaceState(
      null,
      '',
      cleanUrl.pathname + cleanUrl.search + cleanUrl.hash
    );

    return;
  }

  // 自分登録を解除
  if (params.get('owner') === '0') {
    localStorage.removeItem(OWNER_KEY);

    const cleanUrl = new URL(location.href);
    cleanUrl.searchParams.delete('owner');

    history.replaceState(
      null,
      '',
      cleanUrl.pathname + cleanUrl.search + cleanUrl.hash
    );
  }

  // 自分のブラウザではAnalyticsを起動しない
  if (localStorage.getItem(OWNER_KEY) === '1') {
    return;
  }

  const measurementId = 'G-J5GPJ4188F';

  window.dataLayer = window.dataLayer || [];

  window.gtag = window.gtag || function() {
    dataLayer.push(arguments);
  };

  gtag('js', new Date());
  gtag('config', measurementId);

  const script = document.createElement('script');
  script.async = true;
  script.src =
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;

  document.head.appendChild(script);
})();