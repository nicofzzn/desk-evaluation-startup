import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import {
  Subkriteria as SubkriteriaInterface,
  Kriteria as KriteriaInterface,
} from './hooks/useTambahFormPenilaianReducer'
import { useStoreActions, useStoreState } from '../store/hooks'
import { Nilai as NilaiInterface } from './StartupDetail'

interface Props {
  kriterias: KriteriaInterface[] | undefined
  startupId: string
  rekomendasiKelulusan: string | undefined
  nilai: NilaiInterface | null
}

export const FormKuisioner: FC<Props> = ({
  kriterias,
  startupId,
  rekomendasiKelulusan,
  nilai,
}) => {
  const [kuisioner, setKuisioner] = useState(initialState)
  const { alert, loading } = useStoreState(state => state.startupModel)
  const { nilaiStartup } = useStoreActions(actions => actions.startupModel)

  function onChange(
    e: React.ChangeEvent<HTMLInputElement>,
    idxKriteria: number,
    idxSubkriteria: number
  ) {
    if (kuisioner)
      setKuisioner([
        ...kuisioner.map((a, index) => {
          if (index === idxKriteria) a[idxSubkriteria] = +e.currentTarget.value
          return a
        }),
      ])
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (kuisioner)
      if (rekomendasiKelulusan)
        nilaiStartup({
          nilai: kuisioner,
          startupId,
          total: getTotalNilai(),
          rekomendasiKelulusan,
        })
  }

  function getNilaiSubkriteria(
    bobot: number,
    idxKriteria: number,
    idxSubkriteria: number
  ) {
    if (
      kuisioner &&
      kuisioner[idxKriteria] &&
      kuisioner[idxKriteria][idxSubkriteria]
    )
      return bobot * kuisioner[idxKriteria][idxSubkriteria]
    return 0
  }

  function getTotalNilai() {
    if (kuisioner)
      return kuisioner.reduce((acc, value, idxKriteria) => {
        if (kuisioner && kuisioner[idxKriteria] && kriterias)
          return (
            acc +
            value.reduce(
              (acc, value, idxSubkriteria) =>
                acc +
                +kriterias[idxKriteria].subkriteria[idxSubkriteria].bobot *
                  value,
              0
            )
          )
        return acc + 0
      }, 0)
    return 0
  }

  function getNilaiKriteria(idxKriteria: number) {
    if (kuisioner && kuisioner[idxKriteria] && kriterias)
      return kuisioner[idxKriteria].reduce(
        (acc, value, index) =>
          acc + +kriterias[idxKriteria].subkriteria[index].bobot * value,
        0
      )
  }

  useEffect(() => {
    if (kriterias) setKuisioner([...kriterias.map(() => [])])
    if (nilai) setKuisioner([...nilai.nilai])
  }, [kriterias, nilai])

  return (
    <>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      <Header>
        <Nama>Kriteria/Subkriteria</Nama>
        <Option>Opsi Pilihan (skor)</Option>
        <Bobot>Bobot</Bobot>
        <Nilai>
          <div>Nilai</div>
          <Form.Text className='text-muted'>(nilai*bobot)</Form.Text>
        </Nilai>
      </Header>
      <Form onSubmit={onSubmit}>
        {kriterias?.map((kriteria, idxKriteria) => (
          <Card key={idxKriteria} className='mb-4'>
            <Card.Header className='p-0 pt-2 pb-2 bg-secondary'>
              <Header white>
                <Nama>{kriteria.namaKriteria}</Nama>
                <Option></Option>
                <Bobot>{getBobotKriteria(kriteria.subkriteria)}</Bobot>
                <Nilai>{getNilaiKriteria(idxKriteria)}</Nilai>
              </Header>
            </Card.Header>
            {kriteria.subkriteria.map((subkriteria, idxSubkriteria) => (
              <Subkriteria key={idxSubkriteria}>
                <Nama>{subkriteria.namaSubkriteria}</Nama>
                <Option>
                  <Form.Group>
                    {subkriteria.option.map((option, idxOption) => (
                      <Form.Check
                        key={idxOption}
                        name={subkriteria.namaSubkriteria}
                        type='radio'
                        label={`${option.namaOption} (${
                          option.skor ? option.skor : 0
                        })`}
                        value={option.skor}
                        onChange={e => onChange(e, idxKriteria, idxSubkriteria)}
                        checked={
                          kuisioner &&
                          kuisioner[idxKriteria] &&
                          kuisioner[idxKriteria][idxSubkriteria] === option.skor
                        }
                        required
                        disabled={nilai ? true : false}
                      />
                    ))}
                  </Form.Group>
                </Option>
                <Bobot>{subkriteria.bobot}</Bobot>
                <Nilai>
                  {getNilaiSubkriteria(
                    +subkriteria.bobot,
                    idxKriteria,
                    idxSubkriteria
                  )}
                </Nilai>
              </Subkriteria>
            ))}
          </Card>
        ))}
        {kriterias && (
          <Button
            disabled={loading || nilai ? true : false}
            className='float-right'
            variant='primary'
            type='submit'
          >
            {loading ? <Spinner animation='border' /> : 'Submit'}
          </Button>
        )}
      </Form>
    </>
  )
}

const initialState: Array<Array<number>> | undefined = []

function getBobotKriteria(subkriterias: SubkriteriaInterface[]) {
  return subkriterias.reduce((acc, subkriteria) => acc + +subkriteria.bobot, 0)
}

const Subkriteria = styled.div`
  padding: 1em;
  padding-bottom: 0;
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
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
