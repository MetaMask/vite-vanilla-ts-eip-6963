declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }
}

let providers: EIP6963ProviderDetail[] = [];

export const connectWithProvider = async (providerWithInfo: EIP6963ProviderDetail, providerInfo: EIP6963ProviderInfo) => {
    try {
      const accounts = await providerWithInfo.provider
        .request({ method: 'eth_requestAccounts' })
        .catch(error => {
          console.error("Error requesting accounts:", error); // Debugging log for errors
          throw error; // Rethrow the error to ensure it's caught by the catch block
        });

        console.log(`Accounts: ${JSON.stringify(accounts)}`)

      if (accounts?.[0] as string) {
        localStorage.setItem('connectedWallet', JSON.stringify(providerInfo));
      } else {
        console.log("No accounts returned from provider."); // Debugging log for no accounts
      }
    } catch (error) {
      console.error("Failed to connect to provider:", error); // Debugging log for connection failure
  }
};

export function listProviders(element: HTMLDivElement) {

  window.addEventListener('eip6963:announceProvider', 
    (event: EIP6963AnnounceProviderEvent) => {
      console.log("Provider announced:", event.detail.info);
      providers.push(event.detail);
    }
  );

  window.dispatchEvent(new Event("eip6963:requestProvider"));

  let buttonList = providers.map(function(prov){
    return `
      <button key="${prov.info.rdns}" onClick="() => connectWithProvider(${JSON.stringify(prov)}, ${JSON.stringify(prov.info)});">
        <img src="${prov.info.icon}" alt="${prov.info.name}" />
        <div>${prov.info.name}</div>
      </button>`;
})

  element.innerHTML = buttonList.join('');
}
