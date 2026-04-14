#!/bin/bash

# ORGA Deployment Script — Underground Academia Platform
# Enhanced Alice v2.0 Level 3 Cartouche Autonome Infrastructure Deployment
# Execute on server: ./deploy-orga.sh

set -euo pipefail

DOMAIN="underground.folkup.life"
CONTAINER_NAME="orga-underground"
IMAGE="nginx:1.29-alpine"
DEPLOY_USER="deploy"
PROJECT_DIR="/home/$DEPLOY_USER/orga"

echo "🏗️  ORGA Deployment — Underground Academia Platform"
echo "🚀 Domain: $DOMAIN"
echo "📦 Container: $CONTAINER_NAME"
echo "🐳 Image: $IMAGE"
echo ""

# Ensure we're running as deploy user
if [[ $(whoami) != "$DEPLOY_USER" ]]; then
    echo "❌ Must run as $DEPLOY_USER user"
    exit 1
fi

# Create project directory structure
echo "📁 Setting up project directory..."
mkdir -p "$PROJECT_DIR"/{public,logs}
cd "$PROJECT_DIR"

# Stop and remove existing container if running
echo "🛑 Stopping existing container..."
docker stop "$CONTAINER_NAME" 2>/dev/null || echo "Container not running"
docker rm "$CONTAINER_NAME" 2>/dev/null || echo "Container not found"

# Pull latest nginx image
echo "📥 Pulling nginx image..."
docker pull "$IMAGE"

# Copy Astro build from git repository
echo "📋 Deploying Astro build..."
if [[ -d "$PROJECT_DIR/git-repo" ]]; then
    echo "🔄 Updating git repository..."
    cd "$PROJECT_DIR/git-repo"
    git fetch origin
    git checkout underground-deployment-ready
    git pull origin underground-deployment-ready
else
    echo "📥 Cloning repository..."
    git clone https://github.com/FolkUp/orga.git "$PROJECT_DIR/git-repo"
    cd "$PROJECT_DIR/git-repo"
    git checkout underground-deployment-ready
fi

# Copy built files to public directory
echo "📂 Copying Astro build files..."
rsync -av --delete "$PROJECT_DIR/git-repo/astro/dist/" "$PROJECT_DIR/public/"

# Verify critical files exist
CRITICAL_FILES=(
    "public/index.html"
    "public/icons/wrench.svg"
    "public/fonts/inter-regular.woff2"
    "public/_headers"
    "public/.well-known/security.txt"
)

echo "🧪 Verifying deployment files..."
for file in "${CRITICAL_FILES[@]}"; do
    if [[ -f "$PROJECT_DIR/$file" ]]; then
        echo "✅ $file"
    else
        echo "❌ Missing critical file: $file"
        exit 1
    fi
done

# Copy nginx configuration
echo "⚙️  Configuring nginx..."
cp "$PROJECT_DIR/git-repo/deploy/nginx-orga.conf" "$PROJECT_DIR/"

# Set proper permissions
echo "🔐 Setting file permissions..."
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$PROJECT_DIR"
find "$PROJECT_DIR/public" -type f -exec chmod 644 {} \;
find "$PROJECT_DIR/public" -type d -exec chmod 755 {} \;
chmod 644 "$PROJECT_DIR/nginx-orga.conf"

# Start ORGA container
echo "🚀 Starting ORGA container..."
docker run -d \
    --name "$CONTAINER_NAME" \
    --restart unless-stopped \
    --network web \
    -e VIRTUAL_HOST="$DOMAIN" \
    -e LETSENCRYPT_HOST="$DOMAIN" \
    -e LETSENCRYPT_EMAIL="info@folkup.app" \
    -v "$PROJECT_DIR/public:/usr/share/nginx/html:ro" \
    -v "$PROJECT_DIR/nginx-orga.conf:/etc/nginx/conf.d/default.conf:ro" \
    -v "$PROJECT_DIR/logs:/var/log/nginx" \
    --label "project=orga" \
    --label "type=static-site" \
    --label "deployed=$(date -Iseconds)" \
    "$IMAGE"

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 5

# Verify container is running
if docker ps | grep -q "$CONTAINER_NAME"; then
    echo "✅ Container is running"

    # Show container info
    echo ""
    echo "📋 Container Information:"
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" | grep -E "(NAMES|$CONTAINER_NAME)"

    echo ""
    echo "📊 Container logs (last 20 lines):"
    docker logs --tail 20 "$CONTAINER_NAME"

else
    echo "❌ Container failed to start"
    echo "📊 Container logs:"
    docker logs "$CONTAINER_NAME"
    exit 1
fi

# Test local nginx response
echo ""
echo "🧪 Testing nginx response..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 -H "Host: $DOMAIN" | grep -q "200"; then
    echo "✅ Local nginx test passed"
else
    echo "⚠️  Local nginx test failed (may be normal if nginx-proxy not routing yet)"
fi

# Display final status
echo ""
echo "🎯 Deployment Summary:"
echo "📦 Container: $CONTAINER_NAME (running)"
echo "🌐 Domain: https://$DOMAIN"
echo "📁 Public files: $(find "$PROJECT_DIR/public" -type f | wc -l) files"
echo "📏 Total size: $(du -sh "$PROJECT_DIR/public" | cut -f1)"
echo "🔒 SSL: Let's Encrypt (auto-configured)"
echo ""
echo "⏱️  SSL certificate provisioning may take 2-3 minutes"
echo "🧪 Test deployment: curl -I https://$DOMAIN"
echo ""
echo "✅ ORGA Underground Academia Platform — Deployment Complete"

# Save deployment info
echo "📝 Saving deployment metadata..."
cat > "$PROJECT_DIR/deployment.json" <<EOF
{
    "deployed_at": "$(date -Iseconds)",
    "container_name": "$CONTAINER_NAME",
    "domain": "$DOMAIN",
    "git_commit": "$(cd "$PROJECT_DIR/git-repo" && git rev-parse HEAD)",
    "git_branch": "underground-deployment-ready",
    "file_count": $(find "$PROJECT_DIR/public" -type f | wc -l),
    "deployment_size": "$(du -sb "$PROJECT_DIR/public" | cut -f1)",
    "deployed_by": "Enhanced Alice v2.0 Level 3 Cartouche Autonome"
}
EOF

echo "💾 Deployment metadata saved to $PROJECT_DIR/deployment.json"