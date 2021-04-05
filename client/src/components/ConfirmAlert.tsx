import { FC } from 'react'
import { Button, Card } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

export const ConfirmAlert: FC<{ formId: string | undefined }> = ({
  formId,
}) => {
  const submit = () => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      customUI: ({ onClose }) => (
        <Card className='p-5'>
          <h3>Apakah anda yakin</h3>
          <div className='mr-auto'>
            <Button variant='secondary' className='m-2' onClick={onClose}>
              Tidak
            </Button>
            <Button
              variant='danger'
              className='m-2'
              onClick={() => {
                console.log(formId)
                onClose()
              }}
            >
              Ya
            </Button>
          </div>
        </Card>
      ),
      overlayClassName: 'overlay',
    })
  }

  return (
    <Button size='sm' variant='outline-danger' onClick={submit}>
      Hapus
    </Button>
  )
}
