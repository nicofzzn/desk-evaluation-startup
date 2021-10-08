import { useState, useEffect } from 'react'

interface PaginationInterface {
  pageCount: number
  pageSize: number
  page: number
  totalRow: number
}

function usePagination<T>(data: T[]): {
  pagination: PaginationInterface
  setPagination: React.Dispatch<React.SetStateAction<PaginationInterface>>
  onPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  data: T[]
} {
  const [pagination, setPagination] = useState<PaginationInterface>({
    page: 0,
    pageSize: 10,
    pageCount: 0,
    totalRow: 0,
  })

  const onPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      +e.target.value >= 1 &&
      +e.target.value <= Math.ceil(pagination.totalRow / pagination.pageSize)
    ) {
      setPagination({ ...pagination, page: +e.target.value })
    }
  }

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      page: 1,
      pageCount: Math.ceil(data.length / prev.pageSize),
      totalRow: data.length,
    }))

    // return () => setAlert(null)
  }, [data])

  return {
    pagination,
    setPagination,
    onPageChange,
    data: data.slice(
      pagination.page * pagination.pageSize - pagination.pageSize,
      pagination.page * pagination.pageSize
    ),
  }
}

export default usePagination
