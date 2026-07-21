import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReflections, saveReflection } from '../lib/api'

const PROMPTS = [
  { q: 'What actually got done this week, vs. what you planned?',  ph: 'Be specific — small wins count.' },
  { q: 'What slipped, and why?',                                   ph: 'No judgment, just the honest reason.' },
  { q: 'Top 3 wins',                                               ph: 'Even tiny ones.' },
  { q: 'What needs to move to next week?',                         ph: "What's carrying over." },
  { q: 'Any upcoming opportunity to plan around?',                 ph: 'Interview, deadline, event…' },
]

export default function ReflectView() {
  const qc = useQueryClient()
  const [answers, setAnswers] = useState(Array(5).fill(''))
  const [saved, setSaved]     = useState(false)

  const { data: reflections = [] } = useQuery({
    queryKey: ['reflections'],
    queryFn: () => getReflections().then(r => r.data),
  })

  const save = useMutation({
    mutationFn: () => saveReflection({ answers }),
    onSuccess: () => {
      qc.invalidateQueries(['reflections'])
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    },
  })

  return (
    <div className="space-y-7 w-full">
      <div>
        <h2 className="font-display text-[26px] font-extrabold text-ink">Weekly reflection</h2>
        <p className="text-muted text-sm mt-1">Five minutes. Be honest, not harsh.</p>
      </div>

      <div className="flex flex-col gap-6">
        {PROMPTS.map((prompt, i) => (
          <div key={i}>
            <label className="font-display text-base font-bold text-ink block mb-2.5">
              {prompt.q}
            </label>
            <textarea
              rows={3}
              value={answers[i]}
              onChange={e => setAnswers(prev => { const n = [...prev]; n[i] = e.target.value; return n })}
              placeholder={prompt.ph}
              className="w-full px-4 py-3.5 rounded-[16px] border border-line bg-surface text-ink text-sm placeholder-faint focus:outline-none focus:border-ink/30 resize-none leading-relaxed"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => save.mutate()}
        disabled={save.isPending}
        className="px-7 py-3.5 rounded-2xl bg-ink text-surface font-extrabold text-sm hover:bg-ink/90 transition-colors disabled:opacity-50"
      >
        {saved ? 'Saved ✓' : save.isPending ? 'Saving…' : 'Save reflection'}
      </button>

      {reflections.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-line">
          <h3 className="font-display text-lg font-bold text-ink">Past reflections</h3>
          {reflections.slice(0, 3).map((r, i) => (
            <div key={i} className="bg-surface border border-line rounded-card p-5 space-y-3">
              <p className="text-xs text-faint">{new Date(r.createdAt).toLocaleDateString()}</p>
              {PROMPTS.map((prompt, j) => r.answers[j] && (
                <div key={j}>
                  <p className="text-xs text-muted font-bold">{prompt.q}</p>
                  <p className="text-sm text-ink mt-1">{r.answers[j]}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
