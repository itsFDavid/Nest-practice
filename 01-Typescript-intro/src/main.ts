import './style.css'
import { charmander } from './bases/05-decorators'



document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  </h1>Hello vite!</h1>
  <p>
    ${charmander.name} - ${charmander.id}
  </p>
`

