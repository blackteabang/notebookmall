import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = 5001;

app.use(express.json());

// MySQL 데이터베이스 연결을 위한 Connection Pool 객체
// Pool을 사용하면 매번 연결을 생성하지 않고 재사용하여 성능을 높일 수 있습니다.
let pool;

// 애플리케이션 시작 시 데이터베이스와 테이블을 초기화하는 함수
async function initDB() {
  try {
    // 1. MySQL 서버에 접속 (데이터베이스 지정 없이 접속하여 생성하기 위함)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    // 지정된 이름의 데이터베이스가 없으면 새로 생성합니다.
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'notebook_mall'}\`;`);
    await connection.end(); // 임시 연결 종료

    // 2. 생성된 데이터베이스를 바라보는 Connection Pool 생성
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'notebook_mall',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // 3. 테이블 생성 로직
    // 상품 정보를 저장하는 products 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(50),
        basePrice INT,
        stock INT,
        initialStock INT,
        images JSON,
        specs TEXT,
        rating FLOAT,
        inspectionPoints JSON,
        marketingDesc TEXT,
        detailedSpecs JSON,
        status VARCHAR(50) DEFAULT '판매중',
        manufacturerLink VARCHAR(500)
      )
    `);

    try {
      await pool.query('ALTER TABLE products ADD COLUMN status VARCHAR(50) DEFAULT "판매중"');
    } catch (e) {}
    
    try {
      await pool.query('ALTER TABLE products ADD COLUMN manufacturerLink VARCHAR(500)');
    } catch (e) {}

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        date DATE,
        status VARCHAR(50),
        buyerInfo JSON,
        items JSON,
        paymentMethod VARCHAR(50),
        totalAmount INT,
        coordinatorCode VARCHAR(50)
      )
    `);

    // 4. 초기 더미 데이터 삽입 (Seeding)
    // 개발 편의를 위해 테이블이 비어있을 경우에만 초기 상품 데이터를 자동으로 넣어줍니다.
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      const initialProducts = [
        {
          name: "LG전자 2026 그램 프로17 17Z90U-GU7CK",
          price: "2,490,000",
          basePrice: 2490000,
          stock: 3,
          initialStock: 10,
          images: JSON.stringify(["https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=800"]),
          specs: "Intel Core Ultra 7 / 32GB RAM / 2TB SSD / Win 11 Home / 17-inch IPS Display",
          rating: 4.9,
          inspectionPoints: JSON.stringify([
            "2026년 최신형 그램 프로 17, 미개봉급 S리퍼 상태입니다.",
            "울트라7 프로세서와 32GB 대용량 메모리로 압도적 성능.",
            "2TB 초고속 SSD로 저장공간 걱정 없는 풀패키지 사양."
          ]),
          marketingDesc: "<p>✔️ \"Intel Core Ultra 7 프로세서로 AI 작업부터 고성능 업무까지 완벽하게.\"</p><p>⚡ \"17인치 대화면을 담고도 믿기지 않는 가벼움, 프로의 생산성을 경험하세요.\"</p>",
          detailedSpecs: JSON.stringify([
            { label: "프로세서", value: "Intel® Core™ Ultra 7 Processor (AI 가속기 탑재)" },
            { label: "메모리", value: "32GB LPDDR5x (온보드)" },
            { label: "저장공간", value: "2TB NVMe SSD (듀얼 슬롯 확장 가능)" },
            { label: "디스플레이", value: "43.1cm(17인치) WQXGA+ (2880x1800) IPS LCD" }
          ])
        },
        {
          name: "Apple MacBook Air 13 M2",
          price: "1,250,000",
          basePrice: 1250000,
          stock: 5,
          initialStock: 8,
          images: JSON.stringify(["https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?auto=format&fit=crop&q=80&w=400"]),
          specs: "8GB / 256GB SSD / Liquid Retina",
          rating: 4.8,
          inspectionPoints: JSON.stringify([
            "생활 기스가 다소 있지만 매우 깨끗한 상태",
            "배터리 효율 90% 이상 유지 중",
            "정품 박스 및 충전기 포함"
          ]),
          marketingDesc: "<p>휴대성과 성능을 모두 잡은 M2 칩 탑재 맥북 에어.</p>",
          detailedSpecs: JSON.stringify([
            { label: "프로세서", value: "Apple M2 칩 (8코어 CPU 및 8코어 GPU)" },
            { label: "메모리", value: "8GB 통합 메모리" },
            { label: "저장공간", value: "256GB SSD" },
            { label: "디스플레이", value: "13.6인치 Liquid Retina 디스플레이" }
          ])
        }
      ];

      for (const p of initialProducts) {
        await pool.query(
          `INSERT INTO products (name, price, basePrice, stock, initialStock, images, specs, rating, inspectionPoints, marketingDesc, detailedSpecs) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.name, p.price, p.basePrice, p.stock, p.initialStock, p.images, p.specs, p.rating, p.inspectionPoints, p.marketingDesc, p.detailedSpecs]
        );
      }
      console.log('Seeded initial products data.');
    }
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
  }
}

initDB();

// --- Products(상품) API Routes ---

// GET /api/products: 데이터베이스에서 모든 상품 목록을 가져옵니다.
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    // Parse JSON fields back to objects/arrays for frontend
    const products = rows.map(p => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
      inspectionPoints: typeof p.inspectionPoints === 'string' ? JSON.parse(p.inspectionPoints) : p.inspectionPoints,
      detailedSpecs: typeof p.detailedSpecs === 'string' ? JSON.parse(p.detailedSpecs) : p.detailedSpecs
    }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products: 새로운 상품을 데이터베이스에 등록합니다.
app.post('/api/products', async (req, res) => {
  try {
    const p = req.body;
    const [result] = await pool.query(
      `INSERT INTO products (name, price, basePrice, stock, initialStock, images, specs, rating, inspectionPoints, marketingDesc, detailedSpecs, status, manufacturerLink) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.name, p.price, p.basePrice, p.stock, p.initialStock, 
        JSON.stringify(p.images || []), p.specs, p.rating, 
        JSON.stringify(p.inspectionPoints || []), p.marketingDesc, 
        JSON.stringify(p.detailedSpecs || []), p.status || '판매중', p.manufacturerLink || ''
      ]
    );
    res.json({ ...p, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id: 기존 상품 정보를 수정합니다.
app.put('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const p = req.body;
    await pool.query(
      `UPDATE products SET 
       name=?, price=?, basePrice=?, stock=?, initialStock=?, 
       images=?, specs=?, rating=?, inspectionPoints=?, marketingDesc=?, detailedSpecs=?, status=?, manufacturerLink=? 
       WHERE id=?`,
      [
        p.name, p.price, p.basePrice, p.stock, p.initialStock, 
        JSON.stringify(p.images || []), p.specs, p.rating, 
        JSON.stringify(p.inspectionPoints || []), p.marketingDesc, 
        JSON.stringify(p.detailedSpecs || []), p.status || '판매중', p.manufacturerLink || '', id
      ]
    );
    res.json({ ...p, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await pool.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Orders(주문) API Routes ---

// GET /api/orders: 관리자 페이지 등에서 사용할 전체 주문 내역을 최신순으로 가져옵니다.
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY date DESC');
    const orders = rows.map(o => {
      // MySQL Date objects to string
      const dateStr = o.date ? new Date(o.date).toISOString().split('T')[0] : null;
      return {
        ...o,
        date: dateStr,
        buyerInfo: typeof o.buyerInfo === 'string' ? JSON.parse(o.buyerInfo) : o.buyerInfo,
        items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
      };
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders: 사용자가 결제를 완료했을 때 새로운 주문을 생성합니다.
app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    const id = `ORD-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const status = '결제대기';
    
    await pool.query(
      `INSERT INTO orders (id, date, status, buyerInfo, items, paymentMethod, totalAmount, coordinatorCode) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, date, status, 
        JSON.stringify(order.buyerInfo || {}), 
        JSON.stringify(order.items || []), 
        order.paymentMethod, order.totalAmount, order.coordinatorCode || null
      ]
    );
    
    res.json({ ...order, id, date, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/status: 관리자 페이지에서 주문 처리 상태(처리전/입금확인/배송완료)를 변경할 때 사용합니다.
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    await pool.query('UPDATE orders SET status=? WHERE id=?', [status, id]);
    res.json({ id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`B2B Mall API Server running on http://localhost:${PORT}`);
});
