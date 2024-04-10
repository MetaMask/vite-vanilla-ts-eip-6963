Follow these steps for creating a vanilla TypeScript project to connect to MetaMask:

1. Create a project
Create a Vite project using the template for vanilla TypeScript:

```bash
npm create vite@latest vanilla-ts-6963 -- --template vanilla-ts
```

2. Set up the project
In your Vite project, update `src/vite-env.d.ts` with the EIP-6963 interfaces:

```ts title="vite-env.d.ts"
/// <reference types="vite/client" />

interface EIP6963ProviderInfo {
  rdns: string
  uuid: string
  name: string
  icon: string
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: EIP1193Provider
}

type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo,
    provider: Readonly<EIP1193Provider>,
  }
}

interface EIP1193Provider {
  isStatus?: boolean
  host?: string
  path?: string
  sendAsync?: (request: { method: string, params?: Array<unknown> }, callback: (error: Error | null, response: unknown) => void) => void
  send?: (request: { method: string, params?: Array<unknown> }, callback: (error: Error | null, response: unknown) => void) => void
  request: (request: { method: string, params?: Array<unknown> }) => Promise<unknown>
}
```

NOTE
In addition to the EIP-6963 interfaces, you need a `EIP1193Provider` interface (defined by EIP-1193), which is the foundational structure for Ethereum wallet providers, and represents the essential properties and methods for interacting with MetaMask and other Ethereum wallets in JavaScript.

3. Update main.ts
Update `src/main.ts` with the following code:

```ts title="main.ts"
import "./style.css"
import { listProviders } from "./providers.ts"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="providerButtons"></div>
  </div>
`

listProviders(document.querySelector<HTMLDivElement>("#providerButtons")!)
```

The `querySelector` finds and returns the first HTML element that matches the CSS selector app, and sets its `innerHTML`. You need to include a basic HTML structure with an inner div to inject a list of buttons, each representing a detected wallet provider.

You'll create the `listProviders` function in the next step, and pass an argument which represents the div element.

4. Connect to wallets
Create a file `src/providers.ts` with the following code:

```ts title="providers.ts"
declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent
  }
}

// Connect to the selected provider using eth_requestAccounts.
const connectWithProvider = async (wallet: EIP6963AnnounceProviderEvent["detail"]) => {
  try {
    await wallet.provider
      .request({ method: "eth_requestAccounts" })
  } catch (error) {
    console.error("Failed to connect to provider:", error)
  }
}

// Display detected providers as connect buttons.
export function listProviders(element: HTMLDivElement) {
  window.addEventListener("eip6963:announceProvider",
    (event: EIP6963AnnounceProviderEvent) => {
      const button = document.createElement("button")
  
      button.innerHTML = `
        <img src="${event.detail.info.icon}" alt="${event.detail.info.name}" />
        <div>${event.detail.info.name}</div>
      `
  
      // Call connectWithProvider when a user selects the button.
      button.onclick = () => connectWithProvider(event.detail)
      element.appendChild(button)
    }
  )

  // Notify event listeners and other parts of the dapp that a provider is requested.
  window.dispatchEvent(new Event("eip6963:requestProvider"))
}
```

The `connectWithProvider` function connects the user to the selected provider using `eth_requestAccounts`. The wallet object is passed as an argument to the function, indicating the argument type.

The `listProviders` function uses a simplified approach. Instead of mapping and joining an entire block of HTML, it directly passes the event.detail object to the `connectWithProvider` function when a provider is announced.

5. View the project
Run the following command to view and test the Vite project in your browser:

```bash
npm i && npm run dev
```