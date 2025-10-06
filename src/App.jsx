import { useState, useMemo } from 'react'
import '@xyflow/react/dist/base.css'
import { Button } from '../components/form/button'
import { Graph } from '../components/graph'
import { Input } from '../components/form/input'
import { computeResult } from '../helper/api'
import { GraphContext } from '../components/graph-context'
import { useDebouncedEffect, useThrottledEffect } from '@react-hookz/web'
import { Settings } from '../components/settings'

const initial_conditional_probs = {
  "q": {
    "p": 0.95
  },
  "r": {
    "p": {
      "q1": 0.7,
      "q0": 0
    }
  },
  "g": {
    "p": {
      "r1_q1": 0.8,
      "r1_q0": 0.5,
      "r0_q1": 0.5,
      "r0_q0": 0
    }
  }
}
const initial_success_rates = Object.keys(initial_conditional_probs).reduce((a, v) => ({ ...a, [v]: 0.0 }), {})

export default function App() {
  const [settings, setSettings]= useState({N: 10_000, seed: 0})
  const [successRates, setSuccessRates] = useState(initial_success_rates)
  const [conditionalProbabilities, setConditionalProbabilities] = useState(initial_conditional_probs)
  const value = { conditionalProbabilities, setConditionalProbabilities, successRates, setSuccessRates }

  useDebouncedEffect(() => {
    computeResult(settings, conditionalProbabilities, setSuccessRates)
    // setSuccessRates(result)

  }, [conditionalProbabilities, settings], 400)

  return (
    <GraphContext value={value}>
      <div className='w-[100vw] min-h-[100vh]'>
        <div className='relative'>
          <div className='absolute w-full top-0 left-0 z-100'>
            <Settings settings={settings} setSettings={setSettings}/>
          </div>
          <div className='w-full h-[100vh]'>
            <Graph />
          </div>
        </div>
      </div>

    </GraphContext>
  )
}