import React from 'react';
import { useInfiniteQuery } from 'react-query';
import { FixedSizeList as List } from 'react-window';
import axios from 'axios';
import { throttle } from 'lodash'; // Add this import

const THROTTLE_WAIT = 300; // milliseconds
const BATCH_SIZE = 20;

const fetchOrders = async ({ pageParam = 0 }) => {
    const { data } = await axios.get('https://cursor-pagination.onrender.com/orders', {
        params: {
            skip: pageParam * BATCH_SIZE,
            limit: BATCH_SIZE,
            sort: 'createdAt',
            sortDirection: 'asc',
        },
    });
    return data;
};

const VirtualTable = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery('orders', fetchOrders, {
        getNextPageParam: (lastPage, pages) => {
            return lastPage.data.length === BATCH_SIZE ? pages.length : undefined;
        },
    });

    const orders = data?.pages.flatMap((page) => page.data) ?? [];

    const throttledLoadMore = React.useMemo(
        () =>
            throttle(() => {
                if (!isFetchingNextPage && hasNextPage) {
                    fetchNextPage();
                }
            }, THROTTLE_WAIT),
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );


    const handleScroll = ({ visibleStopIndex }) => {
        if (visibleStopIndex > orders.length - BATCH_SIZE / 2) {
            throttledLoadMore();
        }
    };

    React.useEffect(() => {
        return () => {
            throttledLoadMore.cancel();
        };
    }, [throttledLoadMore]);


    const renderRow = ({ index, style }) => {
        const order = orders[index];
        if (!order) return null;

        return (
            <div style={style} className="row" key={order._id} role="row">
                <div style={{ width: '25%', padding: '8px' }}>{order.customerName}</div>
                <div style={{ width: '25%', padding: '8px' }}>{order.orderAmount.toFixed(2)}</div>
                <div style={{ width: '25%', padding: '8px' }}>{order.status}</div>
                <div style={{ width: '25%', padding: '8px' }}>
                    {new Date(order.createdAt).toLocaleString()}
                </div>
            </div>
        );
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
                <div style={{ width: '25%', padding: '8px' }}>Customer Name</div>
                <div style={{ width: '25%', padding: '8px' }}>Order Amount</div>
                <div style={{ width: '25%', padding: '8px' }}>Status</div>
                <div style={{ width: '25%', padding: '8px' }}>Created At</div>
            </div>
            <List
                height={window.innerHeight - 100} // Subtract header height

                itemCount={orders.length}
                itemSize={50}
                onItemsRendered={handleScroll}
                width="100%"
            >
                {renderRow}
            </List>

            {isFetchingNextPage && <div>Loading more...</div>}
        </div>
    );
};

export default VirtualTable;
