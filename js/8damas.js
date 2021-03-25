const dama =
  '            <i class="d-none d-xl-block fas fa-chess-queen fa-fw fa-7x"></i>\n' +
  '            <i class="d-none d-md-block d-xl-none fas fa-chess-queen fa-fw fa-4x"></i>\n' +
  '            <i class="d-none d-sm-block d-md-none fas fa-chess-queen fa-fw fa-3x"></i>\n' +
  '            <i class="d-block d-sm-none fas fa-chess-queen fa-fw " style="font-size: x-large"></i>';
const spaces = document.getElementsByClassName('chess-space')
let ladiesQuantity = 0
for (let space of spaces) {
  space.addEventListener('click', ({currentTarget}) => {
    if (!currentTarget.innerHTML) {
      if (!checkCanBeAte(currentTarget)) {
        currentTarget.innerHTML = dama
        ladiesQuantity += 1
      }
      else {
        setMessage('Aqui te van a comer')
      }
    }
    else {
      currentTarget.innerHTML = null
      ladiesQuantity -= 1
    }
    if (ladiesQuantity === 8) setMessage('Has Ganado!!!', 'bg-success')
    document.getElementById('counting').innerHTML = ladiesQuantity + '/8'
  })
}

function setContradiagonal(normalSteps, el) {
  const desplazamiento = parseInt(el.dataset.id) - parseInt(el.parentElement.dataset.id)
  let stepsContraDiagonalHorizontal = normalSteps
  let stepsContraDiagonalVertical = normalSteps
  if (desplazamiento >= 0) {
    stepsContraDiagonalHorizontal = [...normalSteps].splice(desplazamiento)
  } else {
    stepsContraDiagonalVertical = [...normalSteps].splice(-desplazamiento)
  }
  return {stepsContraDiagonalHorizontal, stepsContraDiagonalVertical};
}

function setDiagonal(el, normalSteps) {
  const desplazamientoDiagonal = parseInt(el.dataset.id) - 7 + parseInt(el.parentElement.dataset.id)
  let stepsDiagonalHorizontal = normalSteps
  let stepsDiagonalVertical = [...normalSteps].reverse()
  if (desplazamientoDiagonal >= 0) {
    stepsDiagonalHorizontal = [...normalSteps].splice(desplazamientoDiagonal)
  } else {
    stepsDiagonalVertical = stepsDiagonalVertical.splice(-desplazamientoDiagonal)
  }
  return {stepsDiagonalHorizontal, stepsDiagonalVertical};
}

function checkCanBeAte(el) {
  let canBeEaten = false
  const normalSteps = [0,1,2,3,4,5,6,7]
  let {stepsDiagonalHorizontal, stepsDiagonalVertical} = setDiagonal(el, normalSteps);
  let {stepsContraDiagonalHorizontal, stepsContraDiagonalVertical} = setContradiagonal(normalSteps, el);
  for (let step of normalSteps) {
    // horizontal
    if (el.parentElement.children[step].children.length > 0 || //horizontal
      el.parentElement.parentElement.children[step].children[parseInt(el.dataset.id)].children.length > 0 || // vertical
      ( step < stepsContraDiagonalHorizontal.length && step < stepsContraDiagonalVertical.length &&
        el.parentElement.parentElement.children[stepsContraDiagonalVertical[step]].children[stepsContraDiagonalHorizontal[step]].children.length > 0
      ) || //contradiagonal
      (step < stepsDiagonalHorizontal.length && step < stepsDiagonalVertical.length &&
        el.parentElement.parentElement.children[stepsDiagonalVertical[step]].children[stepsDiagonalHorizontal[step]].children.length > 0
      )
    ) {
      canBeEaten = true
      break
    }
  }
  return canBeEaten
}
