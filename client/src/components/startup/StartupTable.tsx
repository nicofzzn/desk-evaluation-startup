import { FC, useEffect, useState } from 'react'
import { Alert, Badge, Spinner, Table } from 'react-bootstrap'
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
import {
  Nilai as NilaiInterface,
  Startup as StartupInterface,
} from '../../store/models/startupModel'
import { useScreenType } from '../hooks/useScreenType'

interface PaginationInterface {
  pageCount: number
  pageSize: number
  page: number
  totalRow: number
}

export const StartupTable: FC<{
  startups: StartupInterface[]
}> = ({ startups }) => {
  const [pagination, setPagination] = useState<PaginationInterface>({
    page: 0,
    pageSize: 10,
    pageCount: 0,
    totalRow: 0,
  })
  const { loading, alert } = useStoreState(state => state.startupModel)
  const { user, penilai } = useStoreState(state => state.userModel)
  const { setAlert } = useStoreActions(actions => actions.startupModel)
  const { url } = useRouteMatch()
  const screenType = useScreenType()

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
      pageCount: Math.ceil(startups.length / prev.pageSize),
      totalRow: startups.length,
    }))

    return () => setAlert(null)
  }, [setAlert, startups.length])

  return (
    <StartupTableContainer>
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
                <th style={{ width: '20%' }}>Nama Startup</th>
                {screenType !== 'mobile' && (
                  <>
                    <th style={{ width: '15%' }}>Tahun Pendanaan</th>
                    <th style={{ width: '15%' }}>Versi Profil Pendanaan</th>
                  </>
                )}
                <th style={{ width: '10%' }}>Status Kelulusan</th>
                <th style={{ width: '10%' }}>Jumlah Penilai</th>
                {user?.role === 'penilai' && (
                  <th style={{ width: '10%' }}>Status Penilaian</th>
                )}
                {user?.role === 'admin' && <th style={{ width: '5%' }}></th>}
              </tr>
            </thead>
            <tbody>
              {slicedStartup(startups, pagination.page, pagination.pageSize).map(
                startup => (
                  <tr key={startup._id}>
                    <td>
                      <Link className='text-secondary' to={`${url}/${startup._id}`}>
                        {startup.nama}
                      </Link>
                    </td>
                    {screenType !== 'mobile' && (
                      <>
                        <td>{startup.tahunPendanaan}</td>
                        <td>{startup.versiProfilPendanaan}</td>
                      </>
                    )}
                    <td>
                      {checkKelulusan(
                        +startup.formPenilaian.rekomendasiKelulusan,
                        startup.nilais
                      )}
                    </td>
                    <td>
                      {startup.penilaiCount} / {penilai?.length}
                    </td>
                    {user?.role === 'penilai' && (
                      <td>{checkNilai(user?.id, startup.nilais)}</td>
                    )}
                    {user?.role === 'admin' && (
                      <td>
                        <ConfirmAlert startupId={startup._id} />
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </Table>
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
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                <BiChevronLeft />
              </button>
              <button
                disabled={
                  pagination.page === Math.ceil(pagination.totalRow / pagination.pageSize)
                    ? true
                    : false
                }
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                <BiChevronRight />
              </button>
              <button
                disabled={
                  pagination.page === Math.ceil(pagination.totalRow / pagination.pageSize)
                    ? true
                    : false
                }
                onClick={() => setPagination(prev => ({ ...prev, page: prev.pageCount }))}
              >
                <BiChevronsRight />
              </button>
            </div>
            <span>
              Page {pagination.page} of{' '}
              {Math.ceil(pagination.totalRow / pagination.pageSize)}
            </span>
            <span>Go to page: </span>
            <input type='number' onChange={onPageChange} />
          </Pagination>
        </>
      )}
    </StartupTableContainer>
  )
}

function slicedStartup(
  startups: StartupInterface[],
  page: number,
  pageSize: number
): StartupInterface[] {
  return startups.slice(page * pageSize - pageSize, page * pageSize)
}

function checkKelulusan(rekomendasi: number, penilais: Array<NilaiInterface>) {
  const total = penilais.reduce((acc, penilai) => acc + penilai.total, 0)
  if (rekomendasi <= total / penilais.length) return <Badge variant='info'>Lulus</Badge>
  return <Badge variant='danger'>Tidak lulus</Badge>
}

function checkNilai(userId: string | undefined, penilais: Array<NilaiInterface>) {
  if (!userId) return
  const hasNilai = penilais.find(a => a.userId === userId)
  if (hasNilai) return <Badge variant='info'>Sudah dinilai</Badge>
  return <Badge variant='secondary'>Belum dinilai</Badge>
}

const StartupTableContainer = styled.div`
  margin: 0.5em 0;
  overflow-x: auto;
`

const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 50vh;
`

const Pagination = styled.div<{ screenType: string }>`
  float: right;
  display: flex;
  flex-direction: ${props => (props.screenType === 'mobile' ? 'column' : 'row')};
  align-items: center;
  & button {
    background-color: inherit;
    border: none;
    margin: 0.2em;
    border-radius: 1px;
    color: #686868;
  }
  & button:disabled {
    filter: brightness(1.5);
    cursor: no-drop;
  }
  & input {
    -webkit-appearance: none;
    box-shadow: none !important;
    border: 1px solid #a0a0a0;
    border-radius: 3px;
    width: 5em;
    height: 1.5em;
    color: #686868;
  }
  & input:focus {
    outline: none;
  }
  & span {
    color: #686868;
    font-size: 0.8em;
    margin: 0 0.5em;
  }
`
