import React, { useState } from 'react';
import './DataTable.scss';
import { Search, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import Message from '../../shared/components/Message';

const DataTable = ({ 
  columns, 
  data, 
  searchKey, 
  actionColumn,
  emptyMessage = 'Tidak ada data tersedia.',
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [message, setMessage] = useState(null);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Apply sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);
  
  // Apply search filter
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return sortedData;
    
    return sortedData.filter(item => {
      if (!searchKey) return true;
      
      const value = item[searchKey];
      if (!value) return false;
      
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [sortedData, searchTerm, searchKey]);
  
  // Render sort direction icon
  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };
  
  return (
    <div className="data-table-container">
      {searchKey && (
        <div className="table-header">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder={`Cari berdasarkan ${columns.find(col => col.key === searchKey)?.label || searchKey}...`} 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      )}
      
      {message && (
        <Message 
          type={message.type} 
          message={message.text} 
          onClose={() => setMessage(null)}
        />
      )}
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className={column.sortable ? 'sortable' : ''}
                  onClick={() => column.sortable && requestSort(column.key)}
                >
                  <div className="th-content">
                    <span>{column.label}</span>
                    {column.sortable && getSortDirectionIcon(column.key)}
                  </div>
                </th>
              ))}
              {actionColumn && <th className="actions-column">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr className="loading-row">
                <td id={columns.length + (actionColumn ? 1 : 0)}>
                  <div className="loading-message">Loading data...</div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={columns.length + (actionColumn ? 1 : 0)}>
                  <div className="empty-message">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              filteredData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column.key}`}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                  {actionColumn && (
                    <td className="actions-cell">
                      {actionColumn(row, setMessage)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;