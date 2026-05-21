#!/bin/bash

# ORGA Site Health Verification Script
# Comprehensive check for underground.folkup.life after DNS propagation

echo "=========================================="
echo "ORGA Site Health Verification"
echo "Domain: underground.folkup.life"
echo "Target IP: 46.225.107.2"
echo "Time: $(date)"
echo "=========================================="

# Function to check DNS resolution
check_dns() {
    echo "=== DNS Resolution Check ==="

    # Check multiple DNS servers
    for server in "8.8.8.8" "1.1.1.1" "local"; do
        echo "--- $server DNS ---"
        if [ "$server" = "local" ]; then
            ips=$(nslookup underground.folkup.life 2>/dev/null | grep "Address:" | tail -n +2 | awk '{print $2}' | grep -v "::")
        else
            ips=$(nslookup underground.folkup.life $server 2>/dev/null | grep "Address:" | tail -n +2 | awk '{print $2}' | grep -v "::")
        fi

        if echo "$ips" | grep -q "46.225.107.2"; then
            echo "✅ RESOLVED: 46.225.107.2 (Hetzner direct)"
        elif echo "$ips" | grep -q "172.67\|104.21"; then
            echo "⏳ CLOUDFLARE: Still proxied"
        else
            echo "❌ UNKNOWN: $ips"
        fi
        echo
    done
}

# Function to check SSL certificate
check_ssl() {
    echo "=== SSL Certificate Check ==="

    # Test HTTPS connection
    echo "Testing SSL certificate..."
    ssl_output=$(curl -v -s https://underground.folkup.life/ --max-time 10 2>&1)

    if echo "$ssl_output" | grep -q "SSL certificate verify ok"; then
        echo "✅ SSL CERTIFICATE: Valid"

        # Get certificate details
        echo "Certificate details:"
        echo "$ssl_output" | grep -E "subject|issuer|expire"

    elif echo "$ssl_output" | grep -q "self signed certificate"; then
        echo "⏳ SSL CERTIFICATE: Self-signed (Let's Encrypt pending)"

    elif echo "$ssl_output" | grep -q "certificate verify failed"; then
        echo "❌ SSL CERTIFICATE: Invalid"

    else
        echo "❓ SSL CERTIFICATE: Unknown status"
        echo "SSL output preview:"
        echo "$ssl_output" | head -5
    fi
    echo
}

# Function to check site content
check_site_content() {
    echo "=== Site Content Verification ==="

    # Test HTTP redirect
    echo "Testing HTTP → HTTPS redirect..."
    http_response=$(curl -I -s http://underground.folkup.life/ --max-time 10)
    if echo "$http_response" | grep -q "301\|302"; then
        echo "✅ HTTP REDIRECT: Working"
    else
        echo "❌ HTTP REDIRECT: Failed"
    fi

    # Test HTTPS content
    echo "Testing HTTPS content..."
    https_content=$(curl -s https://underground.folkup.life/ --max-time 10 2>/dev/null)

    if echo "$https_content" | grep -q "Underground Academia"; then
        echo "✅ SITE CONTENT: Underground Academia loaded"
    elif echo "$https_content" | grep -q "html"; then
        echo "⚠️ SITE CONTENT: HTML loaded but title check failed"
    else
        echo "❌ SITE CONTENT: No content loaded"
    fi

    # Check for key brand elements
    if echo "$https_content" | grep -q "Bordeaux\|#7D4450"; then
        echo "✅ BRAND GUIDE: Bordeaux theme detected"
    else
        echo "⚠️ BRAND GUIDE: Brand elements check needed"
    fi

    # Check language
    if echo "$https_content" | grep -q 'lang="ru"'; then
        echo "✅ LANGUAGE: Russian primary detected"
    else
        echo "⚠️ LANGUAGE: Language check needed"
    fi
    echo
}

# Function to check security headers
check_security_headers() {
    echo "=== Security Headers Check ==="

    headers=$(curl -I -s https://underground.folkup.life/ --max-time 10 2>/dev/null)

    # Check key security headers
    if echo "$headers" | grep -q "Strict-Transport-Security"; then
        echo "✅ HSTS: Enabled"
    else
        echo "❌ HSTS: Missing"
    fi

    if echo "$headers" | grep -q "Content-Security-Policy"; then
        echo "✅ CSP: Enabled"
    else
        echo "❌ CSP: Missing"
    fi

    if echo "$headers" | grep -q "X-Frame-Options"; then
        echo "✅ X-Frame-Options: Enabled"
    else
        echo "❌ X-Frame-Options: Missing"
    fi
    echo
}

# Function to check nginx-proxy integration
check_nginx_proxy() {
    echo "=== nginx-proxy Integration Check ==="

    # Check if nginx-proxy is serving the request
    headers=$(curl -I -s https://underground.folkup.life/ --max-time 10 2>/dev/null)

    if echo "$headers" | grep -q "nginx"; then
        echo "✅ NGINX: nginx-proxy detected"
    else
        echo "❌ NGINX: nginx server header missing"
    fi

    # Check for FolkUp infrastructure patterns
    if echo "$headers" | grep -q "orga-underground-academia"; then
        echo "✅ CONTAINER: orga-underground-academia integration"
    else
        echo "⚠️ CONTAINER: Container integration check needed"
    fi
    echo
}

# Main execution
main() {
    check_dns
    check_ssl
    check_site_content
    check_security_headers
    check_nginx_proxy

    echo "=========================================="
    echo "Health check complete at $(date)"
    echo "=========================================="
}

# Run if called directly
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi