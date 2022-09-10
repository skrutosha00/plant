if (!localStorage.getItem('balance_plant')) {
    localStorage.setItem('balance_plant', 500)
}

if (!localStorage.getItem('level_plant')) {
    localStorage.setItem('level_plant', 1)
}

let balance = document.querySelector('.balance')
let footer = document.querySelector('.footer')
let sellTab = document.querySelector('.sell_tab')

let level = Number(localStorage.getItem('level_plant'))

let plants = localStorage.getItem('plants_plant') ?
    JSON.parse(localStorage.getItem('plants_plant')) : Array.from({ length: 9 })

let boosters = localStorage.getItem('boosters_plant') ?
    JSON.parse(localStorage.getItem('boosters_plant')) : Array.from({ length: 3 })

let openedNav = null

document.querySelector('.level').innerHTML = 'Level ' + level
balance.innerHTML = localStorage.getItem('balance_plant')

activateAudio()
setPlants()

for (let i = 0; i < 3; i++) {
    if (boosters[i]) {
        document.querySelectorAll('.goods_2 .good')[i].classList.add('gray')
    }
}

document.querySelectorAll('.nav').forEach((nav, ind) => {
    nav.onclick = () => {
        if (!openedNav) {
            footer.style.transform = 'translateY(0%)'
        }

        if (openedNav == ind + 1) {
            footer.style.transform = 'translateY(83%)'
            document.querySelector('.nav_' + openedNav).classList.remove('open')
            openedNav = null
            return
        }

        openedNav = ind + 1
        otherNav = openedNav == 1 ? 2 : 1

        nav.classList.add('open')
        document.querySelector('.nav_' + otherNav).classList.remove('open')

        document.querySelector('.goods_' + openedNav).classList.remove('none')
        document.querySelector('.goods_' + otherNav).classList.add('none')
    }
})

document.querySelectorAll('.goods_1 .good').forEach((flowerItem, ind) => {
    let name = flowerItem.dataset.item
    let button = flowerItem.querySelector('.good_button')
    let price = Number(flowerItem.querySelector('.good_price').innerHTML)

    button.onclick = () => {
        if (getPlantsAmount() >= 9) { return }

        if (Number(balance.innerHTML) < price) { return }

        changeBalance(-price)

        for (let i = 0; i < 9; i++) {
            if (!plants[i]) {
                plants[i] = { name: name, time: new Date().getTime() }
                break
            }
        }

        localStorage.setItem('plants_plant', JSON.stringify(plants))
        setPlants()
    }
})

document.querySelectorAll('.goods_2 .good').forEach((booster, ind) => {
    booster.onclick = () => {
        if (Number(balance.innerHTML) < 500) { return }
        if (booster.classList.contains('gray')) { return }

        changeBalance(-500)
        booster.classList.add('gray')

        boosters[ind] = 1
        localStorage.setItem('boosters_plant', JSON.stringify(boosters))
    }
})

document.querySelectorAll('.flower').forEach((flower, ind) => {
    let sellPrice = {
        sunflower: 1000,
        rose: 1200,
        tomato: 1500
    }

    flower.onclick = () => {
        if (!plants[ind]) {
            openedNav = 1
            document.querySelector('.nav_1').classList.add('open')
            document.querySelector('.nav_2').classList.remove('open')

            document.querySelector('.goods_1').classList.remove('none')
            document.querySelector('.goods_2').classList.add('none')

            footer.style.transform = 'translateY(0%)'
            openedNav = null
            return
        }

        sellTab.style.left = '50%'

        document.querySelector('.sell_tab_yes').onclick = () => {
            if (flower.querySelector('img').dataset.age == 'adult') {
                changeBalance(sellPrice[plants[ind].name])

                level++
                localStorage.setItem('level_plant', level)
                document.querySelector('.level').innerHTML = 'Level ' + level
            }

            plants[ind] = undefined
            localStorage.setItem('plants_plant', JSON.stringify(plants))
            setPlants()

            sellTab.style.left = '-50%'
        }
    }
})

document.querySelector('.sell_tab_no').onclick = () => {
    sellTab.style.left = '-50%'
}

document.querySelector('.wrapper').addEventListener('click', (ev) => {
    if (!(ev.target.classList.contains('wrapper') || ev.target.classList.contains('row'))) { return }

    footer.style.transform = 'translateY(83%)'

    document.querySelector('.nav_1').classList.remove('open')
    document.querySelector('.nav_2').classList.remove('open')
})

window.onload = () => {
    document.querySelector('.wrapper').classList.remove('hidden')
}

function setPlants() {
    for (let i = 0; i < 9; i++) {
        document.querySelectorAll('.flower')[i].innerHTML = ''
        let cardPic = document.createElement('img')

        if (plants[i]) {
            let stage = calcPlantStage(plants[i].time)

            if (stage == 1) {
                cardPic.src = '../png/plant_small.png'
                cardPic.classList.add('flower_pic_small')
                cardPic.dataset.age = 'small'
            } else if (stage == 2) {
                cardPic.src = '../png/plant_middle.png'
                cardPic.classList.add('flower_pic_middle')
                cardPic.dataset.age = 'middle'
            } else {
                let plantList = ['sunflower', 'rose', 'tomato']
                cardPic.src = '../png/plant_' + (plantList.indexOf(plants[i].name) + 1) + '.png'
                cardPic.classList.add('flower_pic')
                cardPic.dataset.age = 'adult'
            }

        } else {
            cardPic.classList.add('empty')
            cardPic.src = '../png/card_empty.png'
        }

        document.querySelectorAll('.flower')[i].append(cardPic)
    }
}

function getPlantsAmount() {
    let res = 0

    for (let plant of plants) {
        if (plant) {
            res++
        }
    }

    return res
}

function activateAudio(fileName = 'main') {
    let volumeCont = document.querySelector('.volume_cont')
    volumeCont.classList.add('volume_cont', 'block')

    let volumePic = document.createElement('img')
    volumePic.src = '../png/volume_on.png'
    volumeCont.appendChild(volumePic)

    let volume = false
    let audio = new Audio()
    audio.src = '../audio/' + fileName + '.mp3'
    audio.loop = true

    volumeCont.onclick = () => {
        volume = !volume

        if (volume) {
            audio.play()
            volumeCont.querySelector('img').src = '../png/volume_off.png'
        } else {
            audio.pause()
            volumeCont.querySelector('img').src = '../png/volume_on.png'
        }
    }
}

function calcPlantStage(mill) {
    let diff = new Date().getTime() - Number(mill)

    if ((diff / 1000 / 3600) > 8) {
        return 3
    } else if ((diff / 1000 / 3600) > 4) {
        return 2
    } else {
        return 1
    }
}

function changeBalance(amount) {
    localStorage.setItem('balance_plant', Number(localStorage.getItem('balance_plant')) + amount)
    balance.innerHTML = localStorage.getItem('balance_plant')
}
