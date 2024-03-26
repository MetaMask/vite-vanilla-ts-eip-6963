declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }
}

let providers: EIP6963ProviderDetail[] = [];

(window as any).connectWithProvider = async (walletIndex: number) => {
  const wallet = providers[walletIndex];
  try {
    await wallet.provider
      .request({ method: 'eth_requestAccounts' })
      .catch(error => {
        console.error("Error requesting accounts:", error);
        throw error;
      });
  } catch (error) {
    console.error("Failed to connect to provider:", error);
  }
};

export function listProviders(element: HTMLDivElement) {
  window.addEventListener('eip6963:announceProvider',
    (event: EIP6963AnnounceProviderEvent) => {
      // console.log("Provider announced:", event.detail.info);
      // console.log("Event:", event);
      providers.push(event.detail);
    }
  );

  window.dispatchEvent(new Event("eip6963:requestProvider"));

  let buttonList = providers.map(function (wallet, walletIndex) {
    return `
        <button key="${wallet.info.rdns}" onClick="window.connectWithProvider(${walletIndex});">
          <img src="${wallet.info.icon}" alt="${wallet.info.name}" />
          <div>${wallet.info.name}</div>
        </button>`;
  })

  element.innerHTML = buttonList.join('');
}
