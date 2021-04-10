import { FC, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useStoreActions, useStoreState } from '../store/hooks'
import { FormKuisioner } from './FormKuisioner'
import { Badge, Spinner } from 'react-bootstrap'
import axios from 'axios'

export interface Nilai {
  userId: string
  startupId: string
  nilai: Array<Array<number>>
  total: number
  rekomendasiKelulusan: number
}

const initialNilaiState: Nilai | null = {
  userId: '',
  startupId: '',
  nilai: [],
  total: 0,
  rekomendasiKelulusan: 0,
}

export const StartupDetail: FC = () => {
  const { startupId } = useParams<{ startupId: string }>()
  const { startup, loading } = useStoreState(state => state.startupModel)
  const { user } = useStoreState(state => state.userModel)
  const { setAlert, getStartup, setStartup } = useStoreActions(
    actions => actions.startupModel
  )
  const [nilai, setNilai] = useState(initialNilaiState)
  const getNilai = useCallback(() => {
    axios.get(`/api/startup/nilai/${startupId}`).then(res => setNilai(res.data))
  }, [startupId])

  function checkLulus(rekomendasi: number, nilai: number | undefined) {
    if (nilai && rekomendasi <= nilai)
      return (
        <Badge variant='info' className=' '>
          Lulus
        </Badge>
      )
    else
      return (
        <Badge variant='secondary' className=' '>
          Tidak lulus
        </Badge>
      )
  }

  function getPenilai() {
    return startup?.penilai?.find(nilai => nilai.userId === user?.id)
  }

  useEffect(() => {
    getNilai()
    getStartup(startupId)
    return () => {
      setStartup(null)
      setAlert(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StartupDetailContainer>
      {loading ? (
        <SpinnerContainer>
          <Spinner animation='border' />
        </SpinnerContainer>
      ) : (
        startup && (
          <>
            <StartupInfo>
              <StartupInfoLeft>
                <P>
                  <span>Nama startup: </span>
                  <span>{startup.nama}</span>
                </P>
                <P>
                  <span>Tahun Pendanaan: </span>{' '}
                  <span>{startup.tahunPendanaan}</span>
                </P>
                <P>
                  <span>Versi Profil Pendanaan: </span>{' '}
                  <span>{startup.versiProfilPendanaan}</span>
                </P>
                <P>
                  <span>File Proposal: </span>{' '}
                  <span>
                    <a
                      href={startup.fileProposal.location}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Link
                    </a>
                  </span>
                </P>
              </StartupInfoLeft>
              <StartupInfoRight>
                <h5>
                  {nilai && nilai.userId && (
                    <P>
                      <span>Nilai anda: </span>
                      <div>
                        <span>{getPenilai()?.nilai}</span>{' '}
                        {nilai &&
                          checkLulus(nilai.rekomendasiKelulusan, nilai.total)}
                      </div>
                    </P>
                  )}
                </h5>
                <h5>
                  <P>
                    <span>Nilai rata-rata: </span>
                    <div>
                      <span>{startup.nilaiRataRata}</span>{' '}
                      {checkLulus(
                        +startup.formPenilaian.rekomendasiKelulusan,
                        startup.nilaiRataRata
                      )}
                    </div>
                  </P>
                </h5>
              </StartupInfoRight>
            </StartupInfo>
            <FormKuisioner
              startupId={startupId}
              kriterias={startup.formPenilaian.kriterias}
              rekomendasiKelulusan={startup.formPenilaian.rekomendasiKelulusan}
              nilai={nilai}
            />{' '}
          </>
        )
      )}
    </StartupDetailContainer>
  )
}

const StartupDetailContainer = styled.div`
  color: rgba(0, 0, 0, 0.6);
  padding-bottom: 5em;
`
const StartupInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 2em;
`
const StartupInfoLeft = styled.div`
  width: 30vw;
  margin-right: 1em;
`
const StartupInfoRight = styled.div`
  width: 30vw;
  margin-left: 1em;
`
const P = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
`
const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 50vh;
`
