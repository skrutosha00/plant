let plantList = localStorage.getItem('plant-list_plant2') ?
    JSON.parse(localStorage.getItem('plant-list_plant2')) : []

plantList.forEach((plantData, ind) => {
    let plantCont = document.createElement('div')
    plantCont.classList.add('plant_cont')

    let plantPicCont = document.createElement('div')
    plantPicCont.classList.add('plant_cont_pic', 'block')

    let plantPic = document.createElement('img')
    plantPic.classList.add('plant_pic')
    plantPic.src = '../png/plant_' + plantData.pic + '.png'

    let plantInfoCont = document.createElement('div')
    plantInfoCont.classList.add('plant_info_cont')

    let plantName = document.createElement('div')
    plantName.classList.add('plant_name')
    plantName.innerHTML = plantData.name

    plantPicCont.append(plantPic)
    plantInfoCont.append(plantName)
    plantCont.append(plantPicCont, plantInfoCont)
    document.querySelector('.plants').append(plantCont)

    plantData.notifications.forEach((not, i) => {
        let bar = document.createElement('div')
        bar.classList.add('bar')

        let innerBar = document.createElement('div')
        innerBar.classList.add('inner-bar', 'inner-bar_' + not.type)
        innerBar.dataset.index = JSON.stringify([ind, i])

        let barText = document.createElement('div')
        barText.classList.add('bar_text')
        barText.innerHTML = `${not.type == 'water' ? 'Water' : 'Fertilize'} plant every ${not.period} hours`

        bar.append(innerBar)
        plantInfoCont.append(barText, bar)

        bar.addEventListener('click', () => {
            not.last = new Date().getTime()

            localStorage.setItem('plant-list_plant2', JSON.stringify(plantList))
            updateInnerBars()
        })
    })
});

updateInnerBars()
setInterval(() => {
    updateInnerBars()
}, 15 * 1000);

function updateInnerBars() {
    plantList.forEach((plantData, ind) => {
        plantData.notifications.forEach((not, i) => {
            let innerBar = document.querySelector('.inner-bar[data-index="' + JSON.stringify([ind, i]) + '"]')

            let hoursPast = (new Date().getTime() - Number(not.last)) / 3600 / 1000
            let period = Number(not.period)

            innerBar.style.width = hoursPast < period ? (100 - (hoursPast / period) * 100) * 0.95 + '%' : '0%'

            console.log(hoursPast, period)
        })
    })
}

window.onload = () => {
    document.querySelector('.wrapper').classList.remove('hidden')
}
