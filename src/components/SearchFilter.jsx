import { RiSearchLine } from 'react-icons/ri'

const SELECT_CLS = 'px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/60 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer'

export default function SearchFilter({ search, onSearch, device, onDevice, country, onCountry, countries = [], hasDeviceData = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search by email…"
          className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/80 text-sm placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {hasDeviceData && (
        <select value={device} onChange={e => onDevice(e.target.value)} className={SELECT_CLS}>
          <option value="">All Devices</option>
          <option value="Mobile">Mobile</option>
          <option value="Desktop">Desktop</option>
          <option value="Tablet">Tablet</option>
        </select>
      )}

      {countries.length > 0 && (
        <select value={country} onChange={e => onCountry(e.target.value)} className={SELECT_CLS}>
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      )}
    </div>
  )
}
