import React, { useState, useEffect } from 'react';
import { getSales } from '../api';

const SalesTable = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const limit = 20;

    useEffect(() => {
        loadSales();
    }, [page]);

    const loadSales = async () => {
        try {
            setLoading(true);
            const res = await getSales(page * limit, limit);
            setSales(res.data);
        } catch (err) {
            console.error("Failed to fetch sales", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="title" style={{ fontSize: '1.25rem' }}>Raw Sales Data</h3>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Page {page + 1}</span>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Gender</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale, i) => (
                            <tr key={sale.transaction_id || i}>
                                <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{sale.transaction_id}</td>
                                <td>{new Date(sale.date).toLocaleDateString()}</td>
                                <td>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        backgroundColor: sale.product_category === 'Electronics' ? '#e0f2fe' :
                                            sale.product_category === 'Beauty' ? '#fce7f3' : '#f1f5f9',
                                        color: sale.product_category === 'Electronics' ? '#0369a1' :
                                            sale.product_category === 'Beauty' ? '#be185d' : '#475569'
                                    }}>
                                        {sale.product_category}
                                    </span>
                                </td>
                                <td>{sale.quantity}</td>
                                <td style={{ fontWeight: 600 }}>${sale.total_amount}</td>
                                <td>{sale.gender}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                    className="btn"
                    style={{ backgroundColor: '#f1f5f9', color: '#475569' }}
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                >
                    Previous
                </button>
                <button
                    className="btn"
                    style={{ backgroundColor: '#f1f5f9', color: '#475569' }}
                    disabled={sales.length < limit}
                    onClick={() => setPage(p => p + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default SalesTable;
