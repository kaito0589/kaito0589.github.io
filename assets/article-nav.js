const analyticsScript = document.createElement('script');
analyticsScript.src = '../../assets/analytics.js';
document.head.appendChild(analyticsScript);
(() => {
  const params = new URLSearchParams(location.search);
  const from = params.get('from');

  const footer = document.querySelector('.footer');
  const footerLink = footer ? footer.querySelector('a') : null;

  // 選書ページから開いた場合
  if (from === 'selected') {
    const section = params.get('section');

    if (footerLink) {
      footerLink.textContent = '← 選書に戻る';

      footerLink.href = section
        ? `../../selected.html#${section}`
        : '../../selected.html';

      footerLink.removeAttribute('onclick');
    }

    return;
  }

  // 作品一覧から開いた場合だけ前後ナビを表示
  if (from !== 'archive') return;
const sort = params.get('sort') || 'old';

const returnUrl = new URL(
  '../../index.html',
  location.href
);

returnUrl.searchParams.set('sort', sort);
returnUrl.searchParams.set('focus', location.pathname);
returnUrl.hash = 'archive';

// 上と下の「←季節の跡先」を現在の記事位置へ戻るリンクにする
document
  .querySelectorAll('.archive-nav a, .footer a')
  .forEach(link => {
    link.href = returnUrl.href;
    link.removeAttribute('onclick');
  });
  if (!footer) return;

  // 前後リンク用の見た目
  const style = document.createElement('style');
  style.textContent = `
    .article-pager {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      margin-top: 48px;
      padding: 18px 0 4px;
      border-top: 1px solid #e7e9ec;
    }

    .article-pager a {
      color: #6e7781;
      font-size: 13px;
      text-decoration: none;
      letter-spacing: .02em;
    }

    .article-pager a:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
    }

    .article-pager-placeholder {
      display: block;
      width: 1px;
    }

    .footer.with-article-pager {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 0;
    }

    @media (max-width: 640px) {
      .article-pager {
        margin-top: 36px;
        padding-top: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  const indexUrl = new URL('../../index.html', location.href);

  fetch(indexUrl)
    .then(response => response.text())
    .then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const links = [
        ...doc.querySelectorAll('#tbody .title a')
      ];
const sort = params.get('sort') || 'old';

if (sort === 'new') {
  links.reverse();
}

      const normalizePath = path => {
        try {
          return decodeURIComponent(path);
        } catch {
          return path;
        }
      };

      const works = links.map(link => {
        const url = new URL(link.getAttribute('href'), indexUrl);

        return {
          title: link.textContent.trim(),
          url
        };
      });

      const currentPath = normalizePath(location.pathname);

      const currentIndex = works.findIndex(work => {
        return normalizePath(work.url.pathname) === currentPath;
      });

      if (currentIndex === -1) return;

      const previous = works[currentIndex - 1] || null;
      const next = works[currentIndex + 1] || null;

      const pager = document.createElement('nav');
      pager.className = 'article-pager';
      pager.setAttribute('aria-label', '前後の作品');

      if (previous) {
        const previousLink = document.createElement('a');
        const previousUrl = new URL(previous.url);
previousUrl.searchParams.set('from', 'archive');
previousUrl.searchParams.set('sort', sort);

        previousLink.href = previousUrl.href;
        previousLink.textContent = '←前の作品';

        previousLink.addEventListener('click', event => {
          event.preventDefault();
          location.replace(previousLink.href);
        });

        pager.appendChild(previousLink);
      } else {
        const placeholder = document.createElement('span');
        placeholder.className = 'article-pager-placeholder';
        pager.appendChild(placeholder);
      }

      if (next) {
        const nextLink = document.createElement('a');
        const nextUrl = new URL(next.url);
nextUrl.searchParams.set('from', 'archive');
nextUrl.searchParams.set('sort', sort);

        nextLink.href = nextUrl.href;
        nextLink.textContent = '次の作品→';

        nextLink.addEventListener('click', event => {
          event.preventDefault();
          location.replace(nextLink.href);
        });

        pager.appendChild(nextLink);
      } else {
        const placeholder = document.createElement('span');
        placeholder.className = 'article-pager-placeholder';
        pager.appendChild(placeholder);
      }

      footer.parentNode.insertBefore(pager, footer);
      footer.classList.add('with-article-pager');
    })
    .catch(() => {
      // 読み込みに失敗した場合は何も表示しない
    });
})();