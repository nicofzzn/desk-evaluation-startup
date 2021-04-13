import { FC, useEffect } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useStoreActions, useStoreState } from '../store/hooks'
import { FormKuisioner } from './FormKuisioner'
import { Badge, Spinner } from 'react-bootstrap'
import { useScreenType } from './hooks/useScreenType'

export const StartupDetail: FC = () => {
  const { startupId } = useParams<{ startupId: string }>()
  const { startup, loading } = useStoreState(state => state.startupModel)
  const { user } = useStoreState(state => state.userModel)
  const { setAlert, getStartup, setStartup } = useStoreActions(
    actions => actions.startupModel
  )
  const screenType = useScreenType()

  function getPenilai() {
    return startup?.penilai?.find(nilai => nilai.userId === user?.id)
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
              <StartupInfoRight screenType={screenType}>
                {getPenilai() && (
                  <h5>
                    <P>
                      <span>Nilai anda: </span>
                      <div>
                        <span>{getPenilai()?.totalNilai}</span>{' '}
                        {checkLulus(
                          +startup.formPenilaian.rekomendasiKelulusan,
                          getPenilai()?.totalNilai
                        )}
                      </div>
                    </P>
                  </h5>
                )}
                <h5>
                  <P>
                    <span>Nilai rata-rata: </span>
                    <div>
                      <span>
                        {startup.nilaiRataRata &&
                          Math.round(startup.nilaiRataRata)}
                      </span>{' '}
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
              nilai={getPenilai()}
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

const StartupDetailContainer = styled.div`
  color: rgba(0, 0, 0, 0.6);
  padding-bottom: 5em;
`
const StartupInfo = styled.div<{ screenType: string }>`
  display: flex;
  flex-direction: ${props =>
    props.screenType === 'mobile' ? 'column' : 'row'};
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
