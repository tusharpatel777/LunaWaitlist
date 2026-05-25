import { RiSearchLine, RiFilterLine } from 'react-icons/ri'
import CustomSelect from './CustomSelect'

const DATE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week',  label: 'This Week' },
  { value: 'month', label: 'This Month' },
]

const DEVICE_OPTIONS = [
  { value: 'Mobile',  label: 'Mobile' },
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Tablet',  label: 'Tablet' },
]

export default function SearchFilter({
  search,    onSearch,
  device,    onDevice,
  country,   onCountry,
  source,    onSource,
  dateRange, onDateRange,
  countries    = [],
  sources      = [],
  hasDeviceData = false,
}) {
  const countryOptions = countries.map(c => ({ value: c, label: c }))
  const sourceOptions  = sources.map(s => ({ value: s, label: s }))
  const hasFilters     = device || country || source || dateRange

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <RiSearchLine
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            size={15}
          />
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search by email, country, source…"
            className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/80 text-sm placeholder:text-white/25 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        {/* Date range */}
        <CustomSelect
          value={dateRange}
          onChange={onDateRange}
          options={DATE_OPTIONS}
          placeholder="All Time"
        />

        {/* Device */}
        {hasDeviceData && (
          <CustomSelect
            value={device}
            onChange={onDevice}
            options={DEVICE_OPTIONS}
            placeholder="All Devices"
          />
        )}

        {/* Country */}
        {countryOptions.length > 0 && (
          <CustomSelect
            value={country}
            onChange={onCountry}
            options={countryOptions}
            placeholder="All Countries"
          />
        )}

        {/* Source */}
        {sourceOptions.length > 0 && (
          <CustomSelect
            value={source}
            onChange={onSource}
            options={sourceOptions}
            placeholder="All Sources"
          />
        )}
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-1.5">
          <RiFilterLine size={12} className="text-white/30" />
          {dateRange && (
            <Chip
              label={DATE_OPTIONS.find(o => o.value === dateRange)?.label ?? dateRange}
              onRemove={() => onDateRange('')}
            />
          )}
          {device  && <Chip label={device}  onRemove={() => onDevice('')}  />}
          {country && <Chip label={country} onRemove={() => onCountry('')} />}
          {source  && <Chip label={source}  onRemove={() => onSource('')}  />}
        </div>
      )}
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors leading-none">×</button>
    </span>
  )
}
