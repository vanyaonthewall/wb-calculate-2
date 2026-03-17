import brandImg from '../img/picture=brand.png'

type BannerProps = {
  title?: string
  description?: string
  imageUrl?: string
}

export function Banner({
  title = 'Брендинг бесплатно',
  description = 'Пришлём вывеску, кронштейн и контроллер для нового ПВЗ',
  imageUrl = brandImg,
}: BannerProps) {
  return (
    <div
      className="relative rounded-[var(--round-l,24px)] overflow-hidden px-[var(--pad-m,24px)] py-[var(--pad-s,16px)]"
      style={{ backgroundColor: 'var(--purple-500, #9744eb)' }}
    >
      {/* Текст */}
      <div className="flex flex-col gap-[var(--gap-3xs,4px)] pr-[var(--pad-l,32px)]">
        <p className="font-['Unbounded',sans-serif] font-bold text-[length:var(--f-size-l,20px)] leading-[var(--f-lh-m,24px)] text-[color:var(--grey-0,white)] line-clamp-1">
          {title}
        </p>
        <p className="font-inter font-normal text-[length:var(--f-size-xs,14px)] leading-[var(--f-lh-s,20px)] text-[color:var(--grey-0,white)] line-clamp-2">
          {description}
        </p>
      </div>

      {/* Картинка — прибита к правому краю, центр по вертикали */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-[80px] h-[80px] pointer-events-none"
        style={{ right: '-5px' }}
      >
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
