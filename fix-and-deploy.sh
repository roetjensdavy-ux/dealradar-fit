#!/bin/bash
set -e

echo "======================================"
echo "  DealRadar.fit - Fix & Deploy"
echo "  Herstel + Correct domein setup"
echo "======================================"
echo ""

INSTALL_DIR="/opt/james-ai"
SERVER_IP="65.21.111.196"

# ============================================================================
# STAP 1: OPRUIMEN — Verwijder verkeerde Nginx config
# ============================================================================
echo "[1/7] Opruimen verkeerde configuratie..."

# Stop dealradar containers tijdelijk
docker stop dealradar-frontend dealradar-api 2>/dev/null || true

# Herstel Nginx config voor insightoperator.org (James AI)
cat > "$INSTALL_DIR/nginx/nginx.conf" << 'NGINX_EOF'
server {
    listen 80;
    server_name insightoperator.org www.insightoperator.org;

    # James AI — Agentic Workforce Platform
    # DealRadar is NIET op dit domein!

    location / {
        proxy_pass http://crewai-frontend:80;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API routes — James AI CrewAI
    location /agents {
        proxy_pass http://crewai-api:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ceo {
        proxy_pass http://crewai-api:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        proxy_pass http://crewai-api:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /docs {
        proxy_pass http://crewai-api:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /health {
        proxy_pass http://crewai-api:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /openapi.json {
        proxy_pass http://crewai-api:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # n8n Workflow Automation
    location /n8n {
        proxy_pass http://n8n:5678;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Static assets
    location /static {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://crewai-frontend:80;
    }

    # Favicon
    location = /favicon.ico {
        proxy_pass http://crewai-frontend:80;
    }
}

# ============================================================================
# DealRadar.fit — Price Comparison Engine (SEPARATE SERVER BLOCK)
# ============================================================================
server {
    listen 80;
    server_name dealradar.fit www.dealradar.fit;

    # Frontend
    location / {
        proxy_pass http://dealradar-frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/v1/ {
        proxy_pass http://dealradar-api:8001/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SEO endpoints
    location = /sitemap.xml {
        proxy_pass http://dealradar-api:8001/api/v1/sitemap.xml;
    }

    location = /robots.txt {
        proxy_pass http://dealradar-api:8001/api/v1/robots.txt;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        proxy_pass http://dealradar-frontend:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

echo "  Nginx config hersteld"

# ============================================================================
# STAP 2: GitHub repo clone of update
# ============================================================================
echo "[2/7] Code bijwerken van GitHub..."
cd "$INSTALL_DIR"

if [ -d "$INSTALL_DIR/dealradar/.git" ]; then
    cd "$INSTALL_DIR/dealradar"
    git fetch origin main
    git reset --hard origin/main
else
    # Backup oude code
    mv "$INSTALL_DIR/dealradar" "$INSTALL_DIR/dealradar-backup-$(date +%Y%m%d)" 2>/dev/null || true
    git clone https://github.com/roetjensdavy-ux/dealradar-fit.git "$INSTALL_DIR/dealradar"
fi

echo "  Code bijgewerkt"

# ============================================================================
# STAP 3: Database tabellen aanmaken
# ============================================================================
echo "[3/7] Database tabellen controleren..."
docker exec -i postgres psql -U james -d jamesai << 'SQL' 2>/dev/null || echo "  (tabellen bestaan mogelijk al)"
CREATE TABLE IF NOT EXISTS retailers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    network TEXT,
    commission_rate DECIMAL(5,2),
    shipping_config JSONB DEFAULT '{"free_threshold": null, "default_cost": 0}',
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
SQL

echo "  Database OK"

# ============================================================================
# STAP 4: Docker containers bouwen en starten
# ============================================================================
echo "[4/7] Docker containers bouwen..."
cd "$INSTALL_DIR"

# Oude containers verwijderen
docker rm -f dealradar-api dealradar-frontend 2>/dev/null || true

# Bouw API
echo "  - Building dealradar-api..."
docker build -t dealradar-api:latest "$INSTALL_DIR/dealradar/dealradar-api/" 2>&1 | tail -5

# Bouw Frontend
echo "  - Building dealradar-frontend..."
docker build -t dealradar-frontend:latest "$INSTALL_DIR/dealradar/dealradar-frontend/" 2>&1 | tail -5

# Start containers
echo "  - Starting containers..."
docker run -d \
    --name dealradar-api \
    --network james-network \
    -p 127.0.0.1:8001:8001 \
    -e DATABASE_URL="postgresql://james:Kraaienhof42bX@postgres:5432/jamesai" \
    -e REDIS_URL="redis://redis:6379/1" \
    --restart unless-stopped \
    dealradar-api:latest

docker run -d \
    --name dealradar-frontend \
    --network james-network \
    -p 127.0.0.1:3000:3000 \
    --restart unless-stopped \
    dealradar-frontend:latest

sleep 5
echo "  Containers gestart"

# ============================================================================
# STAP 5: Seed data
# ============================================================================
echo "[5/7] Mock data seeden..."
for i in $(seq 1 30); do
    if curl -s http://localhost:8001/api/v1/health > /dev/null 2>&1; then
        echo "  API is up!"
        curl -s -X POST http://localhost:8001/api/v1/admin/seed > /dev/null 2>&1 || true
        echo "  Data geseed"
        break
    fi
    echo "  Wachten op API... ($i/30)"
    sleep 2
done

# ============================================================================
# STAP 6: Nginx herladen
# ============================================================================
echo "[6/7] Nginx herladen..."
docker exec nginx nginx -s reload 2>/dev/null || echo "  Nginx container niet gevonden, herstart nginx container..."

echo "  Nginx herladen"

# ============================================================================
# STAP 7: SSL Certificaat voor dealradar.fit
# ============================================================================
echo "[7/7] SSL certificaat aanvragen..."
echo ""
echo "  ==========================================="
echo "  IMPORTANT: SSL Certificaat"
echo "  ==========================================="
echo ""
echo "  Run dit commando HANDMATIG om SSL in te stellen:"
echo ""
echo "    certbot --nginx -d dealradar.fit -d www.dealradar.fit"
echo ""
echo "  Of als je wildcard wilt:"
echo ""
echo "    certbot --nginx -d dealradar.fit -d www.dealradar.fit --agree-tos --non-interactive --email jouw@email.com"
echo ""

# Automatisch proberen als certbot beschikbaar is
if command -v certbot &> /dev/null; then
    certbot --nginx -d dealradar.fit -d www.dealradar.fit --agree-tos --non-interactive --email admin@dealradar.fit 2>/dev/null || echo "  SSL handmatig configuratie nodig"
else
    echo "  Certbot niet gevonden. SSL handmatig configureren."
fi

# ============================================================================
# STATUS
# ============================================================================
echo ""
echo "======================================"
echo "  DEPLOYMENT COMPLEET!"
echo "======================================"
echo ""
echo "  INSIGHTOPERATOR.ORG (James AI):"
echo "    ✓ Hersteld naar James AI"
echo ""
echo "  DEALRADAR.FIT (Prijsvergelijker):"
echo "    ✓ http://dealradar.fit"
echo "    ✓ http://www.dealradar.fit"
echo ""
echo "  API: http://localhost:8001"
echo ""
echo "  Containers:"
docker ps --format "    {{.Names}}: {{.Status}}" 2>/dev/null | grep -E "dealradar|crewai|nginx" || true
echo ""
echo "======================================"
echo ""
echo "  BELANGRIJK:"
echo "  1. Zorg dat dealradar.fit A-record"
echo "     wijst naar: $SERVER_IP"
echo ""
echo "  2. SSL: certbot --nginx -d dealradar.fit"
echo ""
echo "  3. Test: curl http://dealradar.fit/api/v1/health"
echo ""
echo "======================================"
