# 📊 IoT Power Monitoring System

> Sistem monitoring konsumsi daya listrik real-time berbasis IoT dengan klasifikasi beban menggunakan rule-based algorithm

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)
![React](https://img.shields.io/badge/React-19.1.1-cyan)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.16-blue)

## 📝 Deskripsi

Proyek ini adalah sistem monitoring konsumsi daya listrik yang mengintegrasikan sensor IoT dengan dashboard web interaktif. Sistem menggunakan algoritma rule-based untuk mengklasifikasikan beban listrik menjadi tiga kategori: **Beban Ringan**, **Beban Sedang**, dan **Beban Tinggi**.

Data sensor diambil dari **ThingSpeak API** atau file CSV lokal, kemudian diolah oleh backend FastAPI dan divisualisasikan melalui frontend React dengan grafik real-time.

## ✨ Fitur Utama

- 🔴 **Real-time Monitoring** - Update data setiap 10 detik
- 📈 **Visualisasi Data** - Grafik trend daya, distribusi beban, dan statistik
- 🤖 **Klasifikasi Otomatis** - Rule-based classification untuk kategori beban
- 💰 **Estimasi Biaya** - Kalkulasi biaya listrik berdasarkan konsumsi
- ⚠️ **Alert System** - Notifikasi untuk kondisi abnormal
- 📊 **Analytics Dashboard** - Analisis detail per kategori beban
- 🎨 **Modern UI/UX** - Interface clean dengan Tailwind CSS

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐
│  ThingSpeak API │
│   / CSV File    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FastAPI Backend│
│  (Rule-based)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Frontend │
│  (Vite + Tailwind)│
└─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Python 3.13** - Programming language
- **FastAPI** - Web framework
- **Pandas** - Data processing
- **Scikit-learn** - Machine learning utilities
- **python-dotenv** - Environment variables
- **Requests** - HTTP client

### Frontend
- **React 19.1** - UI library
- **Vite** - Build tool
- **Tailwind CSS 4.1** - Styling
- **Chart.js** - Data visualization
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📦 Instalasi

### Prerequisites
- Python 3.13+
- Node.js 18+
- Pipenv (install: `pip install pipenv`)

### 1️⃣ Clone Repository
```bash
git clone <repository-url>
cd iot-power-monitoring
```

### 2️⃣ Setup Backend
```bash
cd backend

# Install dependencies dengan pipenv
pipenv install

# Atau install dengan pip
pip install -r requirements.txt

# Aktifkan virtual environment (jika pakai pipenv)
pipenv shell

# Copy .env template (jika belum ada)
cp .env.example .env
```

**Konfigurasi `.env`:**
```env
# ThingSpeak Configuration
THINGSPEAK_CHANNEL_ID=1866623
THINGSPEAK_RESULTS=8000

# Tarif Listrik (IDR per kWh)
ELECTRICITY_RATE=1444.70

# Data Source (api atau csv)
DATA_SOURCE=csv
```

### 3️⃣ Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Copy .env template (jika belum ada)
cp .env.example .env
```

**Konfigurasi `frontend/.env`:**
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## 🚀 Menjalankan Aplikasi

### Opsi 1: Jalankan Terpisah

**Terminal 1 - Backend:**
```bash
cd backend
pipenv shell
uvicorn main:app --reload
```
Backend akan berjalan di `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

### Opsi 2: Jalankan Bersamaan
```bash
cd frontend
npm run start
```
Script ini akan menjalankan backend dan frontend sekaligus.

## 📊 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | API information |
| GET | `/classify?limit=10` | Data terklasifikasi (latest N records) |
| GET | `/status` | Status sensor terkini + alerts |
| GET | `/summary` | Ringkasan statistik keseluruhan |
| GET | `/trend?limit=50` | Time series data untuk grafik |
| GET | `/statistics` | Statistik detail per kategori |
| GET | `/distribution` | Distribusi beban listrik |
| GET | `/cost_estimate` | Estimasi biaya listrik |
| GET | `/health` | Health check endpoint |

**Contoh Response `/status`:**
```json
{
  "timestamp": "2025-10-29T15:30:00Z",
  "voltage": 210.5,
  "current": 0.15,
  "power": 31.5,
  "pf": 0.75,
  "frequency": 50.0,
  "energy": 0.22,
  "status": "Beban Ringan",
  "alerts": ["✅ Semua parameter normal"]
}
```

## 📁 Struktur Folder

```
iot-power-monitoring/
├── backend/
│   ├── classifier/
│   │   ├── __init__.py
│   │   └── rule_based.py          # Logika klasifikasi
│   ├── services/
│   │   ├── __init__.py
│   │   └── thingspeak_service.py  # Fetch data dari API/CSV
│   ├── main.py                    # FastAPI application
│   ├── .env                       # Environment variables
│   ├── Pipfile                    # Python dependencies
│   └── feeds.csv                  # Sample data
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── powerApi.js        # API client
│   │   ├── components/
│   │   │   ├── AlertCard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── layout/
│   │   │       ├── Navbar.jsx
│   │   │       └── Header.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── Analytics.jsx      # Analytics page
│   │   │   └── CostEstimate.jsx   # Cost estimation
│   │   ├── utils/
│   │   │   └── formatters.js      # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                       # Frontend config
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 🎯 Rule-Based Classification

Sistem menggunakan threshold power untuk klasifikasi:

| Kategori | Range Daya | Threshold |
|----------|------------|-----------|
| **Beban Ringan** | 0 - 50 W | < 50W |
| **Beban Sedang** | 50 - 500 W | 50W - 500W |
| **Beban Tinggi** | > 500 W | > 500W |
| **Sensor OFF** | 0 W | power = 0 |

**Alert Rules:**
- ⚠️ Daya > 600W → "Konsumsi daya sangat tinggi!"
- ⚠️ Tegangan < 200V atau > 230V → "Tegangan tidak stabil"
- ⚠️ Power Factor < 0.7 → "Power factor rendah - efisiensi buruk"
- ⚠️ Arus > 10A → "Arus terlalu tinggi - risiko overload"

## 🧪 Testing

### Test Backend API
```bash
# Test health check
curl http://localhost:8000/health

# Test status endpoint
curl http://localhost:8000/status

# Test dengan parameter
curl http://localhost:8000/classify?limit=5
```

### Test Frontend
```bash
cd frontend
npm run lint     # ESLint check
npm run build    # Production build
npm run preview  # Preview production build
```

## 🔧 Troubleshooting

### Backend Tidak Bisa Akses ThingSpeak API
- Cek koneksi internet
- Ubah `DATA_SOURCE=csv` di `.env` untuk menggunakan data lokal
- Pastikan file `feeds.csv` ada di folder `backend/`

### Frontend Tidak Bisa Connect ke Backend
- Pastikan backend sudah running di port 8000
- Cek `VITE_API_BASE_URL` di `frontend/.env`
- Periksa CORS settings di `backend/main.py`

### Grafik Tidak Muncul
- Buka browser console untuk cek error
- Pastikan data dari API tidak kosong
- Clear cache browser dan reload

### Pipenv Error
```bash
# Jika pipenv gagal, gunakan pip biasa
pip install -r backend/requirements.txt
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate     # Windows
```

## 📚 Dokumentasi Tambahan

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Chart.js Docs](https://www.chartjs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [ThingSpeak API](https://www.mathworks.com/help/thingspeak/)

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 To-Do List

- [ ] Implementasi machine learning model (LSTM/CNN)
- [ ] Export data ke Excel/PDF
- [ ] Notifikasi email/WhatsApp untuk alert
- [ ] User authentication & authorization
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Docker deployment
- [ ] Mobile app (React Native)
- [ ] Historical data comparison

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik. Silakan gunakan dengan bijak.

## 👨‍💻 Author

Dibuat dengan ☕ oleh mahasiswa yang ngerjain tugas akhir

## 🙏 Acknowledgments

- Dosen pembimbing yang sabar
- Teman-teman yang support
- Stack Overflow yang selalu ada
- ChatGPT yang kadang bantu kadang ngaco 😅

---

**⭐ Jangan lupa star repository ini kalau membantu!**

*Last updated: November 2025*
