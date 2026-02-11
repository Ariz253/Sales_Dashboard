import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './ChartModal.css';

const ChartModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="chart-modal-overlay" onClick={onClose}>
            <div className="chart-modal-content" onClick={e => e.stopPropagation()}>
                <div className="chart-modal-header">
                    <h2 className="chart-modal-title">{title}</h2>
                    <button className="chart-modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="chart-modal-body">
                    {/* Clone children to force resize or pass specific props if needed */}
                    {React.cloneElement(children, { maintainAspectRatio: false })}
                </div>
            </div>
        </div>
    );
};

export default ChartModal;
