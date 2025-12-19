import { useState } from 'react'
import { FiTrash2, FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import apiFetch from '../lib/api'

type Meal = { name: string; imageData?: string }
type Section = { price: string; meals: Meal[] }

const PartnerSignup: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState(user?.phoneNumber || '')
  const [sections, setSections] = useState<{ breakfast: Section; lunch: Section; dinner: Section }>({
    breakfast: { price: '', meals: [] },
    lunch: { price: '', meals: [] },
    dinner: { price: '', meals: [] }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMeal = (sectionKey: keyof typeof sections) => {
    setSections((s) => ({ ...s, [sectionKey]: { ...s[sectionKey], meals: [...s[sectionKey].meals, { name: '' }] } }))
    // scroll to last meal row after small delay
    setTimeout(() => {
      const el = document.getElementById(`${sectionKey}-meal-row-${sections[sectionKey].meals.length}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 120)
  }

  const updateMealName = (sectionKey: keyof typeof sections, idx: number, value: string) => {
    setSections((s) => ({
      ...s,
      [sectionKey]: { ...s[sectionKey], meals: s[sectionKey].meals.map((m, i) => (i === idx ? { ...m, name: value } : m)) }
    }))
  }

  const removeMeal = (sectionKey: keyof typeof sections, idx: number) => {
    setSections((s) => ({ ...s, [sectionKey]: { ...s[sectionKey], meals: s[sectionKey].meals.filter((_, i) => i !== idx) } }))
  }

  const handleMealFile = (sectionKey: keyof typeof sections, idx: number, file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const data = String(reader.result || '')
      setSections((s) => ({
        ...s,
        [sectionKey]: { ...s[sectionKey], meals: s[sectionKey].meals.map((m, i) => (i === idx ? { ...m, imageData: data } : m)) }
      }))
    }
    reader.readAsDataURL(file)
  }

  // Document uploads
  const [docs, setDocs] = useState<Record<string, string | undefined>>({})

  const handleDocFile = (key: string, file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setDocs((d) => ({ ...d, [key]: String(reader.result || '') }))
    reader.readAsDataURL(file)
  }

  const requiredDocs: { key: string; label: string; required: boolean }[] = [
    { key: 'fssai', label: 'FSSAI License', required: true },
    { key: 'gst', label: 'GST Registration', required: false },
    { key: 'pan', label: 'PAN Card', required: true },
    { key: 'owner_id', label: "Owner's ID Proof", required: true },
    { key: 'owner_address', label: "Owner's Address Proof", required: true },
    { key: 'premises_address', label: 'Restaurant Premises Address Proof', required: true },
    { key: 'shop_establish', label: 'Shop and Establishment License', required: false },
    { key: 'trade', label: 'Trade License', required: false }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name) return setError('Restaurant name is required')
    if (!phone.match(/^\d{10}$/)) return setError('Contact phone must be exactly 10 digits')
    // validate required docs
    const missing = requiredDocs.filter((d) => d.required && !docs[d.key])
    if (missing.length > 0) return setError(`Missing required documents: ${missing.map((m) => m.label).join(', ')}`)

    setLoading(true)
    try {
      // build initialMenu from sections: each meal inherits section price and category
      const initialMenu: any[] = []
      ;(Object.keys(sections) as Array<keyof typeof sections>).forEach((sec) => {
        const secObj = sections[sec]
        const priceNum = secObj.price ? Number(secObj.price) : undefined
        secObj.meals.forEach((meal) => {
          if (!meal.name) return
          initialMenu.push({ title: meal.name, price: priceNum ?? 0, category: sec, imageData: meal.imageData || '' })
        })
      })

      const payload = {
        ownerPhone: phone,
        name,
        description,
        documents: docs,
        initialMenu
      }
        await apiFetch('/api/partners/register-public', { method: 'POST', body: JSON.stringify(payload) })
      navigate('/')
    } catch (err: any) {
      setError(err?.message || 'server error')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-20 bg-gradient-to-br from-lime-100 via-green-300 to-emerald-500 overflow-auto">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Become a Partner</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Restaurant Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Phone</label>
            <div className="relative">
              <input
                type="tel"
                pattern="[0-9]{10}"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                  setPhone(val)
                }}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Menu (optional)</label>
            <div className="space-y-4">
              {(['breakfast', 'lunch', 'dinner'] as Array<keyof typeof sections>).map((sec) => (
                <div key={sec} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold capitalize">{sec}</h4>
                    <div className="text-sm text-neutral-600">(all optional)</div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-sm font-medium">Price (per week)</label>
                    <input
                      className="sm:col-span-2 border rounded px-3 py-2"
                      placeholder="e.g. 999"
                      value={sections[sec].price}
                      onChange={(e) => setSections((s) => ({ ...s, [sec]: { ...s[sec], price: e.target.value } }))}
                    />
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-medium mb-2">Meals (name + image)</div>
                    <div className="space-y-2">
                      {sections[sec].meals.map((m, idx) => (
                        <div key={idx} id={`${sec}-meal-row-${idx}`} className="flex gap-2 items-center">
                          <input
                            placeholder="Meal name"
                            value={m.name}
                            onChange={(e) => updateMealName(sec, idx, e.target.value)}
                            className="flex-1 border rounded px-2 py-1"
                          />
                          <label className="ml-2 flex items-center gap-2 cursor-pointer text-sm text-neutral-600">
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleMealFile(sec, idx, e.target.files ? e.target.files[0] : undefined)}
                              className="hidden"
                            />
                            <span className="px-2 py-1 bg-gray-100 rounded">Add Image</span>
                          </label>
                          {m.imageData && (
                            // if image data url
                            <img src={m.imageData} alt="preview" className="w-12 h-8 object-cover rounded ml-2 border" />
                          )}
                          <button type="button" onClick={() => removeMeal(sec, idx)} aria-label={`Remove meal ${idx + 1}`} className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded">
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addMeal(sec)}
                      aria-label={`Add meal to ${sec}`}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lime-400 to-green-500 text-white rounded-md font-medium shadow-sm hover:scale-105 transition-all"
                    >
                      <FiPlus />
                      <span>Add Meal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Documents</label>
            <div className="space-y-2">
              {requiredDocs.map((d) => (
                <div key={d.key} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{d.label} {d.required ? <span className="text-red-500">(required)</span> : <span className="text-neutral-500">(optional)</span>}</div>
                    <div className="text-xs text-neutral-600">Upload a clear copy (image or PDF)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1 bg-gray-100 rounded cursor-pointer text-sm">
                      <input type="file" accept="image/*,application/pdf" onChange={(e) => handleDocFile(d.key, e.target.files ? e.target.files[0] : undefined)} className="hidden" />
                      Choose File
                    </label>
                    {docs[d.key] && <span className="text-sm text-green-600">Uploaded</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <button disabled={loading} className="w-full bg-gradient-to-r from-[#ff7b00] to-[#ff6b3b] text-white py-3 rounded-xl font-semibold shadow hover:from-[#ff6b3b] hover:to-[#e55a2c] disabled:opacity-60">{loading ? 'Submitting...' : 'Register as Partner'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PartnerSignup
