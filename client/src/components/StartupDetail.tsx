import { FC } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useStoreState } from '../store/hooks'
import { FormKuisioner } from './FormKuisioner'

export const StartupDetail: FC = () => {
  const { startupId } = useParams<{ startupId: string }>()
  const { startups } = useStoreState(state => state.startupModel)

  function getStartupById(id: string) {
    return startups.find(startup => startup._id === id)
  }

  return (
    <StartupDetailContainer>
      <StartupInfo>
        <P>
          <span>Nama startup: </span>{' '}
          <span>{getStartupById(startupId)?.nama}</span>
        </P>
        <P>
          <span>Tahun Pendanaan: </span>{' '}
          <span>{getStartupById(startupId)?.tahunPendanaan}</span>
        </P>
        <P>
          <span>Versi Profil Pendanaan: </span>{' '}
          <span>{getStartupById(startupId)?.versiProfilPendanaan}</span>
        </P>
        <P>
          <span>File Proposal: </span>{' '}
          <span>
            <a
              href={getStartupById(startupId)?.fileProposal.location}
              target='_blank'
              rel='noopener noreferrer'
            >
              Link
            </a>
          </span>
        </P>
      </StartupInfo>

      <FormKuisioner
        startupId={startupId}
        kriterias={getStartupById(startupId)?.formPenilaian.kriterias}
      />
    </StartupDetailContainer>
  )
}

const StartupDetailContainer = styled.div`
  color: rgba(0, 0, 0, 0.6);
  padding-bottom: 5em;
`
const StartupInfo = styled.div`
  width: 30vw;
  margin-bottom: 2em;
`
const P = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
`
