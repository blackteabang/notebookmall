import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;
const DATA_FILE = path.join(__dirname, 'products.json');

app.use(express.json());

// Helper to read data
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = [
      {
        id: 1,
        name: "LG전자 2026 그램 프로17 17Z90U-GU7CK",
        price: "2,490,000",
        basePrice: 2490000,
        stock: 3,
        initialStock: 10,
        images: ["https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=800"],
        specs: "Intel Core Ultra 7 / 32GB RAM / 2TB SSD / Win 11 Home / 17-inch IPS Display",
        rating: 4.9,
        inspectionPoints: [
          "2026년 최신형 그램 프로 17, 미개봉급 S리퍼 상태입니다.",
          "울트라7 프로세서와 32GB 대용량 메모리로 압도적 성능.",
          "2TB 초고속 SSD로 저장공간 걱정 없는 풀패키지 사양."
        ],
        marketingDesc: "<p>✔️ \"Intel Core Ultra 7 프로세서로 AI 작업부터 고성능 업무까지 완벽하게.\"</p><p>⚡ \"17인치 대화면을 담고도 믿기지 않는 가벼움, 프로의 생산성을 경험하세요.\"</p>",
        detailedSpecs: [
          { label: "프로세서", value: "Intel® Core™ Ultra 7 Processor (AI 가속기 탑재)" },
          { label: "메모리", value: "32GB LPDDR5x (온보드)" },
          { label: "저장공간", value: "2TB NVMe SSD (듀얼 슬롯 확장 가능)" },
          { label: "디스플레이", value: "43.1cm(17인치) WQXGA+ (2880x1800) IPS LCD" }
        ]
      },
      {
        id: 2,
        name: "Apple MacBook Air 13 M2",
        price: "1,250,000",
        basePrice: 1250000,
        stock: 5,
        initialStock: 8,
        images: ["https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?auto=format&fit=crop&q=80&w=400"],
        specs: "8GB / 256GB SSD / Liquid Retina",
        rating: 4.8,
        inspectionPoints: [
          "생활 기스가 다소 있지만 매우 깨끗한 상태",
          "배터리 효율 90% 이상 유지 중",
          "정품 박스 및 충전기 포함"
        ],
        marketingDesc: "<p>휴대성과 성능을 모두 잡은 M2 칩 탑재 맥북 에어.</p>",
        detailedSpecs: [
          { label: "프로세서", value: "Apple M2 칩 (8코어 CPU 및 8코어 GPU)" },
          { label: "메모리", value: "8GB 통합 메모리" },
          { label: "저장공간", value: "256GB SSD" },
          { label: "디스플레이", value: "13.6인치 Liquid Retina 디스플레이" }
        ]
      }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

// Helper to write data
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/products', (req, res) => {
  res.json(readData());
});

app.post('/api/products', (req, res) => {
  const products = readData();
  const newProduct = { ...req.body, id: Date.now() };
  products.push(newProduct);
  writeData(products);
  res.json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readData();
  const id = Number(req.params.id);
  const index = products.findIndex(p => Number(p.id) === id);
  if (index !== -1) {
    products[index] = { ...req.body, id: id };
    writeData(products);
    console.log(`Product ${id} updated successfully`);
    res.json(products[index]);
  } else {
    console.error(`Product ${id} not found for update`);
    res.status(404).json({ message: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  let products = readData();
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  writeData(products);
  res.json({ message: 'Product deleted' });
});

app.listen(PORT, () => {
  console.log(`B2B Mall API Server running on http://localhost:${PORT}`);
});
