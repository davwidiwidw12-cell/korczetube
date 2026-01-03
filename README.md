# KorczeTube - Platforma Wideo

Kompletna platforma wideo typu YouTube.

## 1. Wymagania
- Node.js (v18+)
- Docker (do bazy danych)

## 2. Uruchomienie Krok po Kroku

### Krok 1: Baza Danych
Uruchom bazę PostgreSQL za pomocą Docker Compose:
```bash
docker compose up -d
```
Jeśli nie masz Dockera, zainstaluj PostgreSQL lokalnie i zaktualizuj plik `server/.env` (DATABASE_URL).

### Krok 2: Backend (Server)
Otwórz terminal w folderze `server`:
```bash
cd server
npm install
npx prisma migrate dev --name init
npm run start
```
Serwer uruchomi się na porcie **4000**.
Admin "Korcze" zostanie utworzony automatycznie przy starcie.
Dane logowania admina:
- Email: `korcze@korczetube.com`
- Hasło: `korcze_admin_password`

### Krok 3: Frontend (Client)
Otwórz nowy terminal w folderze `client`:
```bash
cd client
npm install
npm run dev
```
Aplikacja dostępna pod adresem: **http://localhost:3000**

## 3. Funkcje
- **Admin Panel**: Zaloguj się jako Korcze, aby dodawać filmy.
- **Konkursy**: Przy dodawaniu filmu włącz "Tryb Konkursowy" i ustaw hasło.
- **2FA**: W profilu użytkownika można włączyć uwierzytelnianie dwuskładnikowe.
- **Subskrypcje/Like**: Dostępne dla zalogowanych użytkowników.

## 4. Stack Technologiczny
- Frontend: Next.js 15, TailwindCSS, Framer Motion
- Backend: NestJS, Prisma, Passport, JWT
- Baza: PostgreSQL
