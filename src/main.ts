import './style.css'
import { listProviders } from './provider.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>EIP-6963 + TypeScript Example</h1>
    <div id="providerButtons"></div>
  </div>
`

listProviders(document.querySelector<HTMLDivElement>('#providerButtons')!)
