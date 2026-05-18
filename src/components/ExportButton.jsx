import { motion } from 'framer-motion'
import { RiDownloadLine } from 'react-icons/ri'
import { exportToCSV } from '../utils/exportCSV'
import toast from 'react-hot-toast'

export default function ExportButton({ data, filename }) {
  function handleExport() {
    if (!data?.length) {
      toast.error('No data to export')
      return
    }
    exportToCSV(data, filename)
    toast.success(`Exported ${data.length.toLocaleString()} rows`)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-500/25 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 text-sm font-medium transition-all"
    >
      <RiDownloadLine size={15} />
      Export CSV
    </motion.button>
  )
}
