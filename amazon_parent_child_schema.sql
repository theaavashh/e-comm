-- Amazon-Style Parent-Child Variant Schema Design
-- Based on Amazon's parent-child ASIN relationship model

-- 1. Enhanced Product model with parent-child support
ALTER TABLE products 
ADD COLUMN parentAsin VARCHAR(20),
ADD COLUMN variationTheme VARCHAR(50),
ADD COLUMN isParentProduct BOOLEAN DEFAULT FALSE,
ADD COLUMN isChildProduct BOOLEAN DEFAULT FALSE,
ADD COLUMN parentProductId VARCHAR(20) REFERENCES products(id);

-- 2. Parent Product table (non-buyable container)
CREATE TABLE parent_products (
    id VARCHAR(20) PRIMARY KEY, -- Parent ASIN
    productId VARCHAR(20) NOT NULL REFERENCES products(id),
    variationTheme VARCHAR(50) NOT NULL, -- Size, Color, SizeColor, etc.
    brandName VARCHAR(255) NOT NULL,
    productName VARCHAR(255) NOT NULL,
    description TEXT,
    seoTitle VARCHAR(255),
    seoDescription TEXT,
    images TEXT[], -- Shared product images
    thumbnail VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Child Product table (buyable variants)
CREATE TABLE child_products (
    id VARCHAR(20) PRIMARY KEY, -- Child ASIN
    parentAsin VARCHAR(20) NOT NULL REFERENCES parent_products(id),
    productId VARCHAR(20) NOT NULL REFERENCES products(id),
    sku VARCHAR(100) UNIQUE NOT NULL,
    upc VARCHAR(20),
    ean VARCHAR(20),
    variationTheme VARCHAR(50) NOT NULL,
    
    -- Variation-specific attributes
    size VARCHAR(50),
    color VARCHAR(50),
    material VARCHAR(100),
    flavor VARCHAR(100),
    scent VARCHAR(100),
    style VARCHAR(100),
    pattern VARCHAR(100),
    fit VARCHAR(50),
    length VARCHAR(50),
    width VARCHAR(50),
    height VARCHAR(50),
    weight VARCHAR(50),
    quantity VARCHAR(50),
    packageQuantity VARCHAR(50),
    
    -- Pricing and inventory
    price DECIMAL(10,2) NOT NULL,
    comparePrice DECIMAL(10,2),
    costPrice DECIMAL(10,2),
    quantity INT DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    isBuyable BOOLEAN DEFAULT TRUE,
    
    -- Physical attributes
    weight DECIMAL(8,2),
    height DECIMAL(8,2),
    width DECIMAL(8,2),
    length DECIMAL(8,2),
    dimensions JSONB,
    
    -- Images specific to this variant
    images TEXT[],
    thumbnail VARCHAR(255),
    
    -- SEO and marketing
    seoTitle VARCHAR(255),
    seoDescription TEXT,
    colorCode VARCHAR(7), -- HEX color code for color variants
    
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Variation Themes allowed (Amazon-compliant)
CREATE TABLE variation_themes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100),
    isActive BOOLEAN DEFAULT TRUE
);

-- Insert common Amazon variation themes
INSERT INTO variation_themes (name, category) VALUES
('Size', 'General'),
('Color', 'General'),
('SizeColor', 'General'),
('ColorSize', 'General'),
('Material', 'General'),
('Style', 'General'),
('Scent', 'Beauty'),
('Flavor', 'Food'),
('Pattern', 'Clothing'),
('Fit', 'Clothing'),
('Length', 'Clothing'),
('Quantity', 'General'),
('PackageQuantity', 'General'),
('Volume', 'General'),
('Weight', 'General'),
('Size-Material', 'General'),
('Color-Material', 'General');

-- 5. Variant relationships and combinations
CREATE TABLE variant_combinations (
    id SERIAL PRIMARY KEY,
    parentAsin VARCHAR(20) NOT NULL REFERENCES parent_products(id),
    childAsin VARCHAR(20) NOT NULL REFERENCES child_products(id),
    combinationKey VARCHAR(255) NOT NULL, -- e.g., "Large-Red" or "XL-Cotton"
    size VARCHAR(50),
    color VARCHAR(50),
    material VARCHAR(50),
    additionalAttributes JSONB,
    position INTEGER DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE
);

-- 6. Product reviews shared across variations
CREATE TABLE variant_reviews (
    id SERIAL PRIMARY KEY,
    parentAsin VARCHAR(20) NOT NULL REFERENCES parent_products(id),
    childAsin VARCHAR(20) REFERENCES child_products(id), -- Can be NULL if review is for parent
    userId VARCHAR(20) NOT NULL REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    images TEXT[],
    verifiedPurchase BOOLEAN DEFAULT FALSE,
    helpfulCount INTEGER DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Search and SEO optimization for variations
CREATE TABLE variant_search_attributes (
    id SERIAL PRIMARY KEY,
    childAsin VARCHAR(20) NOT NULL REFERENCES child_products(id),
    attributeKey VARCHAR(100) NOT NULL,
    attributeValue TEXT NOT NULL,
    isSearchable BOOLEAN DEFAULT TRUE,
    isFilterable BOOLEAN DEFAULT TRUE,
    position INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_parent_products_variationTheme ON parent_products(variationTheme);
CREATE INDEX idx_child_products_parentAsin ON child_products(parentAsin);
CREATE INDEX idx_child_products_variationTheme ON child_products(variationTheme);
CREATE INDEX idx_child_products_size ON child_products(size);
CREATE INDEX idx_child_products_color ON child_products(color);
CREATE INDEX idx_variant_combinations_parentAsin ON variant_combinations(parentAsin);
CREATE INDEX idx_variant_combinations_combinationKey ON variant_combinations(combinationKey);
CREATE INDEX idx_variant_reviews_parentAsin ON variant_reviews(parentAsin);
CREATE INDEX idx_variant_search_attributes_childAsin ON variant_search_attributes(childAsin);

-- Views for common queries
CREATE VIEW parent_child_view AS
SELECT 
    pp.id as parentAsin,
    pp.productName,
    pp.variationTheme,
    cp.id as childAsin,
    cp.sku,
    cp.price,
    cp.size,
    cp.color,
    cp.material,
    cp.quantity,
    cp.isActive as isChildActive,
    pp.isActive as isParentActive
FROM parent_products pp
LEFT JOIN child_products cp ON pp.id = cp.parentAsin
WHERE pp.isActive = TRUE;