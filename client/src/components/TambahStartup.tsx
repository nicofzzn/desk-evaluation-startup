import { FC } from 'react'
import styled from 'styled-components'
import { Button, Form } from 'react-bootstrap'

const TambahStartupContainer = styled.div`
  width: 500px;
`

export const TambahStartup: FC = () => {
  return (
    <TambahStartupContainer>
      <Form>
        <Form.Group>
          <Form.Label>Nama startup</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group>
          <Form.Label>Tahun pendanaan</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group>
          <Form.Label>Versi Profil Pendanaan</Form.Label>
          <Form.Control type='text' />
        </Form.Group>

        <Form.Group>
          <Form.Label>Form penilaian</Form.Label>
          <Form.Control as='select'>
            <option value=''>form penilaian 1</option>
            <option value=''>form 2</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.File label='File proposal' />
        </Form.Group>
        <Button className='float-right' variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </TambahStartupContainer>
  )
}
