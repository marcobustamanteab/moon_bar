import React from 'react';
import DataTable, { TableColumn, TableStyles } from 'react-data-table-component';
import { Loader2 } from 'lucide-react';
import '../../assets/styles/customDataTable.css';

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: boolean;
  searchable?: boolean;
  title?: string;
  actions?: React.ReactNode;
  onSearch?: (term: string) => void;
}

const customStyles: TableStyles = {
  table: {
    style: {
      backgroundColor: '#ffffff',
    },
  },
  header: {
    style: {
      backgroundColor: '#f8f9fa',
      color: '#495057',
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  headRow: {
    style: {
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e9ecef',
      minHeight: '52px',
    },
  },
  headCells: {
    style: {
      color: '#495057',
      fontSize: '0.875rem',
      fontWeight: 600,
      padding: '1rem',
    },
  },
  subHeader: {
    style: {
      padding: '0 1rem 0.5rem 1rem', // Reducimos el padding
      marginBottom: '0',
    },
  },
  cells: {
    style: {
      padding: '1rem',
    },
  },
  rows: {
    style: {
      minHeight: '48px',
      '&:hover': {
        backgroundColor: '#f8f9fa',
      },
    },
  },
  pagination: {
    style: {
      borderTop: '1px solid #e9ecef',
      padding: '1rem 0',
    },
  },
};

const paginationComponentOptions = {
  rowsPerPageText: 'Filas por página:',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
  selectAllRowsItemText: 'Todos',
};

function CustomDataTable<T>({ 
  columns, 
  data, 
  loading = false,
  pagination = true,
  searchable = true,
  onSearch,
//   title,
  actions
}: DataTableProps<T>) {
  const LoaderComponent = () => (
    <div className="d-flex justify-content-center py-5">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  const subHeaderComponent = (
    <div className="d-flex justify-content-between align-items-center w-100" 
         style={{ padding: '0.5rem 0' }}>
      <div style={{ paddingLeft: '0' }}>
        {actions}
      </div>
      {searchable && (
        <div style={{ 
          width: '300px',
          paddingRight: '0'
        }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            onChange={(e) => onSearch?.(e.target.value)}
            style={{ 
              height: '36px',
              fontSize: '0.875rem'
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="custom-datatable-container">      
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        paginationComponentOptions={paginationComponentOptions}
        progressPending={loading}
        progressComponent={<LoaderComponent />}
        customStyles={{
          ...customStyles,
          table: {
            style: {
              width: '100%',
              minWidth: '100%',
              backgroundColor: '#ffffff',
            },
          },
        }}
        noDataComponent={<div className="p-3">No hay registros para mostrar</div>}
        striped
        responsive
        highlightOnHover
        subHeader
        subHeaderComponent={subHeaderComponent}
      />
    </div>
  );
}

export default CustomDataTable;