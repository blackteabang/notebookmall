import React, { createContext, useState, useContext, useEffect } from 'react';

// 상품 관련 전역 상태를 관리하는 Context 파일입니다.
// 상품 목록, 로딩 상태를 관리하며 상품 추가/수정/삭제 기능을 제공합니다.

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // products: 전체 상품 목록을 담는 배열
  // loading: 데이터를 불러오는 중인지 여부를 나타내는 상태값
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 백엔드 API(/api/products)를 호출하여 전체 상품 데이터를 가져옵니다.
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 컴포넌트 마운트 시 최초 1회 상품 목록을 가져옵니다.
  useEffect(() => {
    fetchProducts();
  }, []);

  // 관리자 대시보드에서 새로운 상품을 등록할 때 호출됩니다.
  const addProduct = async (newProduct) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (response.ok) {
        // 추가 성공 시 전체 상품 목록을 다시 불러와 최신 상태를 유지합니다.
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  // 관리자 대시보드에서 기존 상품의 정보를 수정할 때 호출됩니다.
  const updateProduct = async (updatedProduct) => {
    try {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (response.ok) {
        // 수정 성공 시 최신 상품 목록 재조회
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  // 관리자 대시보드에서 특정 상품을 삭제할 때 호출됩니다.
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // 삭제 성공 시 최신 상품 목록 재조회
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  // 애플리케이션 하위 컴포넌트에서 Context 값을 사용할 수 있도록 Provider로 감싸 반환합니다.
  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

// 다른 파일에서 손쉽게 Context에 접근하기 위한 커스텀 훅
export const useProducts = () => useContext(ProductContext);
