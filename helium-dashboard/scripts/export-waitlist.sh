#!/bin/bash
# Export waitlist before deployment

echo "Fetching waitlist from production..."
curl -s https://your-domain.vercel.app/api/waitlist > waitlist-backup.json

echo "Backup saved to waitlist-backup.json"
echo "Total signups: $(cat waitlist-backup.json | grep -o '"email"' | wc -l)"
