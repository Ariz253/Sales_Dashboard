import React, { useState } from 'react';

const FilterBar = ({ onFilter, loading }) => {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        gender: 'all',
        category: '', // Simple select for now, could be multi-select if needed
        ageMin: '',
        ageMax: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Clean up empty values
        const cleanFilters = {};
        Object.keys(filters).forEach(key => {
            if (filters[key] !== '') {
                if (key === 'category') {
                    if (filters[key] !== 'all') cleanFilters.categories = [filters.category];
                } else {
                    cleanFilters[key] = filters[key];
                }
            }
        });
        onFilter(cleanFilters);
    };

    return (
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filters</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minWidth: '150px' }}>
                    <label style={{ fontSize: '0.8rem', marginBottom: '0.375rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Date Range</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleChange}
                            style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', width: '100%', color: '#334155' }}
                        />
                        <span style={{ color: '#94a3b8' }}>—</span>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleChange}
                            style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', width: '100%', color: '#334155' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '120px' }}>
                    <label style={{ fontSize: '0.8rem', marginBottom: '0.375rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Gender</label>
                    <select
                        name="gender"
                        value={filters.gender}
                        onChange={handleChange}
                        style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', width: '100%', color: '#334155' }}
                    >
                        <option value="all">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
                    <label style={{ fontSize: '0.8rem', marginBottom: '0.375rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Product Category</label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleChange}
                        style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', width: '100%', color: '#334155' }}
                    >
                        <option value="all">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Beauty">Beauty</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: '140px' }}>
                    <label style={{ fontSize: '0.8rem', marginBottom: '0.375rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Age Range</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            type="number"
                            name="ageMin"
                            value={filters.ageMin}
                            onChange={handleChange}
                            placeholder="Min"
                            style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', width: '60px', color: '#334155' }}
                        />
                        <span style={{ color: '#94a3b8' }}>-</span>
                        <input
                            type="number"
                            name="ageMax"
                            value={filters.ageMax}
                            onChange={handleChange}
                            placeholder="Max"
                            style={{ padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', width: '60px', color: '#334155' }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ height: '38px', marginLeft: 'auto' }}
                >
                    {loading ? 'Analyzing...' : 'Apply Filters'}
                </button>
            </form>
        </div>
    );
};

export default FilterBar;
