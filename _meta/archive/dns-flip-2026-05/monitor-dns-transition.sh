#!/bin/bash

# Enhanced DNS Transition Monitor for ORGA
# Monitors DNS propagation and triggers comprehensive verification when transition completes

TARGET_IP="46.225.107.2"
DOMAIN="underground.folkup.life"
MAX_CHECKS=30  # 1 hour monitoring (2-minute intervals)

echo "=========================================="
echo "ORGA DNS TRANSITION MONITOR"
echo "Domain: $DOMAIN"
echo "Target: $TARGET_IP (Hetzner direct)"
echo "Started: $(date)"
echo "=========================================="
echo

check_dns_servers() {
    local check_num=$1
    echo "--- DNS Check #$check_num at $(date) ---"

    # Check multiple DNS servers
    local google_ip=$(nslookup $DOMAIN 8.8.8.8 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}' | grep -v "::")
    local cloudflare_ip=$(nslookup $DOMAIN 1.1.1.1 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}' | grep -v "::")
    local local_ip=$(nslookup $DOMAIN 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}' | grep -v "::")

    echo "Google DNS (8.8.8.8): $google_ip"
    echo "Cloudflare DNS (1.1.1.1): $cloudflare_ip"
    echo "Local DNS: $local_ip"

    # Check if any DNS server has resolved to target IP
    if [[ "$google_ip" == "$TARGET_IP" ]] || [[ "$cloudflare_ip" == "$TARGET_IP" ]] || [[ "$local_ip" == "$TARGET_IP" ]]; then
        return 0  # Success
    else
        return 1  # Still propagating
    fi
}

verify_transition_complete() {
    echo
    echo "🎉 DNS TRANSITION DETECTED!"
    echo "==============================="
    echo "Direct IP resolution confirmed. Running comprehensive verification..."
    echo

    # Run comprehensive health check
    if [ -f "./verify-site-health.sh" ]; then
        ./verify-site-health.sh
    else
        echo "⚠️ Health check script not found. Running basic verification..."

        # Basic SSL check
        echo "=== SSL Certificate Verification ==="
        curl -v https://$DOMAIN/ --max-time 10 2>&1 | grep -E "subject|issuer|expire"
        echo

        # Basic content check
        echo "=== Content Verification ==="
        if curl -s https://$DOMAIN/ --max-time 10 | grep -q "Underground Academia"; then
            echo "✅ Site content loading correctly"
        else
            echo "❌ Site content check failed"
        fi
        echo
    fi

    echo "==============================="
    echo "🏁 MIGRATION VERIFICATION COMPLETE"
    echo "Time: $(date)"
    echo "==============================="
}

# Main monitoring loop
for i in $(seq 1 $MAX_CHECKS); do
    if check_dns_servers $i; then
        verify_transition_complete
        exit 0
    else
        echo "⏳ Still resolving to CF proxy - waiting for propagation..."

        # Show progress
        local elapsed=$((i * 2))
        echo "Elapsed: ${elapsed} minutes | Remaining checks: $((MAX_CHECKS - i))"
        echo

        # Wait 2 minutes before next check (except on last iteration)
        if [ $i -lt $MAX_CHECKS ]; then
            sleep 120
        fi
    fi
done

echo "⏰ MONITORING TIMEOUT REACHED"
echo "DNS propagation taking longer than expected ($((MAX_CHECKS * 2)) minutes)"
echo "Site remains accessible via Cloudflare proxy."
echo "Manual verification recommended."