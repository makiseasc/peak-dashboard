#!/bin/bash

# Test Cal.com Webhook Locally
# Usage: ./test-calcom-webhook.sh

echo "🧪 Testing Cal.com Webhook"
echo "=========================="
echo ""

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Dev server not running. Start it with: npm run dev"
    exit 1
fi

echo "✅ Dev server is running"
echo ""
echo "📤 Sending test webhook payload..."
echo ""

# Test webhook with sample Cal.com payload
curl -X POST http://localhost:3000/api/calcom \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "startTime": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "eventType": {
      "title": "Discovery Call"
    },
    "bookingId": "test_12345"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n"

echo ""
echo "✅ Test complete!"
echo ""
echo "📊 Check your Supabase pipeline table to verify the entry was created."
echo ""

