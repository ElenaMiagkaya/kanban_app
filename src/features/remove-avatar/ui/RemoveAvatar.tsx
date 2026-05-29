import { Button } from '@shared/ui'
import { useRemoveAvatar } from '../model/useRemoveAvatar'
import { useIsMutating } from '@tanstack/react-query' //хук для отслеживания мутаций

const RemoveAvatar = () => {
  const { mutate, isPending, isError } = useRemoveAvatar()
  const isMutating = useIsMutating({ mutationKey: ['avatar'] }) //отслеживаем есть ли любые мутации с аватаром

  return (
    <div>
      <Button
        onClick={() => mutate()}
        disabled={isPending || Boolean(isMutating)}
        backgroundColor="red"
      >
        {isPending ? 'Удаление...' : 'Удалить аватар'}
      </Button>
      {isError && <p>Ошибка при удалении аватара</p>}
    </div>
  )
}

export default RemoveAvatar
