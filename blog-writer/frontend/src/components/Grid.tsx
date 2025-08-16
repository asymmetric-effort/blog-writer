// Copyright (c) 2025 Sam Caldwell
/**
 * Grid component renders tabular data with consistent styling.
 */
import React from 'react';
import './Grid.css';

/** Props for the Grid component. */
interface GridProps {
  /** Column headers for the grid. */
  headers: string[];
  /** Rows of string data to display. */
  rows: string[][];
  /** Optional test id for the table element. */
  dataTestId?: string;
  /** Optional test id applied to each row. */
  rowTestId?: string;
  /** Optional handler for row double-click events. */
  onRowDoubleClick?: (index: number) => void;
}

/**
 * Grid displays headers and rows with equal column widths and specific borders.
 */
export function Grid({ headers, rows, dataTestId, rowTestId, onRowDoubleClick }: GridProps): JSX.Element {
  const columnWidth = `${100 / headers.length}%`;
  return (
    <table
      className="grid"
      data-testid={dataTestId}
      style={{ borderStyle: 'outset', borderWidth: '1px', borderRadius: '5px' }}
    >
      <thead>
        <tr>
          {headers.map(h => (
            <th
              key={h}
              style={{
                width: columnWidth,
                backgroundColor: '#ddd',
                borderStyle: 'outset',
                borderWidth: '1px',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            data-testid={rowTestId}
            onDoubleClick={onRowDoubleClick ? () => onRowDoubleClick(i) : undefined}
          >
            {row.map((cell, j) => (
              <td
                key={j}
                style={{ backgroundColor: '#fff', borderStyle: 'inset', borderWidth: '1px' }}
              >
                {cell || '\u00A0'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Grid;
