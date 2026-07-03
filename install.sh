#!/bin/bash
set -e

echo "======================================"
echo "  DealRadar.fit - Installer"
echo "  Prijsvergelijkingsplatform"
echo "======================================"
echo ""

# Config
INSTALL_DIR="/opt/james-ai"
REPO_URL="https://github.com/roetjensdavy-ux/dealradar-fit.git"
DB_USER="james"
DB_NAME="jamesai"

echo "[1/6] Clone/update repository..."
if [ -d "$INSTALL_DIR/dealradar" ]; then
    cd "$INSTALL_DIR/dealradar"
    git pull origin main
else
    mkdir -p "$INSTALL_DIR"
    git clone "$REPO_URL" "$INSTALL_DIR/dealradar"
fi

echo "[2/6] Create DealRadar database tables..."
docker exec postgres psql -U "$DB_USER" -d "$DB_NAME" -c "
CREATE TABLE IF NOT EXISTS retailers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    network TEXT,
    commission_rate DECIMAL(5,2),
    shipping_config JSONB DEFAULT '{\"free_threshold\": null, \"default_cost\": 0}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ean TEXT,
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT,
    subcategory TEXT,
    image_url TEXT,
    description TEXT,
    specifications JSONB DEFAULT '{}',
    slug TEXT UNIQUE NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES retailers(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) GENERATED ALWAYS AS (price + shipping_cost) STORED,
    product_url TEXT,
    affiliate_url TEXT,
    in_stock BOOLEAN DEFAULT true,
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, retailer_id)
);

CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    offer_id UUID REFERENCES offers(id),
    retailer_id UUID REFERENCES retailers(id),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    utm_source TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);
" 2>/dev/null || echo "Tables may already exist, continuing..."

echo "[3/6] Build and start DealRadar containers..."
cd "$INSTALL_DIR"

# Build API
echo "  - Building dealradar-api..."
docker build -t dealradar-api ./dealradar/dealradar-api/

# Build Frontend
echo "  - Building dealradar-frontend..."
docker build -t dealradar-frontend ./dealradar/dealradar-frontend/

# Start containers
echo "  - Starting containers..."
docker stop dealradar-api dealradar-frontend 2>/dev/null || true
docker rm dealradar-api dealradar-frontend 2>/dev/null || true

docker run -d \
    --name dealradar-api \
    --network james-network \
    -p 8001:8001 \
    -e DATABASE_URL="postgresql://james:Kraaienhof42bX@postgres:5432/jamesai" \
    -e REDIS_URL="redis://redis:6379/1" \
    --restart unless-stopped \
    dealradar-api

docker run -d \
    --name dealradar-frontend \
    --network james-network \
    -p 3000:3000 \
    --restart unless-stopped \
    dealradar-frontend

echo "[4/6] Wait for API to be ready..."
sleep 8
for i in $(seq 1 30); do
    if curl -s http://localhost:8001/api/v1/health > /dev/null 2>&1; then
        echo "  API is up!"
        break
    fi
    echo "  Waiting... ($i/30)"
    sleep 2
done

echo "[5/6] Seed mock data..."
curl -s -X POST http://localhost:8001/api/v1/admin/seed > /dev/null 2>&1 || echo "Seed may have already run"

echo "[6/6] Update Nginx configuration..."
if [ -f "$INSTALL_DIR/nginx/nginx.conf" ]; then
    # Check if dealradar config is already included
    if ! grep -q "dealradar.conf" "$INSTALL_DIR/nginx/nginx.conf"; then
        echo "  Adding DealRadar routes to Nginx..."
        cat >> "$INSTALL_DIR/nginx/nginx.conf" << 'NGINX'

# DealRadar.fit routes
location / {
    proxy_pass http://dealradar-frontend:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location /api/v1/ {
    proxy_pass http://dealradar-api:8001/api/v1/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location = /sitemap.xml {
    proxy_pass http://dealradar-api:8001/api/v1/sitemap.xml;
}

location = /robots.txt {
    proxy_pass http://dealradar-api:8001/api/v1/robots.txt;
}
NGINX
        docker exec nginx nginx -s reload 2>/dev/null || echo "  Please reload nginx manually: docker exec nginx nginx -s reload"
    else
        echo "  Nginx already configured for DealRadar"
    fi
else
    echo "  Nginx config not found at $INSTALL_DIR/nginx/nginx.conf"
    echo "  Please add the dealradar routes manually"
fi

echo ""
echo "======================================"
echo "  DealRadar.fit is LIVE!"
echo "======================================"
echo ""
echo "  Frontend:  https://dealradar.fit (via Nginx)"
echo "  API:       http://localhost:8001"
echo "  Health:    http://localhost:8001/api/v1/health"
echo "  Admin:     http://localhost:8001/api/v1/admin/stats"
echo ""
echo "  Containers:"
docker ps --format "  - {{.Names}} ({{.Status}})" | grep -E "dealradar"
echo ""
echo "======================================"
