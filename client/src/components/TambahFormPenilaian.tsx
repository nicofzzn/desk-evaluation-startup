import { FC, Fragment, useEffect } from 'react'
import styled from 'styled-components'
import {
  Alert,
  Button,
  Card,
  Form,
  Row as Row2,
  Col,
  Spinner,
} from 'react-bootstrap'
import useTambahFormPenilaianReducer, {
  Subkriteria as SubkriteriaInterface,
  Kriteria,
} from './hooks/useTambahFormPenilaianReducer'
import { useStoreActions, useStoreState } from '../store/hooks'

export const TambahFormPenilaian: FC = () => {
  const { form, formDispatch } = useTambahFormPenilaianReducer()
  const { addFormPenilaian, setAlert } = useStoreActions(
    actions => actions.formPenilaianModel
  )
  const { alert, loading } = useStoreState(state => state.formPenilaianModel)

  useEffect(() => {
    return () => {
      setAlert(null)
      formDispatch({ type: 'CLEAR_FORM', payload: {} })
    }
  }, [formDispatch, setAlert])

  return (
    <TambahFormPenilaianContainer>
      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
      {loading ? (
        <SpinnerContainer>
          <Spinner animation='border' />
        </SpinnerContainer>
      ) : (
        <Form
          onSubmit={e => {
            e.preventDefault()
            addFormPenilaian({
              form,
              clearForm: () =>
                formDispatch({ type: 'CLEAR_FORM', payload: {} }),
            })
          }}
        >
          <Form.Control
            size='lg'
            type='text'
            placeholder='Nama form'
            className='mb-4'
            value={form.namaFormPenilaian}
            onChange={e =>
              formDispatch({
                type: 'CHANGE_NAMA_FORM',
                payload: e.target.value,
              })
            }
          />

          {form.kriterias.map((kriteria, idxKriteria, kriterias) => (
            <Card
              key={idxKriteria}
              style={{
                backgroundColor: 'rgba(0,0,0,0)',
              }}
              className='p-3 mb-3'
              bg='light'
            >
              <Kategori>
                <Form.Control
                  value={kriteria.namaKriteria}
                  onChange={e =>
                    formDispatch({
                      type: 'CHANGE_NAMA_KRITERIA',
                      payload: {
                        idxKriteria,
                        value: e.target.value,
                      },
                    })
                  }
                  type='text'
                  placeholder='Nama kriteria'
                />
              </Kategori>

              {kriteria.subkriteria.map(
                (subkriteria, idxSubkriteria, subkriterias) => (
                  <Fragment key={idxSubkriteria}>
                    <Subkriteria>
                      <Row>
                        <Form.Control
                          type='text'
                          placeholder='Sub kriteria'
                          value={subkriteria.namaSubkriteria}
                          onChange={e =>
                            formDispatch({
                              type: 'CHANGE_SUBKRITERIA',
                              payload: {
                                idxKriteria,
                                idxSubkriteria,
                                value: e.target.value,
                              },
                            })
                          }
                        />
                        <Small>
                          <Form.Control
                            type='number'
                            min={0}
                            placeholder='Bobot'
                            value={subkriteria.bobot}
                            onChange={e =>
                              formDispatch({
                                type: 'CHANGE_BOBOT',
                                payload: {
                                  idxKriteria,
                                  idxSubkriteria,
                                  value: e.target.value,
                                },
                              })
                            }
                          />
                        </Small>
                        {subkriterias.length > 1 && (
                          <Button
                            variant='outline-danger'
                            className='ml-2'
                            onClick={e =>
                              formDispatch({
                                type: 'HAPUS_SUBKRITERIA',
                                payload: {
                                  idxKriteria,
                                  idxSubkriteria,
                                },
                              })
                            }
                          >
                            X
                          </Button>
                        )}
                      </Row>
                    </Subkriteria>
                    {subkriteria.option.map((option, idxOption, options) => (
                      <Pilihan key={idxOption}>
                        <Row>
                          <Form.Control
                            type='text'
                            placeholder='Pilihan'
                            value={option.namaOption}
                            onChange={e =>
                              formDispatch({
                                type: 'CHANGE_OPTION',
                                payload: {
                                  idxKriteria,
                                  idxSubkriteria,
                                  idxOption,
                                  value: e.target.value,
                                },
                              })
                            }
                          />
                          <Small>
                            <Form.Control
                              type='number'
                              min={0}
                              placeholder='Skor'
                              value={option.skor}
                              onChange={e =>
                                formDispatch({
                                  type: 'CHANGE_SKOR',
                                  payload: {
                                    idxKriteria,
                                    idxSubkriteria,
                                    idxOption,
                                    value: e.target.value,
                                  },
                                })
                              }
                            />
                          </Small>
                          {options.length > 1 && (
                            <Button
                              variant='outline-danger'
                              className='ml-2'
                              onClick={e =>
                                formDispatch({
                                  type: 'HAPUS_OPTION',
                                  payload: {
                                    idxKriteria,
                                    idxSubkriteria,
                                    idxOption,
                                  },
                                })
                              }
                            >
                              X
                            </Button>
                          )}
                        </Row>
                      </Pilihan>
                    ))}

                    <TambahPilihan
                      className='text-muted'
                      onClick={() => {
                        formDispatch({
                          type: 'TAMBAH_OPTION',
                          payload: {
                            idxKriteria,
                            idxSubkriteria,
                          },
                        })
                      }}
                    >
                      Tambah pilihan
                    </TambahPilihan>
                  </Fragment>
                )
              )}

              <SmallButtonContainer className='ml-auto m-3'>
                <Button
                  size='sm'
                  className='ml-3'
                  variant='outline-secondary'
                  onClick={() => {
                    formDispatch({
                      type: 'TAMBAH_SUBKRITERIA',
                      payload: { idxKriteria },
                    })
                  }}
                >
                  Tambah sub kriteria
                </Button>
                <Button
                  size='sm'
                  className='ml-3'
                  variant='outline-secondary'
                  onClick={() => {
                    formDispatch({
                      type: 'TAMBAH_KRITERIA',
                      payload: { idxKriteria },
                    })
                  }}
                >
                  Tambah Kriteria
                </Button>
                {kriterias.length > 1 && (
                  <Button
                    size='sm'
                    className='ml-3'
                    variant='outline-danger'
                    onClick={() => {
                      formDispatch({
                        type: 'HAPUS_KRITERIA',
                        payload: { idxKriteria },
                      })
                    }}
                  >
                    Hapus Kriteria
                  </Button>
                )}
              </SmallButtonContainer>
            </Card>
          ))}

          <Row2>
            <Col xs={4}>
              <Form.Text className='text-muted'>
                Skor minimum untuk lulus
              </Form.Text>
              <Form.Control
                type='number'
                min={0}
                placeholder=''
                value={form.rekomendasiKelulusan}
                onChange={e =>
                  formDispatch({
                    type: 'CHANGE_REKOMENDASI_KELULUSAN',
                    payload: { value: e.target.value },
                  })
                }
              />
            </Col>
            <Col xs={4}>
              <Form.Text className='text-muted'>Total skor maksimum</Form.Text>
              <h3>{getTotalSkorMaksimum(form.kriterias)}</h3>
            </Col>
          </Row2>

          <Button
            disabled={form.namaFormPenilaian === '' ? true : false}
            type='submit'
            className='float-right'
          >
            {loading ? <Spinner animation='border' /> : 'Submit'}
          </Button>
        </Form>
      )}
    </TambahFormPenilaianContainer>
  )
}

export function getTotalSkorMaksimum(kriteria: Kriteria[] | undefined) {
  if (kriteria) {
    const total = kriteria.reduce(
      (acc, kriteria) => acc + getTotalSKorKriteria(kriteria),
      0
    )
    return total
  }
}

export function getTotalSkorSubkriteria(subkriteria: SubkriteriaInterface) {
  return (
    +subkriteria.bobot *
    subkriteria.option.reduce((acc, option) => acc + +option.skor, 0)
  )
}

export function getTotalSKorKriteria(kriteria: Kriteria) {
  return kriteria.subkriteria.reduce(
    (acc, subkriteria) => acc + getTotalSkorSubkriteria(subkriteria),
    0
  )
}

export const TambahFormPenilaianContainer = styled.div`
  width: 800px;
  padding-bottom: 5em;
  /* margin: 0 4em; */
`
export const Kategori = styled.div`
  margin: 0.5em 0;
`
export const Subkriteria = styled.div`
  margin: 0.5em 0 0.5em 2em;
  padding-top: 1em;
  border-top: 1px solid rgba(0, 0, 0, 0.3);
`
export const Pilihan = styled.div`
  margin: 0.5em 0 0.5em 4em;
`
export const Row = styled.div`
  display: flex;
`
export const Small = styled.div`
  width: 110px;
  margin-left: 0.5em;
`
export const SmallButtonContainer = styled.div`
  width: fit-content;
`
export const TambahPilihan = styled.div`
  &:hover {
    cursor: pointer;
    opacity: 80%;
  }
  margin: 0.5em 4em;
  width: fit-content;
`
const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  height: 50vh;
`
