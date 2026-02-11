import React, { useState, useEffect } from 'react';
import { runAnalytics, getReports } from './api';
import SalesTable from './components/SalesTable';
import FilterBar from './components/FilterBar';
import ChartModal from './components/ChartModal';
import {
  CategoryBarChart,
  DailySalesLineChart,
  GenderDoughnutChart,
  AgeGroupPieChart,
  AgeSpendingChart,
} from './components/AnalyticsCharts';
import { TrendingUp, DollarSign, ShoppingBag, Maximize2 } from 'lucide-react';
import { format } from 'date-fns';

// Wrapper component for Cards with Maximize functionality
const ChartCard = ({ title, onMaximize, children }) => (
  <div className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      {/* Some charts have titles built-in, but we can standardize header here if desired. 
           For now, we rely on the chart's own title or passed title, but we need the maximize button. 
           We'll float the maximize button top-right. */}
      <div style={{ flex: 1 }}></div> {/* Spacer */}
      <button
        className="maximize-btn"
        onClick={onMaximize}
        title="Maximize Chart"
      >
        <Maximize2 size={18} />
      </button>
    </div>
    <div style={{ flex: 1, minHeight: 0 }}>
      {children}
    </div>
  </div>
);


function App() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // State for Chart Modal
  const [expandedChart, setExpandedChart] = useState(null);

  // Load latest report on mount
  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
      const res = await getReports();
      if (res.data && res.data.length > 0) {
        setMetrics(res.data[0]);
        setLastUpdated(new Date(res.data[0].date_generated));
      }
    } catch (err) {
      console.error("No reports found", err);
    }
  };

  const handleFilter = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await runAnalytics(filters);
      setMetrics(res.data.metrics);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to run analytics. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Render the expanded chart in the modal
  const renderExpandedChart = () => {
    if (!metrics || !expandedChart) return null;

    switch (expandedChart) {
      case 'category':
        return <CategoryBarChart data={metrics} />;
      case 'daily':
        return <DailySalesLineChart data={metrics} />;
      case 'age':
        return <AgeGroupPieChart data={metrics} />;
      case 'gender':
        return <GenderDoughnutChart data={metrics} />;
      case 'age_spending':
        return <AgeSpendingChart data={metrics} />;
      default:
        return null;
    }
  };

  const getExpandedTitle = () => {
    switch (expandedChart) {
      case 'category': return 'Revenue by Category';
      case 'daily': return 'Daily Sales Trend';
      case 'age': return 'Age Group Analysis';
      case 'gender': return 'Gender Distribution';
      case 'age_spending': return 'Avg Spend by Age';
      default: return '';
    }
  };

  return (
    <div className="container">
      <header className="dashboard-header">
        <div>
          <h1 className="title">Retail Analytics Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Interactive sales performance analysis
            {lastUpdated && <span style={{ fontSize: '0.8rem', marginLeft: '1rem' }}>
              Last updated: {format(lastUpdated, 'PPpp')}
            </span>}
          </p>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <FilterBar onFilter={handleFilter} loading={loading} />

      {!metrics && !loading && (
        <div className="card loading">
          <p>No analytics data available. Apply filters to generate a report.</p>
        </div>
      )}

      {metrics && (
        <>
          <div className="grid grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={`$${metrics.total_revenue.toLocaleString()}`}
              icon={<DollarSign size={24} color="#2563eb" />}
            />
            <StatCard
              title="Avg Transaction"
              value={`$${metrics.avg_transaction_value.toFixed(2)}`}
              icon={<TrendingUp size={24} color="#10b981" />}
            />
            <StatCard
              title="Total Transactions"
              value={metrics.total_transactions}
              icon={<ShoppingBag size={24} color="#f59e0b" />}
            />
            <StatCard
              title="Avg Basket Size"
              value={metrics.avg_basket_size ? metrics.avg_basket_size.toFixed(1) : 'N/A'}
              icon={<ShoppingBag size={24} color="#8b5cf6" />}
            />
          </div>

          <div className="grid grid-cols-2">
            <ChartCard onMaximize={() => setExpandedChart('category')}>
              <CategoryBarChart data={metrics} />
            </ChartCard>
            <ChartCard onMaximize={() => setExpandedChart('age')}>
              <h3 className="stat-title" style={{ textAlign: 'center' }}>Age Group Analysis</h3>
              <AgeGroupPieChart data={metrics} />
            </ChartCard>
          </div>

          <div className="grid grid-cols-2">
            <ChartCard onMaximize={() => setExpandedChart('gender')}>
              <h3 className="stat-title" style={{ textAlign: 'center' }}>Gender Distribution</h3>
              <GenderDoughnutChart data={metrics} />
            </ChartCard>
            <ChartCard onMaximize={() => setExpandedChart('age_spending')}>
              <AgeSpendingChart data={metrics} />
            </ChartCard>
          </div>

          <div className="grid">
            <ChartCard onMaximize={() => setExpandedChart('daily')}>
              <DailySalesLineChart data={metrics} />
            </ChartCard>
          </div>

          <div className="grid">
            <div className="card">
              <h3 className="stat-title">Key Insights</h3>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <strong>🏆 Best Performing:</strong> {metrics.top_category}
                </div>
                <div>
                  <strong>📉 Worst Performing:</strong> {metrics.worst_performing_category}
                </div>
                <div>
                  <strong>📅 Peak Sales Day:</strong> {metrics.peak_sales_day}
                </div>
                <div>
                  <strong>🔻 Lowest Sales Day:</strong> {metrics.lowest_sales_day}
                </div>
              </div>
            </div>
          </div>

        </>
      )}

      <div className="grid">
        <SalesTable />
      </div>

      <ChartModal
        isOpen={!!expandedChart}
        onClose={() => setExpandedChart(null)}
        title={getExpandedTitle()}
      >
        {renderExpandedChart()}
      </ChartModal>

    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="card stat-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
      {icon}
    </div>
  </div>
);

export default App;
