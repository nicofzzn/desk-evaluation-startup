import { FC, useLayoutEffect } from 'react'
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
import usePagination from '../hooks/usePagination'

export const PenilaiTable: FC = () => {
  const { penilai, alert, loadingPenilai } = useStoreState(state => state.userModel)
  const { data, onPageChange, pagination, setPagination } = usePagination(penilai)
  const { setAlert } = useStoreActions(actions => actions.userModel)
  const { path } = useRouteMatch()
  const screenType = useScreenType()

  useLayoutEffect(() => {
    return () => {
      setAlert(null)
    }
  }, [setAlert])

  return (
    <PenilaiTableContainer screenType={screenType}>
      {loadingPenilai ? (
        <SpinnerContainer>
          <Spinner animation='border' />
        </SpinnerContainer>
      ) : (
        <>
          {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
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
                <th style={{ width: '10%' }}></th>
              </tr>
            </thead>
            <tbody>
              {data.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>
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

const PenilaiTableContainer = styled.div<{ screenType: string }>`
  margin: 0.5em 0;
  overflow-x: auto;
`

const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 20vh;
`
