import { useRef, useState } from 'react'
import { Button } from '@shared/ui'
import { useUploadAvatar } from '../model/useUploadAvatar'
import { fileSchema } from '../model/validation' //схема валидации файла
import { useIsMutating } from '@tanstack/react-query' //хук для отслеживания мутаций

const UploadAvatar = () => {
  const { mutate, isPending, isError, reset } = useUploadAvatar()
  const [errorValidation, setErrorValidation] = useState<string | null>(null)
  const isMutating = useIsMutating({ mutationKey: ['avatar'] }) //отслеживаем есть ли любые мутации с аватаром
  const fileInputRef = useRef<HTMLInputElement>(null) //ref для input типа file

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const file = input.files?.[0]

    reset() //сбросить ошибку прошлой загрузки
    setErrorValidation(null) //сбросить ошибку валидации
    const parsed = fileSchema.safeParse(file)
    if (!parsed.success) {
      //если файл не прошел валидацию, выводим ошибку в UI
      setErrorValidation(parsed.error.issues[0].message)
      input.value = '' //очистить file input
      return
    }
    // здесь file уже гарантированно есть и прошел валидацию
    mutate(file, {
      onSettled: () => {
        input.value = '' //очистить file input
      },
    })
  }
  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
        accept="image/*"
      />
      {/* input типа file для загрузки файла */}
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending || Boolean(isMutating)}
        backgroundColor="#fcb75e"
      >
        {isPending ? 'Загрузка...' : 'Изменить аватар'}
      </Button>
      {errorValidation && <p>{errorValidation}</p>} {/*ошибка валидации*/}
      {isError && <p>Ошибка при загрузке аватара</p>} {/*ошибка при загрузке аватара мутации*/}
    </div>
  )
}

export default UploadAvatar
