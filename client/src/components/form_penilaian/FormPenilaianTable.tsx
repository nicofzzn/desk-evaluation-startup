import { FC, useEffect } from 'react'
import { Alert, Spinner, Table } from 'react-bootstrap'
import {
  BiChevronLeft,
  BiChevronsLeft,
  BiChevronsRight,
  BiChevronRight,
} from 'react-icons/bi'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { ConfirmAlert } from '../ConfirmAlert'
import { useScreenType } from '../hooks/useScreenType'
import { Pagination } from '../startup/StartupTable'
import usePagination from '../hooks/usePagination'

export const FormPenilaianTable: FC = () => {
  const { forms, loading, alert } = useStoreState(state => state.formPenilaianModel)
  const { data, onPageChange, pagination, setPagination } = usePagination(forms)
  const { getForms, setAlert } = useStoreActions(actions => actions.formPenilaianModel)
  const { url } = useRouteMatch()
  const screenType = useScreenType()

  useEffect(() => {
    return () => setAlert(null)
  }, [getForms, setAlert])

  return (
    <FormPenilaianTableContainer screenType={screenType}>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      {loading ? (
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
                <th>Nama Form Penilaian</th>
                <th>Dibuat pada tanggal</th>
                <th style={{ width: '10%' }}></th>
              </tr>
            </thead>
            <tbody>
              {data.map(form => (
                <tr key={form._id}>
                  <td>
                    <Link to={`${url}/${form._id}`}>{form.namaFormPenilaian}</Link>
                  </td>
                  <td>{parseDate(form.createdAt)}</td>
                  <td>
                    <ConfirmAlert formId={form._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {forms.length > 0 && (
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
    </FormPenilaianTableContainer>
  )
}

function parseDate(date: string | undefined) {
  if (typeof date === 'string') {
    const dt = new Date(date)
    return `${dt.getDate()}-${dt.getMonth()}-${dt.getFullYear()}`
  }
  return ''
}

const FormPenilaianTableContainer = styled.div<{ screenType: string }>`
  margin: 0.5em 0;
  overflow-x: auto;
`

const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 50vh;
`
