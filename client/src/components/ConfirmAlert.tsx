import { FC } from 'react'
import { Button, Card } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useStoreActions } from '../store/hooks'

interface Props {
  formId?: string | undefined
  startupId?: string | undefined
  penilaiId?: string | undefined
}

export const ConfirmAlert: FC<Props> = ({ formId, startupId, penilaiId }) => {
  const { deleteForms } = useStoreActions(actions => actions.formPenilaianModel)
  const { deleteStartup } = useStoreActions(actions => actions.startupModel)
  const { deletePenilai } = useStoreActions(actions => actions.userModel)

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
                if (formId) deleteForms(formId)
                if (startupId) deleteStartup(startupId)
                if (penilaiId) deletePenilai({ id: penilaiId })
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
