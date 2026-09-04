import { Pagination } from "./Pagination";

export interface ColumnDef<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends { id: string | number }> {
  columns: ColumnDef<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  emptyMessage?: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-[rgba(144,238,144,0.2)] text-[#b5b47e]",
    Available: "bg-[rgba(132,177,109,0.2)] text-[#a0c87a]",
    Pending: "bg-[rgba(255,200,100,0.2)] text-[#c8b470]",
    "Out of Stock": "bg-[rgba(220,50,50,0.2)] text-[#e07070]",
  };
  return (
    <span className={`inline-block px-3 py-0.5 rounded-[10px] text-[14px] font-['Roboto',sans-serif] ${styles[status] ?? "bg-white/10 text-white"}`}>
      {status}
    </span>
  );
}

export { StatusBadge };

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  onRowClick,
  currentPage,
  totalPages,
  onPageChange,
  emptyMessage = "No data found.",
}: DataTableProps<T>) {
  return (
    <div>
      <div className="bg-[#141414] border border-[rgba(255,255,255,0.25)] rounded-[15px] overflow-hidden">
        {/* Header */}
        <div className="grid border-b border-[rgba(255,255,255,0.1)]" style={{ gridTemplateColumns: columns.map((c) => c.width ?? "1fr").join(" ") }}>
          {columns.map((col) => (
            <div
              key={String(col.key)}
              className="px-4 py-4 font-['Roboto',sans-serif] font-medium text-[14px] text-[rgba(255,255,255,0.74)] opacity-75"
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.length === 0 ? (
          <div className="py-12 text-center text-[rgba(255,255,255,0.4)] font-['Roboto',sans-serif] text-[16px]">
            {emptyMessage}
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`grid border-b border-[rgba(255,255,255,0.08)] last:border-0 ${
                onRowClick ? "cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors" : ""
              }`}
              style={{ gridTemplateColumns: columns.map((c) => c.width ?? "1fr").join(" ") }}
            >
              {columns.map((col) => (
                <div
                  key={String(col.key)}
                  className="px-4 py-5 font-['Roboto',sans-serif] font-medium text-[14px] text-white opacity-75 flex items-center"
                >
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[String(col.key)] ?? "")}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
