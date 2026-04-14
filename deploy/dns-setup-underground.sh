#!/bin/bash

# ORGA DNS Setup Script — underground.folkup.life
# Enhanced Alice v2.0 Level 3 Cartouche Autonome Infrastructure Deployment
# Execute: ./dns-setup-underground.sh

set -euo pipefail

DOMAIN="underground.folkup.life"
TARGET_IP="46.225.107.2"
ZONE_ID="9ffb55d8a20b7302772acdbd14d40f99"  # folkup.life zone
CLOUDFLARE_API_TOKEN=""  # Will be loaded from SOPS

echo "🏗️  ORGA DNS Setup — Underground Academia Platform"
echo "📡 Domain: $DOMAIN"
echo "🎯 Target: $TARGET_IP"
echo ""

# Load Cloudflare API token from SOPS
if command -v sops >/dev/null 2>&1; then
    echo "🔐 Loading Cloudflare API credentials..."
    CLOUDFLARE_API_TOKEN=$(sops -d /opt/folkup/secrets/cloudflare.enc.yaml | grep 'api_token_new:' | cut -d' ' -f2)

    if [[ -z "$CLOUDFLARE_API_TOKEN" ]]; then
        echo "❌ Failed to load Cloudflare API token from SOPS"
        exit 1
    fi
    echo "✅ API token loaded successfully"
else
    echo "❌ SOPS not found. Install sops or set CLOUDFLARE_API_TOKEN manually"
    exit 1
fi

# Check if DNS record already exists
echo ""
echo "🔍 Checking existing DNS records..."
EXISTING_RECORD=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=A&name=$DOMAIN" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" | jq -r '.result[0].id // empty')

if [[ -n "$EXISTING_RECORD" ]]; then
    echo "⚠️  DNS record for $DOMAIN already exists (ID: $EXISTING_RECORD)"
    echo "🔄 Updating existing record..."

    RESPONSE=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$EXISTING_RECORD" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{
            "type": "A",
            "name": "'$DOMAIN'",
            "content": "'$TARGET_IP'",
            "ttl": 3600,
            "proxied": false,
            "comment": "ORGA Underground Academia platform - Enhanced Alice v2.0 deployment"
        }')
else
    echo "➕ Creating new DNS record..."

    RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{
            "type": "A",
            "name": "'$DOMAIN'",
            "content": "'$TARGET_IP'",
            "ttl": 3600,
            "proxied": false,
            "comment": "ORGA Underground Academia platform - Enhanced Alice v2.0 deployment"
        }')
fi

# Validate response
SUCCESS=$(echo "$RESPONSE" | jq -r '.success // false')
if [[ "$SUCCESS" == "true" ]]; then
    RECORD_ID=$(echo "$RESPONSE" | jq -r '.result.id')
    echo "✅ DNS record configured successfully"
    echo "📝 Record ID: $RECORD_ID"
    echo "🌐 Domain: $DOMAIN → $TARGET_IP (Proxy: OFF)"
    echo ""
    echo "⏱️  DNS propagation may take up to 5 minutes"
    echo "🧪 Test with: dig $DOMAIN"
    echo ""
else
    echo "❌ DNS setup failed:"
    echo "$RESPONSE" | jq -r '.errors[]?.message // "Unknown error"'
    exit 1
fi

# Verify DNS propagation
echo "🔍 Verifying DNS propagation..."
for i in {1..5}; do
    if dig +short "$DOMAIN" | grep -q "$TARGET_IP"; then
        echo "✅ DNS propagation confirmed"
        break
    else
        echo "⏳ Waiting for propagation... (attempt $i/5)"
        sleep 10
    fi
done

echo ""
echo "🎯 Next steps:"
echo "1. Configure nginx virtual host on server"
echo "2. Setup SSL certificate (Let's Encrypt)"
echo "3. Deploy Astro build to server"
echo "4. Test production deployment"
echo ""
echo "🚀 ORGA DNS Setup Complete — Ready for server configuration"