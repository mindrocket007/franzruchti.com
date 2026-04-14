# franzruchti.com

## Tech-Stack
- Next.js 14, TypeScript, Tailwind CSS v3, App Router
- Vercel Deployment via CLI

## Auth
- Single-User, Passwort-basiert (bcryptjs)
- HMAC-Token in httpOnly Cookie (30 Tage)
- Middleware schuetzt /dashboard/*, /project/*, /fitness/*

## Fitness Dashboard (/fitness/*)
- Prisma 7 mit Turso/LibSQL Cloud (fitness-dashboard-mindrocket.aws-eu-west-1.turso.io)
- 13 DB-Tabellen, User-ID: "franz"
- Recharts fuer Charts

### Datenquellen
- **Yazio:** Inoffizielle API (yzapi.yazio.com/v15), Username/Password Auth
- **Garmin:** garmin-givemydata (lokal) + garmin-sync.mjs → Turso
- **Trainingsplan:** Eigenes CRUD

### Garmin Sync
- Windows Task Scheduler "Garmin Fitness Sync" alle 4h
- Script: scripts/garmin-auto-sync.bat
- Manuell: garmin-givemydata + node --env-file=.env.local scripts/garmin-sync.mjs

### Fitness-Ziel
- Deadline: 20. Juli 2026 (Countdown im Dashboard)

## Deployen
```bash
cd "C:/Users/franz/franzruchti.com" && vercel --prod --yes
```

## Env-Vars (IMMER printf, nie echo!)
- AUTH_SECRET, PASSWORD_HASH
- TURSO_DATABASE_URL, TURSO_AUTH_TOKEN
- YAZIO_USERNAME, YAZIO_PASSWORD
- CRON_SECRET
