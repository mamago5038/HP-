(function () {
  // 同一ページ内のアンカーリンク（href="#xxx"）: URLを変えずにスムーススクロール
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var hash = link.getAttribute('href');

    if (hash === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    var target = document.getElementById(hash.slice(1));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // 他ページから "/#xxx" で遷移してきた場合: 該当セクションへスクロールしつつURLのハッシュを消す
  if (location.hash.length > 1) {
    var initialTarget = document.getElementById(location.hash.slice(1));

    if (history.replaceState) {
      history.replaceState(null, '', location.pathname + location.search);
    }

    if (initialTarget) {
      window.addEventListener('load', function () {
        initialTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }
})();
