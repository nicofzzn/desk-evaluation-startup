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
  Pertanyaan as PertanyaanInterface,
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
      <Form
        onSubmit={e => {
          e.preventDefault()
          addFormPenilaian({
            form,
            clearForm: () => formDispatch({ type: 'CLEAR_FORM', payload: {} }),
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

            {kriteria.pertanyaan.map(
              (pertanyaan, idxPertanyaan, pertanyaans) => (
                <Fragment key={idxPertanyaan}>
                  <Pertanyaan>
                    <Row>
                      <Form.Control
                        type='text'
                        placeholder='Pertanyaan'
                        value={pertanyaan.namaPertanyaan}
                        onChange={e =>
                          formDispatch({
                            type: 'CHANGE_PERTANYAAN',
                            payload: {
                              idxKriteria,
                              idxPertanyaan,
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
                          value={pertanyaan.bobot}
                          onChange={e =>
                            formDispatch({
                              type: 'CHANGE_BOBOT',
                              payload: {
                                idxKriteria,
                                idxPertanyaan,
                                value: e.target.value,
                              },
                            })
                          }
                        />
                      </Small>
                      {pertanyaans.length > 1 && (
                        <Button
                          variant='secondary'
                          className='ml-2'
                          onClick={e =>
                            formDispatch({
                              type: 'HAPUS_PERTANYAAN',
                              payload: {
                                idxKriteria,
                                idxPertanyaan,
                              },
                            })
                          }
                        >
                          X
                        </Button>
                      )}
                    </Row>
                  </Pertanyaan>
                  {pertanyaan.option.map((option, idxOption, options) => (
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
                                idxPertanyaan,
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
                                  idxPertanyaan,
                                  idxOption,
                                  value: e.target.value,
                                },
                              })
                            }
                          />
                        </Small>
                        {options.length > 1 && (
                          <Button
                            variant='secondary'
                            className='ml-2'
                            onClick={e =>
                              formDispatch({
                                type: 'HAPUS_OPTION',
                                payload: {
                                  idxKriteria,
                                  idxPertanyaan,
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
                          idxPertanyaan,
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
                    type: 'TAMBAH_PERTANYAAN',
                    payload: { idxKriteria },
                  })
                }}
              >
                Tambah pertanyaan
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
                  variant='outline-secondary'
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
            <Form.Control type='number' min={0} placeholder='' />
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
    </TambahFormPenilaianContainer>
  )
}

function getTotalSkorMaksimum(kriteria: Array<Kriteria>) {
  const total = kriteria.reduce(
    (acc, kriteria) => acc + getTotalSKorKriteria(kriteria),
    0
  )
  return total
}

function getTotalSkorPertanyaan(pertanyaan: PertanyaanInterface) {
  return (
    +pertanyaan.bobot *
    pertanyaan.option.reduce((acc, option) => acc + +option.skor, 0)
  )
}

function getTotalSKorKriteria(kriteria: Kriteria) {
  return kriteria.pertanyaan.reduce(
    (acc, pertanyaan) => acc + getTotalSkorPertanyaan(pertanyaan),
    0
  )
}

const TambahFormPenilaianContainer = styled.div`
  width: 800px;
  padding-bottom: 5em;
  /* margin: 0 4em; */
`
const Kategori = styled.div`
  margin: 0.5em 0;
`
const Pertanyaan = styled.div`
  margin: 0.5em 0 0.5em 2em;
  padding-top: 1em;
  border-top: 1px solid rgba(0, 0, 0, 0.3);
`
const Pilihan = styled.div`
  margin: 0.5em 0 0.5em 4em;
`
const Row = styled.div`
  display: flex;
`
const Small = styled.div`
  width: 110px;
  margin-left: 0.5em;
`
const SmallButtonContainer = styled.div`
  width: fit-content;
`
const TambahPilihan = styled.div`
  &:hover {
    cursor: pointer;
    opacity: 80%;
  }
  margin: 0.5em 4em;
  width: fit-content;
`
