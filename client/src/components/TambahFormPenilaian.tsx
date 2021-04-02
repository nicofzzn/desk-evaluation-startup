import { FC, Fragment } from 'react'
import styled from 'styled-components'
import { Alert, Button, Card, Form, ListGroup, Spinner } from 'react-bootstrap'
import useTambahFormPenilaianReducer from './utils/useTambahFormPenilaianReducer'

export const TambahFormPenilaian: FC = () => {
  const { form, formDispatch } = useTambahFormPenilaianReducer()

  return (
    <TambahFormPenilaianContainer>
      <Form>
        <ListGroup className='mb-4'>
          <Form.Control
            size='lg'
            type='text'
            placeholder='Nama form'
            value={form.namaFormPenilaian}
            onChange={e =>
              formDispatch({
                type: 'CHANGE_NAMA_FORM',
                payload: e.target.value,
              })
            }
          />
        </ListGroup>
        {form.kriteria.map((kriteria, idxKriteria) => (
          <Card
            key={idxKriteria}
            style={{
              backgroundColor: 'rgba(0,0,0,0)',
            }}
            className='p-3'
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

            {kriteria.pertanyaan.map((pertanyaan, idxPertanyaan) => (
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
                    <Button variant='secondary' className='ml-2'>
                      X
                    </Button>
                  </Row>
                </Pertanyaan>
                {pertanyaan.option.map((option, idxOption) => (
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
                      <Button variant='secondary' className='ml-2'>
                        X
                      </Button>
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
            ))}

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
              <Button size='sm' className='ml-3' variant='outline-secondary'>
                Hapus Kategori
              </Button>
            </SmallButtonContainer>
          </Card>
        ))}
      </Form>
    </TambahFormPenilaianContainer>
  )
}

const TambahFormPenilaianContainer = styled.div`
  width: 800px;
  padding-bottom: 5em;
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
