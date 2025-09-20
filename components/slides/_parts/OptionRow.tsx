type OptionItem = { id: string; label: string; price: number; checked: boolean };

export function OptionRow({ item, onToggle, onLabel, onPrice }: {
  item: OptionItem;
  onToggle: (id: string) => void;
  onLabel: (id: string, v: string) => void;
  onPrice: (id: string, v: number) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 py-1 min-h-[44px]">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
        />
        <input
          value={item.label}
          onChange={e => onLabel(item.id, e.target.value)}
          className="w-full border rounded px-2 py-1 text-xs"
          placeholder="オプション名"
        />
      </label>
      <input
        type="number"
        value={item.price}
        onChange={e => onPrice(item.id, Number(e.target.value))}
        className="w-20 text-right border rounded px-2 py-1 text-xs tabular-nums"
      />
    </div>
  );
}

export type { OptionItem };