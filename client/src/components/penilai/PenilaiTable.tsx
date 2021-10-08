import { FC, useEffect, useLayoutEffect, useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import {
  BiChevronLeft,
  BiChevronsLeft,
  BiChevronsRight,
  BiChevronRight,
} from 'react-icons/bi'
import { AiFillEdit } from 'react-icons/ai'
import { Table, Alert, Spinner } from 'react-bootstrap'
import styled from 'styled-components'
import { useScreenType } from '../hooks/useScreenType'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { ConfirmAlert } from '../ConfirmAlert'
import { Pagination } from '../startup/StartupTable'
import { PenilaiField } from '../../store/models/userModel'

interface PaginationInterface {
  pageCount: number
  pageSize: number
  page: number
  totalRow: number
}

export const PenilaiTable: FC = () => {
  const [pagination, setPagination] = useState<PaginationInterface>({
    page: 0,
    pageSize: 10,
    pageCount: 0,
    totalRow: 0,
  })
  const { penilai, alert, loadingPenilai } = useStoreState(state => state.userModel)
  const { setAlert } = useStoreActions(actions => actions.userModel)
  const { path } = useRouteMatch()
  const screenType = useScreenType()

  const onPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      +e.target.value >= 1 &&
      +e.target.value <= Math.ceil(pagination.totalRow / pagination.pageSize)
    ) {
      setPagination({ ...pagination, page: +e.target.value })
    }
  }

  useLayoutEffect(() => {
    return () => {
      setAlert(null)
    }
  }, [setAlert])

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      page: 1,
      pageCount: Math.ceil(penilai.length / prev.pageSize),
      totalRow: penilai.length,
    }))

    // return () => setAlert(null)
  }, [setAlert, penilai])

  return (
    <PenilaiTableContainer screenType={screenType}>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      {loadingPenilai ? (
        <SpinnerContainer>
          <Spinner animation='border' />
        </SpinnerContainer>
      ) : (
        <>
          <Table
            size={screenType === 'mobile' ? 'sm' : ''}
            borderless
            responsive
            className='text-secondary'
          >
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {slicedPenilai(penilai, pagination.page, pagination.pageSize).map(p => (
                <tr key={p._id}>
                  <td style={{ width: '30%' }}>{p.name}</td>
                  <td style={{ width: '40%' }}>{p.email}</td>
                  <td style={{ width: '20%' }}>
                    <Link to={`${path}/${p._id}`}>
                      <AiFillEdit color='#6c757d' className='mr-2' />
                    </Link>
                    <ConfirmAlert penilaiId={p._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {penilai.length > 0 && (
            <Pagination screenType={screenType}>
              <div>
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                >
                  <BiChevronsLeft />
                </button>
                <button
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination(prev => ({ ...prev, page: prev.page - 1 }))
                  }
                >
                  <BiChevronLeft />
                </button>
                <button
                  disabled={
                    pagination.page ===
                    Math.ceil(pagination.totalRow / pagination.pageSize)
                      ? true
                      : false
                  }
                  onClick={() =>
                    setPagination(prev => ({ ...prev, page: prev.page + 1 }))
                  }
                >
                  <BiChevronRight />
                </button>
                <button
                  disabled={
                    pagination.page ===
                    Math.ceil(pagination.totalRow / pagination.pageSize)
                      ? true
                      : false
                  }
                  onClick={() =>
                    setPagination(prev => ({ ...prev, page: prev.pageCount }))
                  }
                >
                  <BiChevronsRight />
                </button>
              </div>
              <span>
                Page {pagination.page} of{' '}
                {Math.ceil(pagination.totalRow / pagination.pageSize)}
              </span>
              <span>Go to page: </span>
              <input min={1} type='number' onChange={onPageChange} />
            </Pagination>
          )}
        </>
      )}
    </PenilaiTableContainer>
  )
}

function slicedPenilai(
  penilai: PenilaiField[],
  page: number,
  pageSize: number
): PenilaiField[] {
  return penilai.slice(page * pageSize - pageSize, page * pageSize)
}

const PenilaiTableContainer = styled.div<{ screenType: string }>`
  margin: 0.5em 0;
  overflow-x: auto;
`

const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 50vh;
`
