import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  length?: number;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages = 1,
  onPageChange,
  length,
}) => {
  const maxPageNumbersToShow = 3;

  const getPageNumbers = () => {
    if (!totalPages) return [1];
    const pages = [];
    if (totalPages <= maxPageNumbersToShow + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= maxPageNumbersToShow) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-between items-center px-8 shadow-lg mt-5 py-2 border-t text-sm text-gray-600 w-full h-12 bg-white">
      <span>{`1 to ${length || 10}  of ${totalPages || 1}`}</span>

      <nav className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          {"<"}
        </button>

        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? "bg-black text-white" : "bg-white"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2">
              {page}
            </span>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          {">"}
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
