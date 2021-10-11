import { FC, Fragment } from 'react'
import {
  TambahFormPenilaianContainer as TambahFormPenilaianDetailContainer,
  Kategori,
  Subkriteria,
  Row,
  Small,
  Pilihan,
} from './TambahFormPenilaian'
import { Card, Form, Row as Row2, Col } from 'react-bootstrap'
import { useStoreState } from '../../store/hooks'
import { useParams } from 'react-router-dom'
import { useScreenType } from '../hooks/useScreenType'
import { FormPenilaian } from '../../store/models/formPenilaianModel'

export const FormPenilaianDetail: FC = () => {
  const { forms } = useStoreState(state => state.formPenilaianModel)
  const { formId } = useParams<{ formId: string }>()
  const screenType = useScreenType()

  function getFormById(id: string) {
    return forms.find(form => form._id === id)
  }
  return (
    <TambahFormPenilaianDetailContainer screenType={screenType}>
      <Form>
        <Form.Control
          size='lg'
          type='text'
          placeholder='Nama form'
          className='mb-4'
          disabled
          value={getFormById(formId)?.namaFormPenilaian || ''}
        />

        {getFormById(formId)?.kriterias.map((kriteria, idxKriteria) => (
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
                type='text'
                placeholder='Nama kriteria'
                disabled
              />
            </Kategori>

            {kriteria.subkriteria.map((subkriteria, idxSubkriteria) => (
              <Fragment key={idxSubkriteria}>
                <Subkriteria>
                  <Row>
                    <Form.Control
                      type='text'
                      placeholder='Sub kriteria'
                      disabled
                      value={subkriteria.namaSubkriteria}
                    />
                    <Small>
                      <Form.Control
                        type='number'
                        min={0}
                        placeholder='Bobot'
                        disabled
                        value={subkriteria.bobot}
                      />
                    </Small>
                  </Row>
                </Subkriteria>
                {subkriteria.option.map((option, idxOption) => (
                  <Pilihan key={idxOption}>
                    <Row>
                      <Form.Control
                        type='text'
                        placeholder='Pilihan'
                        disabled
                        value={option.namaOption}
                      />
                      <Small>
                        <Form.Control
                          type='number'
                          min={0}
                          placeholder='Skor'
                          disabled
                          value={option.skor}
                        />
                      </Small>
                    </Row>
                  </Pilihan>
                ))}
              </Fragment>
            ))}
          </Card>
        ))}

        <Row2>
          <Col xs={4}>
            <Form.Text className='text-muted'>Skor minimum untuk lulus</Form.Text>
            <Form.Control
              type='number'
              min={0}
              placeholder=''
              disabled
              value={getFormById(formId)?.rekomendasiKelulusan || ''}
            />
          </Col>
          <Col xs={4}>
            <Form.Text className='text-muted'>Total skor maksimum</Form.Text>
            <h3 className='text-secondary'>
              {getTotalSkorMaksimum(getFormById(formId))}
            </h3>
          </Col>
        </Row2>
      </Form>
    </TambahFormPenilaianDetailContainer>
  )
}

function getTotalSkorMaksimum(form: FormPenilaian | undefined) {
  if (form) {
    const total = form.kriterias.reduce(
      (acc, kriteria) =>
        acc +
        kriteria.subkriteria.reduce(
          (acc, subkriteria) =>
            acc + +subkriteria.bobot * Math.max(...subkriteria.option.map(a => +a.skor)),
          0
        ),
      0
    )
    return total
  }
  return 0
}
