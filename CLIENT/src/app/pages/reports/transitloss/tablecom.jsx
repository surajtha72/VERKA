import React from 'react';
import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react';

const TableComponent = ({ columns, items }) => {
    return (
        <div style={{ overflowX: 'auto' }}>
            <CTable className="striped-table" style={{ minWidth: '100%' }}>
                <CTableHead>
                    <CTableRow>
                        {console.log("This is columns",columns)
                        }
                        {columns.map(col => (
                            
                            col.children ? (
                                <CTableHeaderCell
                                    key={col.key}
                                    colSpan={col.children.length}
                                    style={{ borderBottom: '2px solid #dee2e6', textAlign: 'center' }}
                                >
                                    {col.label}
                                    <CTableHead>
                                        <CTableRow>
                                            {col.children.map(child => (
                                                <CTableHeaderCell
                                                    key={child.key}
                                                    style={{ paddingLeft: '20px', paddingRight: '20px' ,textAlign:'center' ,}}
                                                >
                                                    {child.label}
                                                </CTableHeaderCell>
                                            ))}
                                        </CTableRow>
                                    </CTableHead>
                                </CTableHeaderCell>
                            ) : (
                                <CTableHeaderCell
                                    key={col.key}
                                    style={{ borderBottom: '2px solid #dee2e6', textAlign: 'center' }}
                                >
                                    {col.label}
                                </CTableHeaderCell>
                            )
                        ))}
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                {items.map((item, index) => (
    <CTableRow key={index}>
        {columns.map(col => (
            col.children ? (
                <React.Fragment key={col.key}>
                    {col.children.map(child => (
                        <CTableDataCell
                            key={child.key}
                            style={{ paddingLeft: '20px', paddingRight: '20px', border: '1px solid #dee2e6', textAlign: 'center' }}
                        >
                            {/* Ensure item[col.key] exists and provide a default value if not */}
                            {item[col.key] ? item[col.key][child.key] ?? '-' : '-'}
                            { console.log(item[col.key],'hello')}
                        </CTableDataCell>
                    ))}
                </React.Fragment>
            ) : (
                <CTableDataCell
                    key={col.key}
                    style={{ textAlign: 'center', border: '1px solid #dee2e6' }}
                >
                    {/* Ensure item[col.key] exists and provide a default value if not */}
                    {item[col.key] ?? '-'}
                </CTableDataCell>
            )
        ))}
    </CTableRow>
))}

                </CTableBody>
            </CTable>
        </div>
    );
};

export default TableComponent;
