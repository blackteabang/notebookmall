import React, { createContext, useState, useContext, useEffect } from 'react';

// 주문 관련 전역 상태를 관리하는 Context 파일입니다.
// 애플리케이션 어디서든 주문 데이터를 조회하고 추가, 수정할 수 있도록 도와줍니다.

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // orders: 전체 주문 목록을 담는 배열
  // loading: 데이터를 불러오는 중인지 여부를 나타내는 상태값
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 백엔드 API(/api/orders)를 호출하여 전체 주문 내역을 가져옵니다.
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false); // 성공 여부와 상관없이 로딩 상태 종료
    }
  };

  // 컴포넌트가 처음 화면에 렌더링될 때 한 번만 주문 데이터를 가져옵니다.
  useEffect(() => {
    fetchOrders();
  }, []);

  // 새로운 주문을 서버에 등록하고, 성공 시 로컬 상태(orders)에도 추가합니다.
  const addOrder = async (orderData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (response.ok) {
        const newOrder = await response.json();
        // 기존 주문 목록에 새 주문을 추가 (불변성 유지)
        setOrders([...orders, newOrder]);
        return newOrder;
      }
    } catch (error) {
      console.error('Failed to add order:', error);
    }
  };

  // 관리자 페이지에서 주문 처리 상태(입금확인, 배송완료 등)를 변경할 때 호출됩니다.
  const updateOrderStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        // 로컬 상태(orders) 중 해당 주문(id)을 찾아 상태값(status)을 덮어씌웁니다.
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        return true;
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
    return false;
  };

  // 하위 컴포넌트들이 위에서 정의한 상태와 함수들을 사용할 수 있도록 제공(Provide)합니다.
  return (
    <OrderContext.Provider value={{ orders, loading, fetchOrders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

// 다른 컴포넌트에서 쉽게 OrderContext를 사용할 수 있게 해주는 커스텀 훅입니다.
export const useOrders = () => useContext(OrderContext);
