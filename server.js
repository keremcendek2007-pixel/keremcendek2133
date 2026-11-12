require('dotenv').config();
const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'odev_db';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let gorevler; // MongoDB koleksiyonu

// Hata yakalamayı tek yerde toplayan yardımcı fonksiyon
const sarmala = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({ hata: 'Sunucu hatası' });
  });

// URL'deki id geçerli bir ObjectId mi?
const idKontrol = (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ hata: 'Geçersiz id' });
  }
  next();
};

// LİSTELE (Read) - GET /api/gorevler
app.get('/api/gorevler', sarmala(async (req, res) => {
  const liste = await gorevler.find().sort({ olusturma: -1 }).toArray();
  res.json(liste);
}));

// EKLE (Create) - POST /api/gorevler
app.post('/api/gorevler', sarmala(async (req, res) => {
  const { baslik, aciklama } = req.body;
  if (!baslik || !baslik.trim()) {
    return res.status(400).json({ hata: 'Başlık zorunludur' });
  }
  const yeni = {
    baslik: baslik.trim(),
    aciklama: (aciklama || '').trim(),
    tamamlandi: false,
    olusturma: new Date(),
  };
  const sonuc = await gorevler.insertOne(yeni);
  res.status(201).json({ ...yeni, _id: sonuc.insertedId });
}));

// GÜNCELLE (Update) - PUT /api/gorevler/:id
app.put('/api/gorevler/:id', idKontrol, sarmala(async (req, res) => {
  const { baslik, aciklama, tamamlandi } = req.body;
  const guncel = {};
  if (baslik !== undefined) guncel.baslik = String(baslik).trim();
  if (aciklama !== undefined) guncel.aciklama = String(aciklama).trim();
  if (tamamlandi !== undefined) guncel.tamamlandi = Boolean(tamamlandi);

  if (Object.keys(guncel).length === 0 || guncel.baslik === '') {
    return res.status(400).json({ hata: 'Güncellenecek geçerli alan yok' });
  }
  const sonuc = await gorevler.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: guncel }
  );
  if (sonuc.matchedCount === 0) {
    return res.status(404).json({ hata: 'Kayıt bulunamadı' });
  }
  res.json({ mesaj: 'Güncellendi' });
}));

// SİL (Delete) - DELETE /api/gorevler/:id
app.delete('/api/gorevler/:id', idKontrol, sarmala(async (req, res) => {
  const sonuc = await gorevler.deleteOne({ _id: new ObjectId(req.params.id) });
  if (sonuc.deletedCount === 0) {
    return res.status(404).json({ hata: 'Kayıt bulunamadı' });
  }
  res.json({ mesaj: 'Silindi' });
}));

// Önce MongoDB'ye bağlan, sonra sunucuyu başlat
async function baslat() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  gorevler = client.db(DB_NAME).collection('gorevler');
  console.log('MongoDB bağlantısı kuruldu');
  app.listen(PORT, () => console.log(`Sunucu çalışıyor: http://localhost:${PORT}`));
}

baslat().catch((err) => {
  console.error('MongoDB bağlantı hatası:', err.message);
  process.exit(1);
});
