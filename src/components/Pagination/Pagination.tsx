type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Síðufletting" className="pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Fyrri
      </button>
      <p className="pagination__status">
        Síða {currentPage} af {totalPages}
      </p>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Næsta
      </button>
    </nav>
  );
}
