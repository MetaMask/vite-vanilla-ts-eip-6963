import './style.css'
import { listProviders } from './provider.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>EIP-6963 + Vanilla TypeScript Demo</h1>
    <div id="providerButtons"></div>
  </div>
`

listProviders(document.querySelector<HTMLDivElement>('#providerButtons')!)
