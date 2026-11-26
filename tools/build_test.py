#!/usr/bin/env python3
"""Sakugame — construit la version test du site dans test/ (https://soufeokr.github.io/Sakugame/test/).

Copie du site principal (mêmes fichiers, même compte, même base) + Arena :
  • tools/test-site/arena/       → test/arena/        (jeu Arena, ouvert dans une iframe)
  • tools/test-site/arena-bridge.js et arena-site.css → test/ (écran Arena, menu, pont avec le site)
Le dossier test/ est entièrement régénéré : ne pas le modifier à la main.

Usage : python3 tools/build_test.py
"""
import hashlib
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEST = os.path.join(ROOT, 'test')
SRC = os.path.join(ROOT, 'tools', 'test-site')
SKIP_TOP = {'tools', '.github', 'test', 'sitemap.xml', 'robots.txt', '404.html', 'CNAME'}


def tracked_files():
    out = subprocess.run(['git', 'ls-files'], cwd=ROOT, capture_output=True, text=True, check=True).stdout.split('\n')
    files = []
    for f in out:
        if not f:
            continue
        top = f.split('/')[0]
        if top in SKIP_TOP or f.endswith('.md') or re.match(r'google[0-9a-f]+\.html$', f):
            continue
        files.append(f)
    return files


def digest(paths):
    h = hashlib.sha1()
    for p in sorted(paths):
        with open(p, 'rb') as fh:
            h.update(p.encode() + fh.read())
    return h.hexdigest()[:8]


def replace_once(text, old, new, label):
    if text.count(old) != 1:
        sys.exit('build_test: motif introuvable ou multiple (%s)' % label)
    return text.replace(old, new, 1)


def main():
    if os.path.isdir(TEST):
        shutil.rmtree(TEST)
    os.makedirs(TEST)
    for f in tracked_files():
        dst = os.path.join(TEST, f)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(os.path.join(ROOT, f), dst)

    # Arena
    arena_src = os.path.join(SRC, 'arena')
    arena_files = [os.path.join(arena_src, n) for n in os.listdir(arena_src)]
    av = digest(arena_files + [os.path.join(SRC, 'arena-bridge.js'), os.path.join(SRC, 'arena-site.css')])
    shutil.copytree(arena_src, os.path.join(TEST, 'arena'))
    ai = os.path.join(TEST, 'arena', 'index.html')
    with open(ai, encoding='utf-8') as fh:
        html = fh.read()
    html = re.sub(r'\?v=[0-9A-Za-z.]+', '?v=' + av, html)
    with open(ai, 'w', encoding='utf-8') as fh:
        fh.write(html)
    with open(os.path.join(SRC, 'arena-bridge.js'), encoding='utf-8') as fh:
        bridge = fh.read().replace('__ARENA_V__', av)
    with open(os.path.join(TEST, 'arena-bridge.js'), 'w', encoding='utf-8') as fh:
        fh.write(bridge)
    shutil.copy2(os.path.join(SRC, 'arena-site.css'), os.path.join(TEST, 'arena-site.css'))

    # index.html de la version test
    p = os.path.join(TEST, 'index.html')
    with open(p, encoding='utf-8') as fh:
        s = fh.read()
    s = replace_once(s, '<meta charset="UTF-8">', '<meta charset="UTF-8">\n<meta name="robots" content="noindex,nofollow">', 'charset')
    s = re.sub(r'<title>(.*?)</title>', lambda m: '<title>[TEST] ' + m.group(1) + '</title>', s, count=1)
    s = re.sub(r'<link rel="canonical"[^>]*>\n?', '', s, count=1)
    s = s.replace('content="https://soufeokr.github.io/Sakugame/"', 'content="https://soufeokr.github.io/Sakugame/test/"')
    s = replace_once(s, '<symbol id="i-cards"',
                     '<symbol id="i-swords" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
                     '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M19 21l2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4M7 17l-3 3M3 19l2 2"/></g></symbol>'
                     '<symbol id="i-cards"', 'sprite')
    arrow = '<svg class="side-nav-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="m8 6 4 4-4 4"/></svg>'
    nav_coll = re.search(r'(\s*)<button type="button" onclick="sakuNavGo\(\'collection\'\)">', s)
    if not nav_coll:
        sys.exit('build_test: bouton Collection introuvable')
    s = s[:nav_coll.start()] + nav_coll.group(1) + '<button type="button" onclick="sakuNavGo(\'arena\')"><svg class="ic"><use href="#i-swords"/></svg><span data-noi18n>Arena</span>' + arrow + '</button>' + s[nav_coll.start():]
    s = replace_once(s, '<div class="card-home-shortcuts">',
                     '<div class="card-home-shortcuts"><button type="button" onclick="sakuNavGo(\'arena\')"><svg class="ic"><use href="#i-swords"/></svg><strong data-noi18n>Arena</strong><small data-noi18n>Duel, Amical, Deck</small>'
                     '<span aria-hidden="true"><svg class="saku-arrow-icon saku-arrow-small" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m0 0-6-6m6 6-6 6"/></svg></span></button>', 'shortcuts')
    s = replace_once(s, '<div class="screen" id="cardHomeScreen"></div>',
                     '<div class="screen" id="cardHomeScreen"></div>\n\n  <div class="screen" id="arenaScreen"><iframe id="arenaFrame" class="arena-frame" title="Arena" allow="clipboard-write"></iframe></div>', 'screen')
    notif = re.search(r'<script defer src="notifications\.js\?v=\d+"></script>', s)
    if not notif:
        sys.exit('build_test: script notifications.js introuvable')
    s = s[:notif.end()] + '\n  <script defer src="arena-bridge.js?v=' + av + '"></script>' + s[notif.end():]
    s = replace_once(s, '</head>', '<link rel="stylesheet" href="arena-site.css?v=' + av + '">\n</head>', 'head')
    with open(p, 'w', encoding='utf-8') as fh:
        fh.write(s)
    with open(os.path.join(TEST, 'robots.txt'), 'w') as fh:
        fh.write('User-agent: *\nDisallow: /\n')
    print('version test construite : %d fichiers, Arena %s' % (len(tracked_files()), av))


if __name__ == '__main__':
    main()
