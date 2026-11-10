/* Sillage Book — fonctionnement hors connexion.
   Changer VERSION à chaque mise à jour de l'app. */
var VERSION='sb-3.2.1';
var FILES=['./','index.html','chart.umd.min.js','fonts.css','manifest.webmanifest',
  'icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','icons/favicon-32.png','icons/favicon-64.png',
  'fonts/manrope-latin-400-normal.woff2','fonts/manrope-latin-500-normal.woff2','fonts/manrope-latin-600-normal.woff2',
  'fonts/manrope-latin-700-normal.woff2','fonts/manrope-latin-800-normal.woff2',
  'fonts/jetbrains-mono-latin-400-normal.woff2','fonts/jetbrains-mono-latin-500-normal.woff2','fonts/jetbrains-mono-latin-600-normal.woff2'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  /* La page : réseau d'abord (pour recevoir les mises à jour), cache si hors connexion */
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(VERSION).then(function(c){c.put('index.html',cp);});return res;}).catch(function(){return caches.match('index.html');}));return;}
  /* Le reste : cache d'abord */
  e.respondWith(caches.match(r).then(function(hit){return hit||fetch(r).then(function(res){if(res.ok){var cp=res.clone();caches.open(VERSION).then(function(c){c.put(r,cp);});}return res;});}));
});
