const CACHE = 'transport-v1';
// GitHub Pages용 상대 경로('./') 적용 및 모바일 앱 필수 파일(아이콘, 매니페스트) 추가
const ASSETS = [
  './', 
  './index.html', 
  './transport_manifest.json',
  './icons/icon2.png',
  './icons/icon2.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
