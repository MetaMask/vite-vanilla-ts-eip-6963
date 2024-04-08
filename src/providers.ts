declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent;
  }
}

/* This function is responsible for connecting to the provider using `eth_requestAccounts`
   The `wallet` object is passed as an argument to the function indicating the detail of tis type 
   as the argument type.
*/
const connectWithProvider = async (wallet: EIP6963AnnounceProviderEvent['detail']) => {
  try {
    await wallet.provider
      .request({ method: 'eth_requestAccounts' })
  } catch (error) {
    console.error("Failed to connect to provider:", error);
  }
};

/* In this approach, we've opted for a simplified (over mapping and joining an entire block of HTML).
   We're directly passing the `event.detail` object to the `connectWithProvider` function when a provider is announced.
   `connectWithProvider` is then called when the button is clicked.

   This method seems to be more straightforward and less error-prone 
   as it directly passes the required data without attempting to stringify data objects which led to 
   circular reference errors due to the object's structure. 
*/
export function listProviders(element: HTMLDivElement) {

  window.addEventListener('eip6963:announceProvider',
    // Event handler function: second argument called to perform work when the event occurs. 
    (event: EIP6963AnnounceProviderEvent) => {
      const button = document.createElement('button');

      // use string interpolation to set the button's innerHTML
      button.innerHTML = `
        <img src="${event.detail.info.icon}" alt="${event.detail.info.name}" />
        <div>${event.detail.info.name}</div>`;
      
      // Add an onClick event listener to the button that calls the `connectWithProvider` function
      button.onclick = () => connectWithProvider(event.detail);
      element.appendChild(button);
    }
  );

  /*
    dispatch custom event on `window` object used to notify other parts of the dapp that a provider 
    is being requested, and any event listeners set up to listen for this event, respond accordingly.
  */
  window.dispatchEvent(new Event("eip6963:requestProvider"));
}
