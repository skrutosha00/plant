let form = document.querySelector('.form')

let plantPicChosen = 1
let addedList = []

document.querySelector('.button').addEventListener('click', () => {
    form.style.left = '50%'
})

document.querySelectorAll('.logo').forEach((logo, ind) => {
    logo.addEventListener('click', () => {
        plantPicChosen = ind + 1

        document.querySelectorAll('.logo').forEach(logo => {
            logo.classList.remove('logo_active')
        })

        logo.classList.add('logo_active')

        let choicePic = document.querySelector('.choice_pic')
        if (choicePic) {
            choicePic.src = '../png/plant_' + (ind + 1) + '.png'
        } else {
            let choicePic = document.createElement('img')
            choicePic.src = '../png/plant_' + (ind + 1) + '.png'
            choicePic.classList.add('choice_pic')
            document.querySelector('.choice').append(choicePic)
        }
    })
})

document.querySelectorAll('.option').forEach((option, ind) => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.option').forEach(o => {
            o.classList.remove('chosen')
        })

        option.classList.add('chosen')

    })
})

document.querySelector('.form_button').addEventListener('click', () => {
    let currentType = document.querySelector('.option_2').classList.contains('chosen') ? 'energy' : 'water'
    let currentPeriod = document.querySelector('.input_period').value

    addNotification({ type: currentType, period: currentPeriod })
    addedList.push({ type: currentType, period: currentPeriod })
    form.style.left = '-50%'
})

window.onload = () => {
    document.querySelector('.wrapper').classList.remove('hidden')
}

function addNotification(data) {
    let notification = document.createElement('div')
    notification.classList.add('notification')

    let bellPic = document.createElement('img')
    bellPic.src = '../png/bell.png'
    bellPic.classList.add('bell_pic')

    let notificationBlock = document.createElement('div')
    notificationBlock.classList.add('notification_block', 'block')

    let typePic = document.createElement('img')
    typePic.src = '../png/' + data.type + '.png'
    typePic.classList.add('type_pic')

    let notificationText = document.createElement('div')
    notificationText.classList.add('notification_text')
    notificationText.innerHTML = 'Every ' + data.period + ' hours'

    notificationBlock.append(typePic, notificationText)

    let binPic = document.createElement('img')
    binPic.src = '../png/bin.png'
    binPic.classList.add('bin_pic')

    notification.append(bellPic, notificationBlock, binPic)
    document.querySelector('.notifications').append(notification)

    binPic.addEventListener('click', () => {
        notification.remove()
    })
}

document.querySelector('.save').addEventListener('click', () => {
    let name = document.querySelector('.input_name').value
    if (!name) { name = 'Plant' }

    addedList.forEach((not, i) => {
        not.last = new Date().getTime()
    })

    let plantList = localStorage.getItem('plant-list_plant2') ?
        JSON.parse(localStorage.getItem('plant-list_plant2')) : []

    plantList.push({ name: name, pic: plantPicChosen, notifications: addedList })
    localStorage.setItem('plant-list_plant2', JSON.stringify(plantList))
})