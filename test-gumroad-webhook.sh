#!/bin/bash

# Test Gumroad Webhook Locally
# Usage: ./test-gumroad-webhook.sh

echo "🧪 Testing Gumroad Webhook"
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

# Test webhook with sample Gumroad payload
curl -X POST http://localhost:3000/api/gumroad \
  -H "Content-Type: application/json" \
  -d '{
    "sale_id": "test_12345",
    "product_name": "Test Product",
    "price": 2999,
    "created_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "email": "test@example.com"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n"

echo ""
echo "✅ Test complete!"
echo ""
echo "📊 Check your Supabase revenue table to verify the entry was created."
echo ""

