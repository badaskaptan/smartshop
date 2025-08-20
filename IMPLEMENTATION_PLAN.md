# SmartShop - Uygulamaya Dönüşüm & Yol Haritası

Kısa görev alımı: Bu döküman, mevcut `price-comparison-app.html` prototipini gerçek, üretime hazır bir SmartShop uygulamasına dönüştürmek için adım adım iş planı, MVP tanımı, teknik rota, zaman çizelgesi, kalite kapıları ve ilk 90 günlük yol haritasını içerir.

## Hızlı Plan (tek cümle)
MVP'yi 8-12 haftada çalışır hâle getirmek için basit bir API + veritabanı, platform-specific scraper adaptörleri, AI destekli ürün eşleştirme ve React PWA frontend hedefliyoruz; sonrasında mobil (Expo) ve tam ölçekli altyapı adımları gelecek.

---

## Başlangıç Checklist (kısa)
- [x] Mevcut prototipi incele ( `price-comparison-app.html` )
- [x] Proje vizyonu ve mimari dokümanı açık ( `smartshop-readme.md` )
- [ ] Versiyon kontrolü: Git repo ve branch stratejisi kur
- [ ] Temel monorepo iskeleti (apps/api, apps/web, apps/mobile, packages/shared)
- [ ] Basit REST API iskeleti (TypeScript + Express/Fastify)
- [ ] PostgreSQL + Redis + (opsiyonel Elastic) kurulumu/Docker Compose
- [ ] Scraper adaptörleri (Trendyol, Amazon, Hepsiburada) — test kapsaması
- [ ] AI product-matching entegrasyonu (OpenAI/diğer) — prototip
- [ ] React PWA frontend (Vite) — prototip HTML'i komponentleştir
- [ ] CI/CD (GitHub Actions) — build, lint, test, deploy (staging)
- [ ] Testler: birim + entegrasyon + e2e (örn. Playwright)

## MVP Kapsamı (minimum yapılması gerekenler)
Hedef: kullanıcılar arama yapıp farklı platformlardaki fiyatları karşılaştırabilmeli, temel eşleştirme ve fiyat önerisi görebilmeli.

Özellikler:
- Kullanıcı arayüzü (PWA) - arama, sonuç listesi, platform fiyatları, favori işaretleme
- Basit backend API (TypeScript)
  - /api/search?q={query} — konsolide sonuç döndürür
  - /api/listings/:id — liste detayları ve fiyat geçmişi
- Scraper adaptörleri (mock ile başlayıp canlı adaptörlere geçiş)
  - Her platform için tek sorumluluklu modül
  - Proxy & rate-limit yapılandırması
- Ürün eşleştirme (basit kural tabanlı + LLM destekli eşleştirme)
- Veritabanı: PostgreSQL (ürünler, listings, price_history, users, favorites)
- Cache: Redis (sorgu önbellekleme, job queue)
- Basit price-history kayıt mekanizması (günlük veya tetiklemeli)

Kabul kriterleri (MVP):
- Arama istekleri 5 saniyede cevap veriyor (önbellek ile) veya uygun UX gösteriyor
- 3 platformdan en az 1'inde canlı veri çekebiliyor (veya güvenilir mock)
- Yapılandırılabilir çevresel değişkenlerle çalışıyor (.env)
- Unit testler (%60+ kritik kod kapsaması)

## Teknik Rota ve Önerilen Stack
- Repo: monorepo (pnpm/workspaces veya Nx)
- Backend: Node.js 18+, TypeScript, Fastify veya Express, Zod/Joi validation
- Frontend: React + Vite, TypeScript, Tailwind veya Styled Components, PWA manifest + service worker
- Mobile: Expo (React Native) — sonraki adım
- DB: PostgreSQL; Cache & Queue: Redis; Full-text: Elasticsearch (opsiyonel ileri arama)
- AI: OpenAI/Replit/vertail LLM for matching; Local heuristics first
- Scraping: Scrape service using Playwright / Puppeteer + proxy servis (Scrapfly / Bright Data) or resmi API where possible
- Infra: Docker Compose for local dev; AWS (ECS/EKS), RDS, ElastiCache for prod
- CI/CD: GitHub Actions — test, lint, build, containerize, deploy to staging

## Aşamalar & Zaman Çizelgesi (öngörülen)
Not: 2 hafta = sprint

1) Hazırlık & Repo Kurulumu — 1 hafta
   - Git repo oluşturma, branch stratejisi, monorepo scaffold
   - Docker Compose (Postgres + Redis)
   - Kod stil + lint + precommit (ESLint, Prettier, Husky)

2) Backend Temeli & DB Şeması — 2 hafta
   - TypeScript API scaffold, temel modeller (users, products, listings)
   - Basit /api/search mock endpoint
   - Migration aracı (Prisma veya TypeORM) ve seed verisi
   - Unit test altyapısı

3) Scraper + Data Ingest — 2-3 hafta
   - 3 platform için scraper adaptörleri (aynı arayüzü implement eden modüller)
   - Proxy & retry, job queue (BullMQ)
   - İlk canlı çekimler ve temel parsing

4) Ürün Eşleştirme & AI — 1-2 hafta
   - Heuristics (title normalization, brand/model extraction)
   - LLM prototipi ile karşılaştırma (prompt + küçük opsiyonel fine-tune)

5) Frontend PWA — 2-3 hafta (paralel backend ile)
   - React + Vite uygulaması; mevcut HTML bileşenleri dönüştürülecek
   - Arama sayfası, sonuç listesi, detay sayfası
   - Basit offline cache (service worker)

6) Test, CI/CD, Staging Deploy — 1-2 hafta
   - Playwright e2e testleri
   - GitHub Actions: lint, test, build, docker image push, staging deploy

Toplam (MVP): 8-12 hafta (küçük ekip: 2 dev + 1 backend/devops)

## Kalite Kapıları (Quality Gates)
- Build: Her PR için başarılı build
- Lint/Typecheck: ESLint + TypeScript hatasız olmalı
- Unit tests: Kritik path için %60+ coverage (mümkünse %80 hedef)
- Integration/e2e: Temel senaryoların e2e testleri (arama, listeleme, detay)
- Security: Secrets yönetimi (Vault/Secrets Manager), dependency scanning

## Riskler & Hafifletmeler
- Scraping yasa/ToS riski: mümkün olduğunda resmi API kullan, rate limit ve robots.txt uyumu
- IP block: proxy + rotating pool planı
- LLM maliyeti: ilk etapta küçük prompt/heuristic blend ile başla
- Veri uyuşmazlığı: eşleştirmede insan doğrulama ve confidence threshold

## Operasyonel & Prod Hazırlıkları
- Monitoring: Grafana + Prometheus; Uptime checks
- Logging: structured logs (Winston/Pino) -> centralized (ELK / CloudWatch)
- Backups: RDS snapshots / pg_dump schedule
- Secrets: env vars + secret manager

## İş Gücü Tahmini (örnek)
- Product Owner / PM: 0.2 FTE
- Backend mühendisleri: 1.0–1.5 FTE
- Frontend mühendisleri: 0.8–1.0 FTE
- DevOps/Infra: 0.3–0.5 FTE
- QA: 0.5 FTE (başlangıçta daha küçük)

## İlk 30/60/90 Gün Yol Haritası (Özet)
- Gün 0–7: Repo, CI, Docker Compose, temel API scaffold
- Gün 8–30: DB modeller, temel API, React PWA scaffold, ilk scraper adaptörü (mock → canlı)
- Gün 31–60: Scraper stabilizasyonu, AI eşleştirme prototipi, frontend refinements, testler
- Gün 61–90: CI/CD tamamlama, staging deploy, performans tuning, basit mobile/Expo scaffold

## Kabul/Kapanış Kriterleri (MVP release)
- Ana akışlar (search → results → detail) başarılı şekilde çalışıyor
- En az 1 canlı platformdan gerçek veriler alınıyor
- CI pipeline başarıyla deploy edebiliyor (staging)
- Temel güvenlik kontrolleri ve DB yedekleme hazır

## Önerilen Kısa Vadeli Teknik İşleri (ilk 5 görev — hemen yapılacak)
1. GitHub repo oluştur ve bu workspace'i push et (main + develop branch)
2. Monorepo scaffold (pnpm workspace veya Nx) ekle
3. `apps/api` içinde TypeScript + Fastify scaffold oluştur
4. Docker Compose dosyası ekle: Postgres + Redis + adminer
5. Basit `/api/search?q=` endpoint'i mock dönecek şekilde PR aç

## Varsayımlar
- Ürün veri kaynaklarının API erişimi yoksa scraping kullanılacak
- İlk aşamada küçük veri hacmi ve düşük SLA hedefleniyor
- Geliştirme ortamında Docker kullanılacak

---

## Requirements coverage (kullanıcı isteğine göre)
- "gerçek uygulamaya dönüştürmek için yapılacak işleri planla" — Done (Bu dosya: IMPLEMENTATION_PLAN.md)
- "bir iş planı içeren .md dosyası oluştur" — Done (dosya oluşturuldu)
- "rotamızı belirle" — Done (sprintler, zaman çizelgesi, ilk 90 gün ve öncelikler verildi)

---

Sonraki adım için öneri: GitHub repo oluşturup buradaki çalışma dizinini push edin; ben ardından `apps/api` scaffold'u otomatik oluşturup ilk PR için gerekli dosyaları ekleyebilirim. Hangi adımı hemen yapmamı istersiniz?
