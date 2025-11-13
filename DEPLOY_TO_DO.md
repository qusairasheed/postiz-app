# 🚀 Deployment Instructions for Digital Ocean

## ✅ Code Pushed to GitHub Successfully!
Commit: `8cb2f172` - feat: Add database layer for auto-news posting feature

---

## 📋 Run These Commands on Your Digital Ocean Server

### Step 1: SSH into your server
```bash
ssh root@165.227.13.76
```

### Step 2: Navigate to your project directory
```bash
cd /path/to/postiz-app  # Update this with your actual path
# Common paths might be:
# cd /root/postiz-app
# cd /var/www/postiz-app
# cd /home/postiz/postiz-app
```

### Step 3: Pull latest changes from GitHub
```bash
git pull origin main
```

### Step 4: Run Database Migration
```bash
npx prisma migrate deploy --schema=libraries/nestjs-libraries/src/database/prisma/schema.prisma
```

### Step 5: Generate Prisma Client
```bash
npx prisma generate --schema=libraries/nestjs-libraries/src/database/prisma/schema.prisma
```

### Step 6: Restart your application
**If using Docker Compose:**
```bash
docker-compose restart
# or
docker-compose down && docker-compose up -d
```

**If using PM2:**
```bash
pm2 restart all
```

**If using systemd:**
```bash
sudo systemctl restart postiz
```

### Step 7: Verify Deployment
```bash
# Check if services are running
docker-compose ps
# or
pm2 status

# Check database tables were created
npx prisma studio --schema=libraries/nestjs-libraries/src/database/prisma/schema.prisma
# Then look for: NewsSource, NewsItem, PostedNews tables
```

---

## 🧪 Quick Test Queries (Optional)

After migration, you can verify tables exist:

```bash
# Connect to PostgreSQL (adjust credentials as needed)
psql -U postiz-user -d postiz-db-local

# Run these SQL queries:
\dt "NewsSource"
\dt "NewsItem"
\dt "PostedNews"

# Should show 3 tables
\q  # exit psql
```

---

## ⚠️ Troubleshooting

### If migration fails:
```bash
# Check current migration status
npx prisma migrate status --schema=libraries/nestjs-libraries/src/database/prisma/schema.prisma

# If needed, reset and re-run
npx prisma migrate reset --schema=libraries/nestjs-libraries/src/database/prisma/schema.prisma
npx prisma migrate deploy --schema=libraries/nestjs-libraries/src/database/prisma/schema.prisma
```

### If Prisma client errors:
```bash
# Force regenerate
rm -rf node_modules/.prisma
npx prisma generate --schema=libraries/nestjs-libraries/src/database/prisma/schema.prisma
```

### If app won't start:
```bash
# Check logs
docker-compose logs -f
# or
pm2 logs

# Look for errors related to Prisma or database
```

---

## 📊 What Was Added

### New Database Tables:
1. **NewsSource** - Stores RSS feed sources
2. **NewsItem** - Stores fetched news articles
3. **PostedNews** - Tracks posted news items

### New Backend Files:
- 3 Repository files (database operations)
- 1 Service file (business logic)
- 4 DTO files (validation)
- 1 Migration SQL file
- Updated DatabaseModule

---

## ✅ Success Indicators

After deployment, you should see:
- ✅ Migration completes without errors
- ✅ Prisma client generates successfully
- ✅ Application restarts without crashes
- ✅ No errors in logs
- ✅ Can access http://165.227.13.76:5000 (or your port)

---

## 📞 Need Help?

If you encounter issues, share:
1. The exact error message
2. Output of `docker-compose logs` or `pm2 logs`
3. Output of `npx prisma migrate status`

---

**Next Step**: Once deployed, we'll build Step 2 - RSS Aggregation Service! 🎉
