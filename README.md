# Express + MongoDB CRUD (Ekle / Sil / Güncelle)

Node.js, Express ve MongoDB (resmi `mongodb` sürücüsü) ile yazılmış basit bir görev listesi uygulaması.

## Gereksinimler
- Node.js (LTS) → https://nodejs.org
- MongoDB (yerel kurulum veya ücretsiz MongoDB Atlas hesabı)

## Kurulum
```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm start
```
Tarayıcıda aç: http://localhost:3000

`.env` içindeki `MONGO_URI` değerini kendi MongoDB adresinle değiştir.
Atlas kullanıyorsan Atlas'ın verdiği bağlantı adresini yaz.

## API
| Metot | Adres | Açıklama |
|-------|-------|----------|
| GET | /api/gorevler | Tüm görevleri listeler |
| POST | /api/gorevler | Yeni görev ekler `{ "baslik": "...", "aciklama": "..." }` |
| PUT | /api/gorevler/:id | Görevi günceller (baslik, aciklama, tamamlandi) |
| DELETE | /api/gorevler/:id | Görevi siler |

## GitHub'a yükleme
```bash
git init
git add .
git commit -m "Express MongoDB CRUD uygulaması"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/express-mongo-crud.git
git push -u origin main
```
(Önce github.com üzerinden boş bir "express-mongo-crud" deposu oluştur. `.env` dosyası `.gitignore` ile dışarıda kalır.)
