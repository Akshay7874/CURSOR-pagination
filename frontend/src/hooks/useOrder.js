// frontend/src/hooks/useOrders.js
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

const fetchOrders = async ({ pageParam = null }) => {
    const { data } = await axios.get('http://localhost:3001/orders', {
        params: { cursor: pageParam, limit: 50, sort: 'createdAt', sortDirection: 'asc' },
    });
    console.log(data)
    return data;
};

export const useOrders = () => {
    return useInfiniteQuery('orders', fetchOrders, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
};
