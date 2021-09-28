import { FC, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { FormKuisioner } from './FormKuisioner'
import { Badge, Spinner } from 'react-bootstrap'
import { useScreenType } from '../hooks/useScreenType'
import { Nilai as NilaiInterface } from '../../store/models/startupModel'

export const StartupDetail: FC = () => {
  const { startupId } = useParams<{ startupId: string }>()
  const { startup, loading } = useStoreState(state => state.startupModel)
  const { user } = useStoreState(state => state.userModel)
  const { setAlert, getStartup, setStartup } = useStoreActions(
    actions => actions.startupModel
  )
  const screenType = useScreenType()

  function getNilai() {
    return startup?.nilais?.find(nilai => nilai.userId === user?.id)
  }

  useEffect(() => {
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
            <StartupInfo screenType={screenType}>
              <StartupInfoLeft screenType={screenType}>
                <P>
                  <span>Nama startup: </span>
                  <span>{startup.nama}</span>
                </P>
                <P>
                  <span>Tahun Pendanaan: </span> <span>{startup.tahunPendanaan}</span>
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
              <StartupInfoRight screenType={screenType}>
                <h5>
                  <P>
                    <span>Nilai rata-rata:</span>
                    <div>
                      <span>{Math.floor(getNilaiRata2(startup.nilais))}</span>{' '}
                    </div>
                  </P>
                </h5>
                <h5>
                  <P>
                    <span>Status: </span>
                    <div>
                      {checkLulus(
                        +startup.formPenilaian.rekomendasiKelulusan,
                        getNilaiRata2(startup.nilais)
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
              nilai={getNilai()}
            />{' '}
          </>
        )
      )}
    </StartupDetailContainer>
  )
}

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

function getNilaiRata2(nilais: NilaiInterface[] | null): number {
  if (!nilais || nilais.length === 0) return 0

  return nilais.reduce((acc, item) => acc + item.total, 0) / nilais.length
}

const StartupDetailContainer = styled.div`
  color: rgba(0, 0, 0, 0.6);
  padding-bottom: 5em;
`
const StartupInfo = styled.div<{ screenType: string }>`
  display: flex;
  flex-direction: ${props => (props.screenType === 'mobile' ? 'column' : 'row')};
  justify-content: space-between;
  width: 100%;
  gap: 1em;
  margin-bottom: 2em;
`
const StartupInfoLeft = styled.div<{ screenType: string }>`
  width: ${props => (props.screenType === 'mobile' ? '' : '30vw')};
`
const StartupInfoRight = styled.div<{ screenType: string }>`
  width: ${props => (props.screenType === 'mobile' ? '' : '30vw')};
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