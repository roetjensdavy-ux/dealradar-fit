"""Mock data seeder for DealRadar.fit"""

import uuid
from decimal import Decimal

from app.database import execute, fetch


RETAILERS = [
    {"name": "Bol.com", "slug": "bol-com", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bol.com_logo.svg/200px-Bol.com_logo.svg.png", "website_url": "https://www.bol.com", "network": "awin", "commission_rate": 3.5},
    {"name": "Coolblue", "slug": "coolblue", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Coolblue_Logo.svg/200px-Coolblue_Logo.svg.png", "website_url": "https://www.coolblue.nl", "network": "awin", "commission_rate": 3.0},
    {"name": "Amazon.de", "slug": "amazon-de", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png", "website_url": "https://www.amazon.de", "network": "amazon", "commission_rate": 3.0},
    {"name": "Amazon.nl", "slug": "amazon-nl", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png", "website_url": "https://www.amazon.nl", "network": "amazon", "commission_rate": 3.0},
    {"name": "MediaMarkt", "slug": "mediamarkt", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Media_Markt_logo.svg/200px-Media_Markt_logo.svg.png", "website_url": "https://www.mediamarkt.nl", "network": "awin", "commission_rate": 2.5},
    {"name": "Decathlon", "slug": "decathlon", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Decathlon_Logo.svg/200px-Decathlon_Logo.svg.png", "website_url": "https://www.decathlon.nl", "network": "awin", "commission_rate": 3.5},
    {"name": "Vanden Borre", "slug": "vanden-borre", "logo_url": "https://www.vandenborre.be/assets/images/logo.png", "website_url": "https://www.vandenborre.be", "network": "awin", "commission_rate": 2.5},
    {"name": "Gamma", "slug": "gamma", "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Gamma_logo.svg/200px-Gamma_logo.svg.png", "website_url": "https://www.gamma.nl", "network": "awin", "commission_rate": 4.0},
    {"name": "Brico", "slug": "brico", "logo_url": "https://www.brico.be/assets/images/logo.png", "website_url": "https://www.brico.be", "network": "awin", "commission_rate": 3.5},
    {"name": "Hubo", "slug": "hubo", "logo_url": "https://www.hubo.be/assets/images/logo.png", "website_url": "https://www.hubo.be", "network": "awin", "commission_rate": 3.5},
]

# 56 products across electronics, home, sports
PRODUCTS = [
    # === ELECTRONICS ===
    # Smartphones
    {"name": "Apple iPhone 15 Pro 256GB", "brand": "Apple", "category": "electronics", "subcategory": "smartphones", "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692895703312", "description": "De iPhone 15 Pro met titanium design, A17 Pro chip en geavanceerd camerasysteem. 256GB opslagcapaciteit.", "base_price": 1229, "price_var": 80},
    {"name": "Apple iPhone 15 128GB", "brand": "Apple", "category": "electronics", "subcategory": "smartphones", "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1692925251278", "description": "De iPhone 15 met Dynamic Island, 48MP hoofdcamera en USB-C. 128GB opslag.", "base_price": 949, "price_var": 60},
    {"name": "Samsung Galaxy S24 Ultra 256GB", "brand": "Samsung", "category": "electronics", "subcategory": "smartphones", "image_url": "https://images.samsung.com/nl/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg", "description": "De Galaxy S24 Ultra met S Pen, 200MP camera en Galaxy AI. 256GB opslag.", "base_price": 1449, "price_var": 100},
    {"name": "Samsung Galaxy S24 128GB", "brand": "Samsung", "category": "electronics", "subcategory": "smartphones", "image_url": "https://images.samsung.com/nl/smartphones/galaxy-s24/images/galaxy-s24-highlights-color-amber-yellow-back-mo.jpg", "description": "De Galaxy S24 met Galaxy AI, 50MP camera en helder display. 128GB.", "base_price": 899, "price_var": 70},
    {"name": "Google Pixel 8 Pro 128GB", "brand": "Google", "category": "electronics", "subcategory": "smartphones", "image_url": "https://lh3.googleusercontent.com/0h7E1Mk4UpjfFqwdVmbXJ7Q3dQjDHTSqZRnoJ43lEKHNPrlQp6ARlRKKGwyy09y5T0saa2Ev4rQ6ZBQ=s1000-w1000-e1000-rw-v0", "description": "De Google Pixel 8 Pro met de beste Pixel-camera ooit en 24-uurs batterij.", "base_price": 1099, "price_var": 90},
    {"name": "Google Pixel 8a 128GB", "brand": "Google", "category": "electronics", "subcategory": "smartphones", "image_url": "https://lh3.googleusercontent.com/SJh5c8j38zLiwVm0iWMX44jLRBxqNp-kJGh1-o5xC3R4IgPRF8g7BjOcy8FzMHy1GxQJ4RqkFV7dGAg=s1000-w1000-e1000-rw-v0", "description": "De Pixel 8a levert geweldige AI-functies en een fantastische camera voor een betaalbare prijs.", "base_price": 499, "price_var": 40},
    {"name": "OnePlus 12 256GB", "brand": "OnePlus", "category": "electronics", "subcategory": "smartphones", "image_url": "https://image01.oneplus.net/media/202401/10/659e7c9a2c63e.jpg", "description": "De OnePlus 12 met Snapdragon 8 Gen 3, Hasselblad-camera en 100W SUPERVOOC-laden.", "base_price": 949, "price_var": 70},
    {"name": "Xiaomi 14 256GB", "brand": "Xiaomi", "category": "electronics", "subcategory": "smartphones", "image_url": "https://i02.appmifile.com/313_operator_nl/13/12/2023/7f5e6e4e8c0f4b5b8e4d8c9a0b1c2d3e.jpg", "description": "De Xiaomi 14 met Leica-lens, Snapdragon 8 Gen 3 en 120Hz AMOLED-display.", "base_price": 899, "price_var": 80},
    # Laptops
    {"name": "Apple MacBook Air 15\" M3 8GB/256GB", "brand": "Apple", "category": "electronics", "subcategory": "laptops", "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-15-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034", "description": "De MacBook Air 15\" met M3-chip, tot 18 uur batterijduur en een prachtig Liquid Retina-display.", "base_price": 1529, "price_var": 100},
    {"name": "Apple MacBook Pro 14\" M3 Pro 18GB/512GB", "brand": "Apple", "category": "electronics", "subcategory": "laptops", "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054292", "description": "De MacBook Pro 14\" met M3 Pro-chip voor professionele workflows en langdurige batterij.", "base_price": 2449, "price_var": 150},
    {"name": "ASUS Zenbook 14 OLED UX3405", "brand": "ASUS", "category": "electronics", "subcategory": "laptops", "image_url": "https://dlcdnwebimgs.asus.com/gain/7d8b6e5c-4b8c-4c7e-9f8e-5d7c6b8a9f0e/w1000/h732", "description": "De Zenbook 14 OLED met Intel Core Ultra 7, 3K OLED-display en AI-functies.", "base_price": 1199, "price_var": 100},
    {"name": "Lenovo ThinkPad X1 Carbon Gen 12", "brand": "Lenovo", "category": "electronics", "subcategory": "laptops", "image_url": "https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-carbon-gen-12-hero.png", "description": "De ThinkPad X1 Carbon Gen 12 met Intel Core Ultra, 2.8K OLED en ultralicht ontwerp.", "base_price": 1849, "price_var": 150},
    {"name": "Dell XPS 15 9530", "brand": "Dell", "category": "electronics", "subcategory": "laptops", "image_url": "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/notes-xps-15-9530-nt-platinum-silver-hero-500x500.jpg", "description": "De Dell XPS 15 met Intel Core i7, NVIDIA RTX 4050 en InfinityEdge-display.", "base_price": 1699, "price_var": 120},
    {"name": "HP Spectre x360 14", "brand": "HP", "category": "electronics", "subcategory": "laptops", "image_url": "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c084b4b5-6e9e-4c73-8f2e-8e5b6c7d8e9f.jpg", "description": "De HP Spectre x360 14 met 2.8K OLED-touchscreen, Intel Core Ultra 7 en 360-graden scharnier.", "base_price": 1449, "price_var": 100},
    {"name": "Microsoft Surface Laptop 6", "brand": "Microsoft", "category": "electronics", "subcategory": "laptops", "image_url": "https://img-prod-cms-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW1tfXq", "description": "De Surface Laptop 6 met Snapdragon X Elite, touchscreen en AI-integratie.", "base_price": 1199, "price_var": 80},
    # Tablets
    {"name": "Apple iPad Pro 11\" M4 256GB", "brand": "Apple", "category": "electronics", "subcategory": "tablets", "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-model-select-gallery-2-202405?wid=5120&hei=2880&fmt=webp&qlt=70&.v=171408405幽幽", "description": "De iPad Pro 11\" met M4-chip, Ultra Retina XDR-display en Apple Pencil Pro-ondersteuning.", "base_price": 1149, "price_var": 80},
    {"name": "Apple iPad Air 11\" M2 128GB", "brand": "Apple", "category": "electronics", "subcategory": "tablets", "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-model-select-gallery-2-202405?wid=5120&hei=2880&fmt=webp&qlt=70&.v=1714084054059", "description": "De iPad Air met M2-chip, 11\" Liquid Retina-display en ondersteuning voor Apple Pencil Pro.", "base_price": 719, "price_var": 50},
    {"name": "Samsung Galaxy Tab S9 Ultra 256GB", "brand": "Samsung", "category": "electronics", "subcategory": "tablets", "image_url": "https://images.samsung.com/nl/tablets/galaxy-tab-s9/images/galaxy-tab-s9-ultra-highlights-color-graphite-mo.jpg", "description": "De Galaxy Tab S9 Ultra met 14.6\" AMOLED-display, S Pen en waterbestendig ontwerp.", "base_price": 1249, "price_var": 100},
    {"name": "Samsung Galaxy Tab S9 FE 128GB", "brand": "Samsung", "category": "electronics", "subcategory": "tablets", "image_url": "https://images.samsung.com/nl/tablets/galaxy-tab-s9-fe/images/galaxy-tab-s9-fe-highlights-color-gray-mo.jpg", "description": "De Galaxy Tab S9 FE met 10.9\" display, S Pen en lange batterijduur.", "base_price": 489, "price_var": 50},
    {"name": "Lenovo Tab P12 Pro 256GB", "brand": "Lenovo", "category": "electronics", "subcategory": "tablets", "image_url": "https://www.lenovo.com/medias/lenovo-tablet-tab-p12-pro-hero.png", "description": "De Tab P12 Pro met 12.7\" 3K OLED-display, Snapdragon 870 en 4 speakers door JBL.", "base_price": 449, "price_var": 60},
    # Smartwatches
    {"name": "Apple Watch Series 10 46mm", "brand": "Apple", "category": "electronics", "subcategory": "smartwatches", "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/s10-46mm-aluminum-midnight-sport-band-midnight-select-202409?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1725423734389", "description": "De Apple Watch Series 10 met grootste display ooit, dunste ontwerp ooit en geavanceerde gezondheidsfuncties.", "base_price": 489, "price_var": 40},
    {"name": "Apple Watch Ultra 2", "brand": "Apple", "category": "electronics", "subcategory": "smartwatches", "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra-2-hero-select-202409?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1725423734389", "description": "De Apple Watch Ultra 2 voor extreme avonturen met titanium behuizing en 3000 nit display.", "base_price": 899, "price_var": 60},
    {"name": "Samsung Galaxy Watch7 44mm", "brand": "Samsung", "category": "electronics", "subcategory": "smartwatches", "image_url": "https://images.samsung.com/nl/watches/galaxy-watch7/images/galaxy-watch7-highlights-color-green-mo.jpg", "description": "De Galaxy Watch7 met BioActive Sensor, Galaxy AI en geavanceerde slaaptracking.", "base_price": 329, "price_var": 40},
    {"name": "Samsung Galaxy Watch Ultra 47mm", "brand": "Samsung", "category": "electronics", "subcategory": "smartwatches", "image_url": "https://images.samsung.com/nl/watches/galaxy-watch-ultra/images/galaxy-watch-ultra-highlights-color-titanium-gray-mo.jpg", "description": "De Galaxy Watch Ultra met titanium behuizing, 10ATM waterbestendig en langdurige batterij.", "base_price": 649, "price_var": 60},
    {"name": "Garmin Fenix 8 47mm", "brand": "Garmin", "category": "electronics", "subcategory": "smartwatches", "image_url": "https://res.garmin.com/transform/image/upload/b_rgb:FFFFFF,c_pad,dpr_2.0,f_auto,h_400,q_100,w_400/cpad,h_400,w_400/v1/Product_Images/Garmin/fenix8-47mm-amoled-black?pgw=1", "description": "De Garmin Fenix 8 AMOLED met gekleurde kaarten, duikfuncties en led-zaklamp.", "base_price": 999, "price_var": 80},
    {"name": "Garmin Forerunner 965", "brand": "Garmin", "category": "electronics", "subcategory": "smartwatches", "image_url": "https://res.garmin.com/transform/image/upload/b_rgb:FFFFFF,c_pad,dpr_2.0,f_auto,h_400,q_100,w_400/cpad,h_400,w_400/v1/Product_Images/Garmin/forerunner-965-black?pgw=1", "description": "De Forerunner 965 met AMOLED-display, training readiness en triatlon-ondersteuning.", "base_price": 649, "price_var": 60},
    # Headphones
    {"name": "Apple AirPods Pro 2", "brand": "Apple", "category": "electronics", "subcategory": "koptelefoons", "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTJV3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1694014871985", "description": "AirPods Pro 2 met actieve ruisonderdrukking, transparantiemodus en USB-C oplaadcase.", "base_price": 249, "price_var": 30},
    {"name": "Apple AirPods 4", "brand": "Apple", "category": "electronics", "subcategory": "koptelefoons", "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-4-anc-select-202409?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1725502639798", "description": "AirPods 4 met actieve ruisonderdrukking, persoonlijke ruimtelijke audio en USB-C.", "base_price": 199, "price_var": 20},
    {"name": "Sony WH-1000XM5", "brand": "Sony", "category": "electronics", "subcategory": "koptelefoons", "image_url": "https://www.sony.nl/image/5d02da5c1b234d5504d2e48cb9e28bf7?fmt=png-alpha&wid=1000&hei=1000", "description": "De Sony WH-1000XM5 met toonaangevende ruisonderdrukking, 30 uur batterij en hoogwaardig geluid.", "base_price": 349, "price_var": 50},
    {"name": "Bose QuietComfort Ultra Headphones", "brand": "Bose", "category": "electronics", "subcategory": "koptelefoons", "image_url": "https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc-ultra-headphones/product-silo-images/QCUH_Black_PDP_Gallery_Image_1.png/jcr:content/renditions/cq5dam.web.600.600.png", "description": "De QuietComfort Ultra Headphones met CustomTune-technologie en Immersive Audio.", "base_price": 499, "price_var": 60},
    {"name": "Sennheiser Momentum 4 Wireless", "brand": "Sennheiser", "category": "electronics", "subcategory": "koptelefoons", "image_url": "https://assets.sennheiser.com/img/8260/product/momentum_4_wireless_black_01_1.png", "description": "De Momentum 4 Wireless met 60 uur batterij, adaptieve ruisonderdrukking en audiophile kwaliteit.", "base_price": 379, "price_var": 50},
    # TVs
    {"name": "LG OLED C4 55\" 4K Smart TV", "brand": "LG", "category": "electronics", "subcategory": "tvs", "image_url": "https://www.lg.com/nl/images/televisies/md07540791/gallery/OLED55C44LA_01.jpg", "description": "De LG OLED C4 met evo OLED-display, a9 Gen7 AI-processor en 144Hz voor gaming.", "base_price": 1699, "price_var": 150},
    {"name": "LG OLED C4 65\" 4K Smart TV", "brand": "LG", "category": "electronics", "subcategory": "tvs", "image_url": "https://www.lg.com/nl/images/televisies/md07540795/gallery/OLED65C44LA_01.jpg", "description": "De LG OLED C4 65\" met evo OLED-display, a9 Gen7 AI-processor en Dolby Vision.", "base_price": 2499, "price_var": 200},
    {"name": "Samsung Neo QLED 4K 55\" TQ55QN90D", "brand": "Samsung", "category": "electronics", "subcategory": "tvs", "image_url": "https://images.samsung.com/nl/televisions/qled-4k-qn90d/images/qled-4k-qn90d-highlights-color-mo.jpg", "description": "De Samsung Neo QLED 4K QN90D met Neo Quantum HDR+, AI Upscale en 144Hz.", "base_price": 1399, "price_var": 120},
    {"name": "Samsung Neo QLED 4K 65\" TQ65QN90D", "brand": "Samsung", "category": "electronics", "subcategory": "tvs", "image_url": "https://images.samsung.com/nl/televisions/qled-4k-qn90d/images/qled-4k-qn90d-highlights-color-mo.jpg", "description": "De Samsung Neo QLED 4K QN90D 65\" met Neo Quantum HDR+ en 144Hz voor gaming.", "base_price": 1999, "price_var": 180},
    {"name": "Sony Bravia XR A80L 55\" OLED", "brand": "Sony", "category": "electronics", "subcategory": "tvs", "image_url": "https://www.sony.nl/image/5d02da5c1b234d5504d2e48cb9e28bf7?fmt=png-alpha&wid=1000&hei=1000", "description": "De Sony Bravia XR A80L met Cognitive Processor XR, OLED-display en Google TV.", "base_price": 1599, "price_var": 150},
    {"name": "Phil OLED 807 55\" Ambilight TV", "brand": "Philips", "category": "electronics", "subcategory": "tvs", "image_url": "https://www.philips.com/c-dam/b2c/en_GB/catalog/tv/55OLED807_12/global/55OLED807_12-CGI-hero.png", "description": "De Philips OLED 807 met 4-zijdige Ambilight, OLED-display en Bowers & Wilkins-geluid.", "base_price": 1299, "price_var": 130},
    # === HOME ===
    # Stofzuigers
    {"name": "Dyson V15 Detect Absolute", "brand": "Dyson", "category": "home", "subcategory": "stofzuigers", "image_url": "https://www.dyson.nl/medialibrary/Group/PDP_Assets/V15-Detect/V15-Detect-Absolute-PDP-hero.jpg", "description": "De Dyson V15 Detect Absolute met laser-detectietechnologie, 60 minuten looptijd en HEPA-filtratie.", "base_price": 649, "price_var": 70},
    {"name": "Dyson Gen5detect Absolute", "brand": "Dyson", "category": "home", "subcategory": "stofzuigers", "image_url": "https://www.dyson.nl/medialibrary/Group/PDP_Assets/Gen5detect/Gen5detect-Absolute-PDP-hero.jpg", "description": "De Dyson Gen5detect Absolute met HEPA-filtering, 70 minuten looptijd en laserdetectie.", "base_price": 849, "price_var": 90},
    {"name": "Roborock S8 Pro Ultra", "brand": "Roborock", "category": "home", "subcategory": "stofzuigers", "image_url": "https://cdn.roborock.com/web/product/s8-pro-ultra/s8-pro-ultra-hero.png", "description": "De Roborock S8 Pro Ultra met duo-rolborstel, 6000Pa zuigkracht en volledig zelfreinigend dock.", "base_price": 1199, "price_var": 150},
    {"name": "iRobot Roomba Combo j9+", "brand": "iRobot", "category": "home", "subcategory": "stofzuigers", "image_url": "https://www.irobot.nl/dw/image/v2/BFXP_PRD/on/demandware.static/-/Sites-master-catalog-irobot/default/dw8e9c5e8f/images/roomba-combo-j9-plus/roomba-combo-j9-hero.png", "description": "De Roomba Combo j9+ met dweilfunctie, zelf legen en navigeren via SmartScrub.", "base_price": 1399, "price_var": 150},
    {"name": "Miele Triflex HX2 Pro", "brand": "Miele", "category": "home", "subcategory": "stofzuigers", "image_url": "https://www.miele.nl/c/dam/media/product-images/Upgrades/Triflex/HX2-Pro/triflex-hx2-pro-hero.jpg", "description": "De Miele Triflex HX2 Pro met 3-in-1-ontwerp, 120 minuten looptijd en HEPA Lifetime-filter.", "base_price": 549, "price_var": 60},
    # Wasmachines
    {"name": "Miele W1 WSG663 WCS", "brand": "Miele", "category": "home", "subcategory": "wasmachines", "image_url": "https://www.miele.nl/c/dam/media/product-images/washing-machines/wsg663-wcs/wsg663-wcs-hero.jpg", "description": "De Miele W1 WSG663 WCS met 9kg laadvermogen, 1600 toeren en Miele@home-connectiviteit.", "base_price": 1349, "price_var": 120},
    {"name": "Siemens WG44B2040 iQ700", "brand": "Siemens", "category": "home", "subcategory": "wasmachines", "image_url": "https://www.siemens-home.nl/product-images/wg44b2040-iq700-hero.jpg", "description": "De Siemens iQ700 met 9kg laadvermogen, 1400 toeren en i-DOS automatische doseertechnologie.", "base_price": 849, "price_var": 90},
    {"name": "Bosch WAV28EH0NL Serie 8", "brand": "Bosch", "category": "home", "subcategory": "wasmachines", "image_url": "https://www.bosch-home.nl/product-images/wav28eh0nl-serie8-hero.jpg", "description": "De Bosch Serie 8 met 10kg laadvermogen, 1600 toeren en Home Connect.", "base_price": 949, "price_var": 100},
    {"name": "Samsung WW90T936ASE QuickDrive", "brand": "Samsung", "category": "home", "subcategory": "wasmachines", "image_url": "https://images.samsung.com/nl/washers-and-dryers/washing-machine/ww90t936ase/images/ww90t936ase-highlights-mo.jpg", "description": "De Samsung QuickDrive met 9kg, AI Control en AddWash-deur.", "base_price": 799, "price_var": 80},
    # Koelkasten
    {"name": "Samsung Bespoke RL38C776CB1", "brand": "Samsung", "category": "home", "subcategory": "koelkasten", "image_url": "https://images.samsung.com/nl/refrigerators/bespoke-rl38c/images/bespoke-rl38c-highlights-mo.jpg", "description": "De Samsung Bespoke koelkast met SpaceMax-technologie, 387L inhoud en AI Energy Mode.", "base_price": 1199, "price_var": 120},
    {"name": "Bosch KGN39AIAT Serie 6", "brand": "Bosch", "category": "home", "subcategory": "koelkasten", "image_url": "https://www.bosch-home.nl/product-images/kgn39aiat-serie6-hero.jpg", "description": "De Bosch Serie 6 koel-vriescombinatie met NoFrost, VitaFresh en 366L inhoud.", "base_price": 899, "price_var": 90},
    {"name": "Siemens KG39NAIAT iQ500", "brand": "Siemens", "category": "home", "subcategory": "koelkasten", "image_url": "https://www.siemens-home.nl/product-images/kg39naiat-iq500-hero.jpg", "description": "De Siemens iQ500 met hyperFresh, NoFrost en 366L totale inhoud.", "base_price": 1049, "price_var": 100},
    {"name": "Liebherr CNd 5023 Plus", "brand": "Liebherr", "category": "home", "subcategory": "koelkasten", "image_url": "https://www.liebherr.com/nl/media/product-images/cnd-5023-plus/cnd-5023-plus-hero.jpg", "description": "De Liebherr CNd 5023 Plus met EasyFresh-lades, NoFrost en 331L inhoud.", "base_price": 1149, "price_var": 110},
    # Koffiemachines
    {"name": "Sage the Barista Express Impress", "brand": "Sage", "category": "home", "subcategory": "koffiemachines", "image_url": "https://sageappliances.com/nl/media/catalog/product/b/a/barista_express_impress_hero.jpg", "description": "De Barista Express Impress met intelligent dosesysteem, ingebouwde molen en microschuim-textuur.", "base_price": 849, "price_var": 90},
    {"name": "Philips 5400 Series EP5447/90", "brand": "Philips", "category": "home", "subcategory": "koffiemachines", "image_url": "https://www.philips.com/c-dam/b2c/master/experience/consume/coffee/ep5447/ep5447-hero.png", "description": "De Philips 5400 Series met 12 koffievariëteiten, LatteGo-melksysteem en intuïtief touchscreen.", "base_price": 549, "price_var": 70},
    {"name": "De'Longhi Primadonna Soul ECAM610.75.MB", "brand": "De'Longhi", "category": "home", "subcategory": "koffiemachines", "image_url": "https://www.delonghi.com/nl/media/catalog/product/e/c/ecam610.75.mb-hero.jpg", "description": "De Primadonna Soul met Bean Adapt-technologie, 21 recepten en volautomatisch melksysteem.", "base_price": 1399, "price_var": 150},
    {"name": "JURA E8", "brand": "JURA", "category": "home", "subcategory": "koffiemachines", "image_url": "https://nl.jura.com/media/catalog/product/e/8/e8-hero.jpg", "description": "De JURA E8 met Professional Aroma Grinder, 17 specialiteiten en Pulse Extraction Process.", "base_price": 1399, "price_var": 150},
    {"name": "Siemens EQ.900 TQ907R03", "brand": "Siemens", "category": "home", "subcategory": "koffiemachines", "image_url": "https://www.siemens-home.nl/product-images/tq907r03-eq900-hero.jpg", "description": "De Siemens EQ.900 met iAroma System, dubbele bonenmaler en Home Connect.", "base_price": 1649, "price_var": 170},
    # === SPORTS ===
    # Fitnessapparatuur
    {"name": "Peloton Bike+", "brand": "Peloton", "category": "sports", "subcategory": "fitnessapparatuur", "image_url": "https://res.cloudinary.com/peloton/image/upload/f_auto,q_auto,dpr_2.0/v1/products/bike-plus/hero-images/bike-plus-hero.jpg", "description": "De Peloton Bike+ met 23,8\" HD-swivelscherm, automatische weerstand en immersieve workouts.", "base_price": 2495, "price_var": 200},
    {"name": "Concept2 RowErg", "brand": "Concept2", "category": "sports", "subcategory": "fitnessapparatuur", "image_url": "https://concept2.nl/files/images/rower/rowerg/rowerg-hero.jpg", "description": "De Concept2 RowErg roeitrainer met PM5-monitor, luchtwoerstand en inklapbaar ontwerp.", "base_price": 1100, "price_var": 100},
    {"name": "NordicTrack Commercial 1750", "brand": "NordicTrack", "category": "sports", "subcategory": "fitnessapparatuur", "image_url": "https://www.nordictrack.com/cms/app/media/nordictrack/treadmills/commercial-1750/commercial-1750-hero.jpg", "description": "De Commercial 1750 loopband met 14\" HD-touchscreen, auto-incline en iFit-integratie.", "base_price": 2299, "price_var": 250},
    {"name": "Bowflex SelectTech 552i", "brand": "Bowflex", "category": "sports", "subcategory": "fitnessapparatuur", "image_url": "https://www.bowflex.com/dw/image/v2/AAYW_PRD/on/demandware.static/-/Sites-nautilus-master-catalog/default/dw8a9b5e8f/images/bowflex/selecttech/552i/selecttech-552i-hero.jpg", "description": "De Bowflex SelectTech 552i verstelbare dumbbells, vervangen 15 sets gewichten (2-24 kg).", "base_price": 449, "price_var": 50},
    {"name": "Technogym MyRun", "brand": "Technogym", "category": "sports", "subcategory": "fitnessapparatuur", "image_url": "https://www.technogym.com/media/catalog/product/m/y/myrun-hero.jpg", "description": "De Technogym MyRun loopband met compact ontwerp, app-connectiviteit en stille motor.", "base_price": 2490, "price_var": 240},
    {"name": "Garmin Tacx Neo 3M", "brand": "Garmin", "category": "sports", "subcategory": "fitnessapparatuur", "image_url": "https://res.garmin.com/transform/image/upload/b_rgb:FFFFFF,c_pad,dpr_2.0,f_auto,h_400,q_100,w_400/cpad,h_400,w_400/v1/Product_Images/Garmin/tacx-neo-3m?pgw=1", "description": "De Tacx NEO 3M smart trainer met bewegingssimulatie, 2200W weerstand en <1% nauwkeurigheid.", "base_price": 2199, "price_var": 200},
    # Fietsen
    {"name": "VanMoof S5", "brand": "VanMoof", "category": "sports", "subcategory": "fietsen", "image_url": "https://www.vanmoof.com/media/catalog/product/s/5/s5-hero.jpg", "description": "De VanMoof S5 e-bike met automatische versnellingswissel, geïntegreerde verlichting en Turbo Boost.", "base_price": 2498, "price_var": 200},
    {"name": "Cortina E-U4 Transport", "brand": "Cortina", "category": "sports", "subcategory": "fietsen", "image_url": "https://www.cortinafietsen.nl/media/catalog/product/e/-/e-u4-transport-hero.jpg", "description": "De Cortina E-U4 Transport e-bike met middenmotor, 540Wh accu en retro design.", "base_price": 2499, "price_var": 250},
    {"name": "Gazelle Ultimate C380 HMB", "brand": "Gazelle", "category": "sports", "subcategory": "fietsen", "image_url": "https://www.gazelle.nl/media/catalog/product/u/l/ultimate-c380-hmb-hero.jpg", "description": "De Gazelle Ultimate C380 HMB met Enviolo-naaf, Bosch Performance Line CX-motor en 625Wh accu.", "base_price": 4299, "price_var": 350},
    {"name": "Kalkhoff Endeavour 7.B Advance", "brand": "Kalkhoff", "category": "sports", "subcategory": "fietsen", "image_url": "https://www.kalkhoff-bikes.com/media/catalog/product/e/n/endeavour-7b-advance-hero.jpg", "description": "De Kalkhoff Endeavour 7.B Advance met Bosch Smart System, 750Wh accu en fully-ontwerp.", "base_price": 4999, "price_var": 400},
    # Hardloopschoenen
    {"name": "Nike Air Zoom Alphafly NEXT% 3", "brand": "Nike", "category": "sports", "subcategory": "hardloopschoenen", "image_url": "https://static.nike.com/a/images/t_default/0d2c0c0c-4e4e-4e4e-8e0c-0c0c0c0c0c0c/alphafly-next-3-hero.jpg", "description": "De Nike Alphafly NEXT% 3 met ZoomX-schuim, dubbele Air Zoom-units en carbon fiber plaat.", "base_price": 314, "price_var": 30},
    {"name": "Nike Pegasus 41", "brand": "Nike", "category": "sports", "subcategory": "hardloopschoenen", "image_url": "https://static.nike.com/a/images/t_default/1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a/pegasus-41-hero.jpg", "description": "De Nike Pegasus 41 met ReactX-schuim, Air Zoom-eenheden en dagelijkse comfort.", "base_price": 129, "price_var": 20},
    {"name": "ASICS Gel-Nimbus 26", "brand": "ASICS", "category": "sports", "subcategory": "hardloopschoenen", "image_url": "https://www.asics.com/nl/nl-nl/media/catalog/product/g/e/gel-nimbus-26-hero.jpg", "description": "De ASICS Gel-Nimbus 26 met PureGEL-technologie, FF BLAST PLUS ECO-schuim en premium comfort.", "base_price": 190, "price_var": 25},
    {"name": "HOKA Clifton 9", "brand": "HOKA", "category": "sports", "subcategory": "hardloopschoenen", "image_url": "https://www.hoka.com/media/catalog/product/c/l/clifton-9-hero.jpg", "description": "De HOKA Clifton 9 met lichtgewicht demping, ademend bovenwerk en metarocker-geometrie.", "base_price": 150, "price_var": 20},
    {"name": "Adidas Ultraboost Light", "brand": "Adidas", "category": "sports", "subcategory": "hardloopschoenen", "image_url": "https://www.adidas.nl/media/catalog/product/u/l/ultraboost-light-hero.jpg", "description": "De Adidas Ultraboost Light met 30% minder BOOST-materiaal, continental-zool en Primeknit-bovenwerk.", "base_price": 190, "price_var": 30},
    {"name": "New Balance Fresh Foam X 1080 v13", "brand": "New Balance", "category": "sports", "subcategory": "hardloopschoenen", "image_url": "https://www.newbalance.nl/media/catalog/product/f/r/fresh-foam-x-1080-v13-hero.jpg", "description": "De Fresh Foam X 1080 v13 met Fresh Foam X-demping, ademend bovenwerk en comfortabele pasvorm.", "base_price": 170, "price_var": 25},
]


async def create_tables() -> None:
    """Create all database tables if they don't exist."""

    # Enable uuid extension
    await execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")

    # Retailers table
    await execute("""
        CREATE TABLE IF NOT EXISTS retailers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            logo_url TEXT,
            website_url TEXT,
            network TEXT,
            commission_rate DECIMAL(5,2),
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)

    # Products table
    await execute("""
        CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            ean TEXT,
            name TEXT NOT NULL,
            brand TEXT,
            category TEXT,
            subcategory TEXT,
            image_url TEXT,
            description TEXT,
            specifications JSONB,
            slug TEXT NOT NULL UNIQUE,
            meta_title TEXT,
            meta_description TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)

    # Offers table
    await execute("""
        CREATE TABLE IF NOT EXISTS offers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
            retailer_id UUID NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
            price DECIMAL(12,2) NOT NULL,
            shipping_cost DECIMAL(12,2) DEFAULT 0,
            total_price DECIMAL(12,2) NOT NULL,
            product_url TEXT,
            affiliate_url TEXT,
            in_stock BOOLEAN DEFAULT TRUE,
            last_updated TIMESTAMPTZ DEFAULT NOW()
        )
    """)

    # Clicks table
    await execute("""
        CREATE TABLE IF NOT EXISTS clicks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            product_id UUID REFERENCES products(id),
            offer_id UUID REFERENCES offers(id),
            retailer_id UUID REFERENCES retailers(id),
            clicked_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)

    # Full-text search index
    await execute("""
        CREATE INDEX IF NOT EXISTS idx_products_fts ON products 
        USING GIN(to_tsvector('dutch', name || ' ' || COALESCE(brand, '') || ' ' || COALESCE(description, '')))
    """)

    # Other indexes
    await execute("CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)")
    await execute("CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)")
    await execute("CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)")
    await execute("CREATE INDEX IF NOT EXISTS idx_offers_product_id ON offers(product_id)")
    await execute("CREATE INDEX IF NOT EXISTS idx_offers_retailer_id ON offers(retailer_id)")


async def seed_retailers() -> dict[str, uuid.UUID]:
    """Seed retailers and return slug -> id mapping."""
    mapping = {}
    for r in RETAILERS:
        row = await fetchrow(
            """
            INSERT INTO retailers (name, slug, logo_url, website_url, network, commission_rate)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
            """,
            r["name"], r["slug"], r["logo_url"], r["website_url"], r["network"], Decimal(str(r["commission_rate"]))
        )
        mapping[r["slug"]] = row["id"]
    return mapping


import secrets
import string


def _gen_ean() -> str:
    """Generate a random 13-digit EAN."""
    return ''.join(secrets.choice(string.digits) for _ in range(13))


def _slugify(name: str) -> str:
    """Convert product name to URL-friendly slug."""
    import re
    slug = name.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    slug = slug.strip('-')
    # Add random suffix for uniqueness
    suffix = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(6))
    return f"{slug}-{suffix}"


async def seed_products() -> dict[str, uuid.UUID]:
    """Seed products and return slug -> id mapping."""
    mapping = {}
    for p in PRODUCTS:
        slug = _slugify(p["name"])
        ean = _gen_ean()
        meta_title = f"{p['name']} - Vergelijk prijzen | DealRadar.fit"
        meta_description = p["description"][:155] if p["description"] else None
        row = await fetchrow(
            """
            INSERT INTO products (ean, name, brand, category, subcategory, image_url, description, specifications, slug, meta_title, meta_description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (slug) DO NOTHING
            RETURNING id
            """,
            ean, p["name"], p["brand"], p["category"], p["subcategory"],
            p["image_url"], p["description"], None, slug, meta_title, meta_description
        )
        if row:
            mapping[slug] = row["id"]
    return mapping


async def seed_offers(product_map: dict[str, uuid.UUID], retailer_map: dict[str, uuid.UUID]) -> None:
    """Seed offers for each product at 3-5 retailers with realistic price variations."""
    import random
    import secrets

    retailer_slugs = list(retailer_map.keys())

    for slug, product_id in product_map.items():
        # Find the product base price
        product_data = next((p for p in PRODUCTS if _slugify(p["name"]).startswith(p["name"].lower().replace(' ', '-')[:20])), None)
        # Match by finding the product in our list
        matched = None
        for p in PRODUCTS:
            test_slug = _slugify(p["name"])
            if test_slug == slug:
                matched = p
                break
        if matched is None:
            # Try partial match
            for p in PRODUCTS:
                if slug.startswith(p["name"].lower().replace(' ', '-')[:30]):
                    matched = p
                    break

        if matched is None:
            base_price = 500
            price_var = 50
        else:
            base_price = matched["base_price"]
            price_var = matched["price_var"]

        # Select 3-5 random retailers for this product
        num_offers = random.randint(3, 5)
        selected_retailers = random.sample(retailer_slugs, min(num_offers, len(retailer_slugs)))

        # Sort by price (cheapest first) for badge assignment
        offers_data = []
        for rslug in selected_retailers:
            retailer_id = retailer_map[rslug]
            # Generate price with variation
            variation = random.uniform(-price_var * 0.4, price_var * 0.6)
            price = round(base_price + variation, 2)
            if price < base_price * 0.7:
                price = round(base_price * 0.7, 2)
            shipping = 0 if price > 500 or rslug in ["amazon-de", "amazon-nl", "bol-com"] else round(random.uniform(3.99, 9.99), 2)
            total = round(price + shipping, 2)
            product_url = f"https://www.{rslug.replace('-', '')}.nl/product/{slug}"
            affiliate_url = f"https://www.awin1.com/awclick.php?mid={random.randint(100,999)}&id=affiliate&p={product_url}"
            in_stock = random.random() > 0.1  # 90% in stock
            last_updated = "NOW() - INTERVAL '{} minutes'".format(random.randint(5, 2880))

            offers_data.append({
                "retailer_id": retailer_id,
                "price": Decimal(str(price)),
                "shipping": Decimal(str(shipping)),
                "total": Decimal(str(total)),
                "product_url": product_url,
                "affiliate_url": affiliate_url,
                "in_stock": in_stock,
            })

        # Sort by price for badge assignment
        offers_data.sort(key=lambda x: x["total"])

        for i, od in enumerate(offers_data):
            badge = "cheapest" if i == 0 else None
            await execute(
                """
                INSERT INTO offers (product_id, retailer_id, price, shipping_cost, total_price, product_url, affiliate_url, in_stock, last_updated)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '{} minutes')
                """.format(random.randint(5, 2880)),
                product_id, od["retailer_id"], od["price"], od["shipping"], od["total"],
                od["product_url"], od["affiliate_url"], od["in_stock"]
            )


async def seed_all() -> dict:
    """Run the full seed process."""
    await create_tables()
    retailer_map = await seed_retailers()

    # Seed products one by one to get proper slug mapping
    product_map = {}
    for p in PRODUCTS:
        slug = _slugify(p["name"])
        ean = _gen_ean()
        meta_title = f"{p['name']} - Vergelijk prijzen | DealRadar.fit"
        meta_description = p["description"][:155] if p["description"] else None
        row = await fetchrow(
            """
            INSERT INTO products (ean, name, brand, category, subcategory, image_url, description, specifications, slug, meta_title, meta_description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
            RETURNING id
            """,
            ean, p["name"], p["brand"], p["category"], p["subcategory"],
            p["image_url"], p["description"], None, slug, meta_title, meta_description
        )
        if row:
            product_map[slug] = row["id"]

    await seed_offers(product_map, retailer_map)

    return {
        "retailers_seeded": len(retailer_map),
        "products_seeded": len(product_map),
        "offers_seeded": len(product_map) * 4,  # approximate
    }
