import clsx from 'clsx';
import { z } from 'zod';

const variantOptions = {
  grow: 'grow',
};

interface TableCellProps {
  variant?: keyof typeof variantOptions;
  children: React.ReactNode;
}

export const TableCell: React.FC<TableCellProps> = ({ variant, children }) => {
  return (
    <div
      className={clsx(
        'w-40 px-4 py-2 text-sm',
        variant && variantOptions[variant]
      )}
    >
      {children}
    </div>
  );
};

interface TableRowProps {
  key: string | number;
  index: number;
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ key, index, children }) => {
  return (
    <div
      className={clsx(
        'my-2 flex flex-row',
        index % 2 ? 'bg-slate-800' : 'bg-slate-700'
      )}
      key={key}
    >
      {children}
    </div>
  );
};
