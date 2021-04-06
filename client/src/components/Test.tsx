import { FC } from 'react'
import { useParams } from 'react-router-dom'

export const Test: FC = () => {
  const { id } = useParams<{ id: string }>()

  return <div>{id}</div>
}
