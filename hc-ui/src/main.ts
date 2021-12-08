import { HolochainConductor, initMyHappClient } from './addTen'
import './style.css'

const initApp = async (): Promise<void> => {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.innerHTML = `<h1>My-happ test</h1>
  Your number: <input id="number-input" type="number" />
  <br />
  <button id="add10">Add 10</button>
  <br />
  <div id="result"></div>
  `

  let client: HolochainConductor
  const resultPlaceholder = document.querySelector<HTMLInputElement>('#result')!;
  
  try {
    client = await initMyHappClient();
  } catch (e) {
    resultPlaceholder.innerText = "Error initializing the client"
  }

  const addTenHandler = async () => { 
    resultPlaceholder.innerText = ''
    const numberInput = document.querySelector<HTMLInputElement>('#number-input')!;
    const originalNumber = parseInt(numberInput.value)
    if (isNaN(originalNumber)) {
      resultPlaceholder.innerText = "Invalid number"
      return
    }
    try {
      const result = await client.addTen(originalNumber)
      resultPlaceholder.innerText = `Result: ${result.other_number}`
    } catch (e) {
      resultPlaceholder.innerText = `There was an error while calling the zome`
    }
  }
  const addTenButton = document.querySelector<HTMLInputElement>('#add10')!

  addTenButton.onclick = addTenHandler
}

initApp()