import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import { Subkriteria as SubkriteriaInterface } from '../hooks/useTambahFormPenilaianReducer'
import { useStoreActions, useStoreState } from '../../store/hooks'
import { Nilai as NilaiInterface, Startup } from '../../store/models/startupModel'
import { useScreenType } from '../hooks/useScreenType'

interface Props {
  nilai: NilaiInterface | undefined
  startup: Startup
}

const initialState: Array<Array<number>> | undefined = []

export const FormKuisioner: FC<Props> = ({ nilai, startup }) => {
  const [kuisioner, setKuisioner] = useState(initialState)
  const { alert, loading } = useStoreState(state => state.startupModel)
  const { user } = useStoreState(state => state.userModel)
  const { nilaiStartup } = useStoreActions(actions => actions.startupModel)
  const screenType = useScreenType()
  const {
    formPenilaian: { kriterias, rekomendasiKelulusan },
    _id: startupId,
  } = startup

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
    // if (kuisioner)
    //   if (rekomendasiKelulusan)
    //     nilaiStartup({
    //       startupId: startupId,
    //       nilai: kuisioner,
    //       totalNilai: getTotalNilai(),
    //     })
  }

  function getNilaiSubkriteria(
    bobot: number,
    idxKriteria: number,
    idxSubkriteria: number
  ) {
    if (kuisioner && kuisioner[idxKriteria] && kuisioner[idxKriteria][idxSubkriteria])
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
                acc + +kriterias[idxKriteria].subkriteria[idxSubkriteria].bobot * value,
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
    setKuisioner([...kriterias.map(() => [])])
    if (nilai) setKuisioner([])
  }, [kriterias, nilai])

  // if (screenType === 'mobile') {
  //   return (
  //     <>
  //       {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
  //       <Form onSubmit={onSubmit}>
  //         {kriterias?.map((kriteria, idxKriteria) => (
  //           <Card key={idxKriteria} className='mb-3'>
  //             <Card.Header>
  //               <span className='font-weight-bold'>{kriteria.namaKriteria}</span>
  //             </Card.Header>
  //             {kriteria.subkriteria.map((subkriteria, idxSubkriteria) => (
  //               <SubkriteriaMoblile key={idxSubkriteria}>
  //                 <span>{subkriteria.namaSubkriteria}</span>
  //                 <OptionMobile>
  //                   {subkriteria.option.map((option, idxOption) => (
  //                     <Form.Check
  //                       key={idxOption}
  //                       name={subkriteria.namaSubkriteria}
  //                       type='radio'
  //                       label={`${option.namaOption} (${option.skor ? option.skor : 0})`}
  //                       value={option.skor}
  //                       onChange={e => onChange(e, idxKriteria, idxSubkriteria)}
  //                       checked={
  //                         kuisioner &&
  //                         kuisioner[idxKriteria] &&
  //                         kuisioner[idxKriteria][idxSubkriteria] === option.skor
  //                       }
  //                       disabled={user?.role !== 'penilai' || nilai ? true : false}
  //                       required
  //                     />
  //                   ))}
  //                 </OptionMobile>
  //               </SubkriteriaMoblile>
  //             ))}
  //           </Card>
  //         ))}
  //         {kriterias && user?.role !== 'penilai' ? null : (
  //           <Button
  //             disabled={loading || nilai ? true : false}
  //             className='float-right'
  //             variant='primary'
  //             type='submit'
  //           >
  //             {loading ? <Spinner animation='border' /> : 'Submit'}
  //           </Button>
  //         )}
  //       </Form>
  //     </>
  //   )
  // }

  return (
    <>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      <Header>
        <Nama>Kriteria/Subkriteria</Nama>
        <Option>Opsi Pilihan (skor)</Option>
        <Bobot>Bobot</Bobot>
        <Nilai>
          <div>Nilai</div>
          <Form.Text className='text-muted'>(nilai * bobot)</Form.Text>
        </Nilai>
      </Header>
      <Form onSubmit={onSubmit}>
        {kriterias.map((kriteria, idxKriteria) => (
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
                        label={`${option.namaOption} (${option.skor ? option.skor : 0})`}
                        value={option.skor}
                        onChange={e => onChange(e, idxKriteria, idxSubkriteria)}
                        checked={
                          kuisioner &&
                          kuisioner[idxKriteria] &&
                          kuisioner[idxKriteria][idxSubkriteria] === option.skor
                        }
                        disabled={user?.role !== 'penilai' || nilai ? true : false}
                        required
                      />
                    ))}
                  </Form.Group>
                </Option>
                <Bobot>{subkriteria.bobot}</Bobot>
                <Nilai>
                  {getNilaiSubkriteria(+subkriteria.bobot, idxKriteria, idxSubkriteria)}
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

  // return (
  //   <>
  //     {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
  //     <Header>
  //       <Nama>Kriteria/Subkriteria</Nama>
  //       <Option>Opsi Pilihan (skor)</Option>
  //       <Bobot>Bobot</Bobot>
  //       <Nilai>
  //         <div>Nilai</div>
  //         <Form.Text className='text-muted'>(nilai * bobot)</Form.Text>
  //       </Nilai>
  //     </Header>
  //     <Form onSubmit={onSubmit}>
  //       {kriterias.map((kriteria, idxKriteria) => (
  //         <Card key={idxKriteria} className='mb-4'>
  //           <Card.Header className='p-0 pt-2 pb-2 bg-secondary'>
  //             <Header white>
  //               <Nama>{kriteria.namaKriteria}</Nama>
  //               <Option></Option>
  //               <Bobot>{getBobotKriteria(kriteria.subkriteria)}</Bobot>
  //               <Nilai>{getNilaiKriteria(idxKriteria)}</Nilai>
  //             </Header>
  //           </Card.Header>
  //           {kriteria.subkriteria.map((subkriteria, idxSubkriteria) => (
  //             <Subkriteria key={idxSubkriteria}>
  //               <Nama>{subkriteria.namaSubkriteria}</Nama>
  //               <Option>
  //                 <Form.Group>
  //                   {subkriteria.option.map((option, idxOption) => (
  //                     <Form.Check
  //                       key={idxOption}
  //                       name={subkriteria.namaSubkriteria}
  //                       type='radio'
  //                       label={`${option.namaOption} (${option.skor ? option.skor : 0})`}
  //                       value={option.skor}
  //                       onChange={e => onChange(e, idxKriteria, idxSubkriteria)}
  //                       checked={
  //                         kuisioner &&
  //                         kuisioner[idxKriteria] &&
  //                         kuisioner[idxKriteria][idxSubkriteria] === option.skor
  //                       }
  //                       disabled={user?.role !== 'penilai' || nilai ? true : false}
  //                       required
  //                     />
  //                   ))}
  //                 </Form.Group>
  //               </Option>
  //               <Bobot>{subkriteria.bobot}</Bobot>
  //               <Nilai>
  //                 {getNilaiSubkriteria(+subkriteria.bobot, idxKriteria, idxSubkriteria)}
  //               </Nilai>
  //             </Subkriteria>
  //           ))}
  //         </Card>
  //       ))}
  //       {kriterias && user?.role !== 'penilai' ? null : (
  //         <Button
  //           disabled={loading || nilai ? true : false}
  //           className='float-right'
  //           variant='custom-primary'
  //           type='submit'
  //         >
  //           {loading ? <Spinner animation='border' /> : 'Submit'}
  //         </Button>
  //       )}
  //     </Form>
  //   </>
  // )
}

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

const SubkriteriaMoblile = styled.div`
  padding: 0.5em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
`

const OptionMobile = styled.div`
  padding: 0.5em;
`
