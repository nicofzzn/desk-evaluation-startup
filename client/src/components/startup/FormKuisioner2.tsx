import { FC, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import { Alert, Button, Card, Form, FormCheck, Spinner } from 'react-bootstrap'
import {
  Kriteria,
  Subkriteria as SubkriteriaInterface,
} from '../hooks/useTambahFormPenilaianReducer'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { Nilai as NilaiInterface, Startup } from '../../store/models/startupModel'
import { useScreenType } from '../hooks/useScreenType'

interface Props {
  nilai: NilaiInterface | undefined
  startup: Startup
}

type Kuisioner = Array<
  Array<{
    optionId: string
    skor: number
  }>
>

const initialState: Kuisioner = []

export const FormKuisioner2: FC<Props> = ({ nilai, startup }) => {
  const [kuisioner, setKuisioner] = useState(initialState)
  const { alert, loading } = useStoreState(state => state.startupModel)
  const { user } = useStoreState(state => state.userModel)
  const { nilaiStartup } = useStoreActions(actions => actions.startupModel)
  const screenType = useScreenType()
  const {
    formPenilaian: { kriterias },
    _id: startupId,
  } = startup

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    nilaiStartup({
      startupId: startupId,
      nilai: kuisioner,
      totalNilai: getTotalNilai(kuisioner, kriterias),
    })
  }

  function onChange(
    indexKriteria: number,
    indexSubkriteria: number,
    skor: number | string,
    optionId: string
  ) {
    setKuisioner(prev => {
      if (!prev[indexKriteria]) {
        prev[indexKriteria] = []
      }
      prev[indexKriteria][indexSubkriteria] = {
        optionId: optionId,
        skor: +skor,
      }

      return [...prev]
    })
  }

  useLayoutEffect(() => {
    if (nilai) {
      setKuisioner([...nilai.nilai])
    } else {
      setKuisioner([])
    }
  }, [nilai])

  if (screenType === 'mobile') {
    return (
      <>
        {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
        <Form onSubmit={onSubmit}>
          {kriterias.map((kriteria, indexKriteria) => (
            <Card key={indexKriteria} className='mb-3'>
              <Card.Header className='p-0'>
                <Header className='custom-header'>
                  <Nama>{kriteria.namaKriteria}</Nama>
                </Header>
              </Card.Header>
              {kriteria.subkriteria.map((subkriteria, indexSubkriteria) => (
                <SubkriteriaMoblile key={indexSubkriteria}>
                  <span>{subkriteria.namaSubkriteria}</span>
                  <OptionMobile>
                    {subkriteria.option.map((option, indexOption) => (
                      <Form.Check
                        key={indexOption}
                        name={subkriteria._id}
                        type='radio'
                        label={`${option.namaOption} (${option.skor ? option.skor : 0})`}
                        value={option.skor}
                        onChange={e =>
                          onChange(
                            indexKriteria,
                            indexSubkriteria,
                            option.skor,
                            option._id
                          )
                        }
                        checked={isChecked(
                          kuisioner,
                          indexKriteria,
                          indexSubkriteria,
                          option._id
                        )}
                        disabled={user?.role !== 'penilai' || nilai ? true : false}
                        required
                      />
                    ))}
                  </OptionMobile>
                </SubkriteriaMoblile>
              ))}
            </Card>
          ))}
          {kriterias && user?.role !== 'penilai' ? null : (
            <Button
              disabled={loading || nilai ? true : false}
              className='float-right'
              variant='custom-primary'
              type='submit'
            >
              {loading ? <Spinner animation='border' /> : 'Submit'}
            </Button>
          )}
        </Form>
      </>
    )
  }

  return (
    <>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      <Header className='text-muted' style={{ fontWeight: 300, fontSize: '.9em' }}>
        <Nama>Kriteria/Subkriteria</Nama>
        <Option>Opsi Pilihan (skor)</Option>
        <Bobot>Bobot</Bobot>
        <Nilai>
          <div>Nilai</div>
          <Form.Text className='text-muted'>(nilai * bobot)</Form.Text>
        </Nilai>
      </Header>
      <Form onSubmit={onSubmit}>
        {kriterias.map((kriteria, indexKriteria) => (
          <Card key={indexKriteria} className='mb-2'>
            <Card.Header className='p-0'>
              <Header className='custom-header'>
                <Nama>{kriteria.namaKriteria}</Nama>
                <Option></Option>
                <Bobot>{getBobotKriteria(kriteria.subkriteria)}</Bobot>
                <Nilai>{getNilaiKriteria(kuisioner, kriteria, indexKriteria)}</Nilai>
              </Header>
            </Card.Header>
            {kriteria.subkriteria.map((subkriteria, indexSubkriteria) => (
              <Subkriteria key={indexSubkriteria}>
                <Nama>{subkriteria.namaSubkriteria}</Nama>
                <Option>
                  {subkriteria.option.map((option, indexOption) => (
                    <FormCheck
                      key={indexOption}
                      type='radio'
                      name={subkriteria._id}
                      label={`${option.namaOption} (${option.skor ? option.skor : 0})`}
                      value={option._id}
                      checked={isChecked(
                        kuisioner,
                        indexKriteria,
                        indexSubkriteria,
                        option._id
                      )}
                      onChange={e =>
                        onChange(indexKriteria, indexSubkriteria, option.skor, option._id)
                      }
                      disabled={user?.role !== 'penilai' || nilai ? true : false}
                      required
                    />
                  ))}
                </Option>
                <Bobot>{subkriteria.bobot}</Bobot>
                <Nilai>
                  {getNilaiSubKriteria(
                    +subkriteria.bobot,
                    kuisioner,
                    indexKriteria,
                    indexSubkriteria
                  )}
                </Nilai>
              </Subkriteria>
            ))}
          </Card>
        ))}
        {kriterias && user?.role !== 'penilai' ? null : (
          <Button
            disabled={loading || nilai ? true : false}
            className='float-right'
            variant='custom-primary'
            type='submit'
          >
            {loading ? <Spinner animation='border' /> : 'Submit'}
          </Button>
        )}
      </Form>
    </>
  )
}

function getBobotKriteria(subkriterias: SubkriteriaInterface[]) {
  return subkriterias.reduce((acc, subkriteria) => acc + +subkriteria.bobot, 0)
}

function getNilaiKriteria(
  kuisioner: Kuisioner,
  kriteria: Kriteria,
  indexKriteria: number
) {
  if (kuisioner[indexKriteria]) {
    return kuisioner[indexKriteria].reduce((acc, value, index) => {
      return acc + value.skor * +kriteria.subkriteria[index].bobot
    }, 0)
  }

  return 0
}

function getNilaiSubKriteria(
  bobot: number,
  kuisioner: Kuisioner,
  indexKriteria: number,
  indexSubkriteria: number
) {
  if (kuisioner[indexKriteria] && kuisioner[indexKriteria][indexSubkriteria]) {
    return bobot * kuisioner[indexKriteria][indexSubkriteria].skor
  }
  return 0
}

function isChecked(
  kuisioner: Kuisioner,
  indexKriteria: number,
  indexSubkriteria: number,
  optionId: string
): boolean {
  if (
    kuisioner &&
    kuisioner[indexKriteria] &&
    kuisioner[indexKriteria][indexSubkriteria] &&
    kuisioner[indexKriteria][indexSubkriteria].optionId === optionId
  ) {
    return true
  }
  return false
}

function getTotalNilai(kuisioner: Kuisioner, kriterias: Kriteria[]) {
  return kuisioner.reduce((acc, kriteria, indexKriteria) => {
    return (
      acc +
      kriteria.reduce((acc, subkriteria, indexSubkriteria) => {
        return (
          acc +
          subkriteria.skor * +kriterias[indexKriteria].subkriteria[indexSubkriteria].bobot
        )
      }, 0)
    )
  }, 0)
}

const Subkriteria = styled.div`
  padding: 0.5em 1em;
  display: flex;
  column-gap: 1em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const SubkriteriaMoblile = styled.div`
  padding: 0.5em 1em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const Header = styled.div<{ white?: boolean }>`
  padding: 0.5em 1em;
  display: flex;
  color: ${props => (props.white ? 'white' : 'rgba(0, 0, 0, 0.8)')};
  font-weight: 400;
`

const Nama = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40%;
`
const Option = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  margin-left: 5px;
  width: 40%;
`
const Bobot = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 10%;
`
const Nilai = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 10%;
`

const OptionMobile = styled.div`
  padding: 0.5em;
`
