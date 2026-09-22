$ErrorActionPreference = "Stop"
$root = Join-Path $PSScriptRoot "published"

if (-not (Test-Path $root)) {
    Write-Host "published フォルダが見つかりません。" -ForegroundColor Red
    Write-Host "このファイルを index.html と published フォルダがある場所に置いて実行してください。"
    Read-Host "Enterキーで終了"
    exit 1
}

$oldCss = @'
.footer { margin-top: 48px; padding-top: 18px; border-top: 1px solid #ddd; color: #777; font-size: .85rem; }

.archive-nav { margin-bottom: 34px; font-size: .88rem; letter-spacing: .04em; }
.archive-nav a { color: #666; text-decoration: none; }
.archive-nav a:hover { text-decoration: underline; text-underline-offset: 4px; }
.footer a { color: inherit; text-decoration: none; }
.footer a:hover { text-decoration: underline; text-underline-offset: 4px; }
'@

$newCss = @'
.footer { margin-top: 48px; }

.archive-nav { margin-bottom: 48px; }
.archive-nav a,
.footer a {
  display: inline-block;
  color: #6e7781;
  font-size: 13px;
  text-decoration: none;
  letter-spacing: .06em;
}
.archive-nav a:hover,
.footer a:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

@media (max-width: 640px) {
  .archive-nav { margin-bottom: 36px; }
}
'@

$oldTop = '<nav class="archive-nav"><a href="../../index.html#archive" onclick="if (document.referrer.includes(''kaito0589.github.io'')) { history.back(); return false; }">大月海人 Archive</a></nav>'
$newTop = '<nav class="archive-nav"><a href="../../index.html" onclick="if (document.referrer.includes(''kaito0589.github.io'')) { history.back(); return false; }">← 季節の跡先</a></nav>'

$oldBottom = '<div class="footer"><a href="../../index.html#archive" onclick="if (document.referrer.includes(''kaito0589.github.io'')) { history.back(); return false; }">← 大月海人 Archive</a></div>'
$newBottom = '<div class="footer"><a href="../../index.html" onclick="if (document.referrer.includes(''kaito0589.github.io'')) { history.back(); return false; }">← 季節の跡先</a></div>'

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$changed = 0
$files = Get-ChildItem -Path $root -Recurse -Filter *.html

foreach ($file in $files) {
    $html = [System.IO.File]::ReadAllText($file.FullName)
    $before = $html
    $html = $html.Replace($oldCss, $newCss)
    $html = $html.Replace($oldTop, $newTop)
    $html = $html.Replace($oldBottom, $newBottom)

    if ($html -ne $before) {
        [System.IO.File]::WriteAllText($file.FullName, $html, $utf8NoBom)
        $changed++
    }
}

Write-Host "完了：$changed 件の記事を更新しました。" -ForegroundColor Green
Write-Host "本文・画像・タイトルは変更していません。"
Read-Host "Enterキーで終了"
