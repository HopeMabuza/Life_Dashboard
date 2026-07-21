import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReflections, saveReflection } from '../lib/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const PROMPTS = [
  'What went well this week?',
  'What was your biggest challenge?',
  'What did you learn?',
  'What are you grateful for?',
  'What will you do differently next week?',
]

export default function WeeklyView() {
  const qc = useQueryClient()
  const [answers, setAnswers] = useState(Array(5).fill(''))
  const [saved, setSaved] = useState(false)

  const { data: reflections = [] } = useQuery({
    queryKey: ['reflections'],
    queryFn: () => getReflections().then(r => r.data),
  })

  const save = useMutation({
    mutationFn: () => saveReflection({ answers }),
    onSuccess: () => {
      qc.invalidateQueries(['reflections'])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Weekly Reflection</h2>
        <p className="text-gray-500 text-sm mt-1">Take a moment to reflect on your week</p>
      </div>

      <Card className="space-y-6">
        {PROMPTS.map((prompt, i) => (
          <div key={i}>
            <label className="block text-sm font-medium text-gray-300 mb-2">{prompt}</label>
            <textarea
              rows={3}
              value={answers[i]}
              onChange={e => setAnswers(prev => { const n = [...prev]; n[i] = e.target.value; return n })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 resize-none"
              placeholder="Write your thoughts..."
            />
          </div>
        ))}
        <div className="flex items-center gap-4">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? 'Saving…' : 'Save Reflection'}
          </Button>
          {saved && <span className="text-green-400 text-sm">Saved ✓</span>}
        </div>
      </Card>

      {reflections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Past Reflections</h3>
          {reflections.slice(0, 5).map((r, i) => (
            <Card key={i} className="space-y-3">
              <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
              {PROMPTS.map((prompt, j) => r.answers[j] && (
                <div key={j}>
                  <p className="text-xs text-gray-400 font-medium">{prompt}</p>
                  <p className="text-sm text-gray-300 mt-1">{r.answers[j]}</p>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
