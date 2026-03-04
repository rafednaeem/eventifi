'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'
import { Upload, CheckCircle2, AlertCircle, Loader2, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { importListingsFromCsv } from './actions'

const REQUIRED_FIELDS = ['title', 'type', 'base_price', 'city']
const OPTIONAL_FIELDS = ['description', 'address', 'whatsapp_number', 'phone_number']
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]

type ParsedRow = Record<string, string>

type ColumnMap = Record<string, string> // csvHeader -> targetField

export default function ImportPage() {
    const fileRef = useRef<HTMLInputElement>(null)
    const [csvHeaders, setCsvHeaders] = useState<string[]>([])
    const [csvRows, setCsvRows] = useState<ParsedRow[]>([])
    const [columnMap, setColumnMap] = useState<ColumnMap>({})
    const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'done'>('upload')
    const [result, setResult] = useState<{ count: number } | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null)

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setFileName(file.name)
        Papa.parse<ParsedRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete(results) {
                const headers = results.meta.fields || []
                setCsvHeaders(headers)
                setCsvRows(results.data as ParsedRow[])

                // Auto-map obvious matches
                const autoMap: ColumnMap = {}
                headers.forEach(h => {
                    const lower = h.toLowerCase().replace(/[\s_-]/g, '')
                    ALL_FIELDS.forEach(f => {
                        const fNorm = f.replace(/_/g, '')
                        if (lower === fNorm || lower.includes(fNorm)) {
                            autoMap[h] = f
                        }
                    })
                })
                setColumnMap(autoMap)
                setStep('map')
            },
        })
    }

    function handleMapChange(csvCol: string, targetField: string) {
        setColumnMap(prev => ({ ...prev, [csvCol]: targetField }))
    }

    function getMappedRows() {
        return csvRows.map(row => {
            const mapped: ParsedRow = {}
            Object.entries(columnMap).forEach(([csvCol, field]) => {
                if (field && field !== '_skip') {
                    mapped[field] = row[csvCol] || ''
                }
            })
            return mapped
        })
    }

    async function handleImport() {
        setLoading(true)
        setError(null)
        const rows = getMappedRows() as any[]
        const res = await importListingsFromCsv(rows)
        setLoading(false)
        if (res.success) {
            setResult({ count: res.count })
            setStep('done')
        } else {
            setError(res.error || 'Import failed.')
        }
    }

    function reset() {
        setCsvHeaders([])
        setCsvRows([])
        setColumnMap({})
        setStep('upload')
        setResult(null)
        setError(null)
        setFileName(null)
        if (fileRef.current) fileRef.current.value = ''
    }

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Import Listings</h1>
                <p className="text-muted-foreground mt-2">
                    Upload a CSV file with your existing venues or services to import them into Eventifi.
                    Imported listings will be submitted for admin review.
                </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 text-sm font-medium">
                {['upload', 'map', 'preview'].map((s, i) => (
                    <span key={s} className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step === s || (step === 'done' && i < 3) || ['map', 'preview', 'done'].indexOf(step) > i
                            ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {i + 1}
                        </span>
                        <span className={step === s ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                            {s === 'upload' ? 'Upload CSV' : s === 'map' ? 'Map Columns' : 'Preview & Import'}
                        </span>
                        {i < 2 && <span className="text-slate-300 mx-1">→</span>}
                    </span>
                ))}
            </div>

            {/* STEP 1: Upload */}
            {step === 'upload' && (
                <div
                    className="border-2 border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group"
                    onClick={() => fileRef.current?.click()}
                >
                    <Upload className="w-12 h-12 text-slate-400 group-hover:text-orange-500 transition-colors mb-4" />
                    <h3 className="font-extrabold text-slate-900 text-lg">Drop your CSV file here</h3>
                    <p className="text-slate-500 text-sm mt-1 mb-6">or click to select a file</p>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold">Choose File</Button>
                    <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
                </div>
            )}

            {/* Template download hint */}
            {step === 'upload' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
                    <h4 className="font-bold text-blue-800 text-sm mb-1">📄 CSV Format Guide</h4>
                    <p className="text-xs text-blue-700">
                        Include these columns: <code className="font-mono bg-blue-100 px-1 rounded">title</code>,{' '}
                        <code className="font-mono bg-blue-100 px-1 rounded">type</code> (venue or service),{' '}
                        <code className="font-mono bg-blue-100 px-1 rounded">base_price</code>,{' '}
                        <code className="font-mono bg-blue-100 px-1 rounded">city</code>,{' '}
                        and optionally: description, address, whatsapp_number, phone_number.
                    </p>
                </div>
            )}

            {/* STEP 2: Map Columns */}
            {step === 'map' && (
                <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-extrabold text-slate-900">Map Your Columns</h3>
                            <p className="text-slate-500 text-sm mt-0.5">
                                <FileText className="inline h-3.5 w-3.5 mr-1" />{fileName} — {csvRows.length} rows found
                            </p>
                        </div>
                        <button onClick={reset} className="text-slate-400 hover:text-slate-700 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {csvHeaders.map(header => (
                            <div key={header} className="flex items-center gap-4">
                                <span className="w-40 text-sm font-mono text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 truncate flex-shrink-0">
                                    {header}
                                </span>
                                <span className="text-slate-400">→</span>
                                <select
                                    value={columnMap[header] || '_skip'}
                                    onChange={e => handleMapChange(header, e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="_skip">— Skip this column —</option>
                                    {ALL_FIELDS.map(f => (
                                        <option key={f} value={f}>
                                            {f}{REQUIRED_FIELDS.includes(f) ? ' ✱' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={() => setStep('preview')}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
                    >
                        Preview Import →
                    </Button>
                </div>
            )}

            {/* STEP 3: Preview */}
            {step === 'preview' && (
                <div className="space-y-5">
                    <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-border flex items-center justify-between">
                            <div>
                                <h3 className="font-extrabold text-slate-900">Preview ({csvRows.length} listings)</h3>
                                <p className="text-slate-500 text-sm">Review before importing. Listings will be sent for admin approval.</p>
                            </div>
                            <button onClick={() => setStep('map')} className="text-sm text-slate-500 hover:text-slate-700 font-medium">← Back</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-4 py-3 text-left font-bold text-slate-600">Title</th>
                                        <th className="px-4 py-3 text-left font-bold text-slate-600">Type</th>
                                        <th className="px-4 py-3 text-left font-bold text-slate-600">Price</th>
                                        <th className="px-4 py-3 text-left font-bold text-slate-600">City</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getMappedRows().slice(0, 10).map((row, i) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                                            <td className="px-4 py-3 font-medium text-slate-900">{row.title || <span className="text-red-400">Missing</span>}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.type === 'venue' ? 'bg-blue-100 text-blue-700' : row.type === 'service' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-600'}`}>
                                                    {row.type || 'invalid'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">PKR {parseFloat(row.base_price || '0').toLocaleString()}</td>
                                            <td className="px-4 py-3 text-slate-600">{row.city || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {csvRows.length > 10 && (
                                <p className="px-4 py-3 text-sm text-slate-400 text-center">+{csvRows.length - 10} more rows not shown</p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <Button
                        onClick={handleImport}
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-base"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Importing...
                            </span>
                        ) : `Import ${csvRows.length} Listings`}
                    </Button>
                </div>
            )}

            {/* STEP 4: Done */}
            {step === 'done' && result && (
                <div className="flex flex-col items-center text-center py-12 bg-white border border-border rounded-2xl shadow-sm gap-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900">Import Complete!</h3>
                    <p className="text-slate-500 max-w-sm">
                        <strong>{result.count} listings</strong> have been submitted for admin approval. They will appear in the marketplace once approved.
                    </p>
                    <div className="flex gap-3 mt-2">
                        <a href="/dashboard/listings" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors">
                            View My Listings
                        </a>
                        <Button variant="outline" onClick={reset} className="font-bold">Import Another File</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
