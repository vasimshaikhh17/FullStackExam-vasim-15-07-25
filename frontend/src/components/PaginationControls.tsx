"use client";

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
}

const PaginationControls = ({ totalPages, currentPage }: PaginationControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  return (
<div className="flex justify-center items-center gap-4 mt-8">
  <button
    disabled={currentPage <= 1}
    onClick={() => handlePageChange(currentPage - 1)}
    className={`px-4 py-2 rounded-md transition-colors duration-200 shadow-sm ${
      currentPage <= 1
        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
        : 'bg-blue-600 text-white hover:bg-blue-700'
    }`}
  >
    Previous
  </button>

  <span className="text-gray-700 font-medium">
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage >= totalPages}
    onClick={() => handlePageChange(currentPage + 1)}
    className={`px-4 py-2 rounded-md transition-colors duration-200 shadow-sm ${
      currentPage >= totalPages
        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
        : 'bg-blue-600 text-white hover:bg-blue-700'
    }`}
  >
    Next
  </button>
</div>

  );
};

export default PaginationControls;