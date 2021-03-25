const acciones = {
  'x2y-1': (x, y) => [x-2, y - 1],
  'x2y1': (x, y) => [x-2, y + 1],
  'x1y-2': (x, y) => [x+1, y - 2],
  'x1y2': (x, y) => [x+1, y + 2],
  'x-2y-1': (x, y) => [x-2, y - 1],
  'x-2y1': (x, y) => [x-2, y + 1],
  'x-1y2': (x, y) => [x-1, y + 2],
  'x-1y-2': (x, y) => [x-1, y - 2],
}
const inicio = [7,1]
let camino = [inicio]
let soluciones = []
const objetivo = [0,0]
let detener = false
const maxDeep = 12
let lastTries = {}
let casillasGanadoras = {}
const caballo = `
<i class="d-none d-xl-block fas fa-chess-knight fa-fw fa-7x"></i>
<i class="d-none d-md-block d-xl-none fas fa-chess-knight fa-fw fa-4x"></i>
<i class="d-none d-sm-block d-md-none fas fa-chess-knight fa-fw fa-3x"></i>
<i class="d-block d-sm-none fas fa-chess-knight fa-fw " style="font-size: x-large"></i>
`

function setWinner() {
  soluciones.push([...camino])
  mover(camino)
  setCamino(camino)
  detener = true
}

function iniciarSucesor() {
  if(camino.length === 0) {
    setMessage('No se encontraron mas caminos')
    return
  }
  let next
  if (detener) return
  for(let [_, action] of Object.entries(acciones)) {
    if (detener) {
      return
    }
    if(camino.length === 0) {
      setMessage('No se encontraron mas caminos')
      return
    }
    if (maxDeep <= camino.length) break
    const lastStep = camino[camino.length -1]
    const stringLastStep = lastStep.join(',')
    next = action(lastStep[0], lastStep[1])

    if(lastTries[stringLastStep] && lastTries[stringLastStep].some((value) => value === next.join(','))) {
      continue
    }
    if(lastTries.hasOwnProperty(stringLastStep)) {
      lastTries[stringLastStep].push(next.join(','))
    } else lastTries[stringLastStep] = [next.join(',')]
    if (casillasGanadoras[next.join(',')]) {
      casillasGanadoras[lastStep.join(',')] = [next].concat(casillasGanadoras[next.join(',')])
      camino = camino.concat(casillasGanadoras[lastStep.join(',')])
      setWinner();
    }
    if (next[0] === objetivo[0] && next[1] === objetivo[1]) {
      casillasGanadoras[lastStep.join(',')] = [next]
      camino.push(next)
      setWinner();
    }
    if(next[0]>= 0 && next[0] < 8 && next[1] >= 0 && next[1]< 8 && camino.indexOf(next) === -1) {
      camino.push(next)
      iniciarSucesor()
    }
  }
  camino.pop()
}
function iniciar () {
  detener = false
  if(soluciones.length > 0) {
    camino = soluciones[soluciones.length - 1]
    camino.pop()
  } else camino = [inicio]
  iniciarSucesor()
}

function mover(camino, paso = 0) {
  let fila = document.querySelector(`.row[data-id='${camino[paso][0]}']`)
  let columna = fila.querySelector(`.col[data-id='${camino[paso][1]}']`)
  columna.innerHTML = ''
  paso += 1
  fila = document.querySelector(`.row[data-id='${camino[paso][0]}']`)
  columna = fila.querySelector(`.col[data-id='${camino[paso][1]}']`)
  columna.innerHTML = caballo
  sleep(800).then(() => {
    if (paso < camino.length -1) mover(camino, paso)
    else setMessage(`El camino tiene un costo de ${camino.length} movimientos`, "bg-success")
  }).catch(er => {
    console.log(er)
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setCamino(camino) {
  const answerSpace = document.getElementById('answers')
  const letterConversion = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H'}
  const notationedRoad = camino.map((value => `${letterConversion[value[1]]}${value[0] + 1}`))
  answerSpace.innerHTML= `<p>${notationedRoad.join(', ')}; ${camino.length}&nbsp;movimientos</p>` +answerSpace.innerHTML
}
