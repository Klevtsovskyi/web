// Отримуємо API ключ з конфігурації
const api = window.CONFIG.NASA_API_KEY
const api_url = `https://api.nasa.gov/planetary/apod?api_key=${api}`
console.log(api.length > 0);
let datePicker = document.getElementById("date-picker")
let autoCheck = document.getElementById("auto-check")
let btn = document.getElementById("btn-search")
autoCheck.addEventListener("change", function () {
    if (datePicker.value.length > 0 && datePicker.value !== "") {
    }
    if (autoCheck.checked === true) {
        btn.disabled = true
        let startDate = new Date(datePicker.value)
        console.log(startDate)
        let counter = 1
        setInterval(async function () {
            if (autoCheck.checked === true) {
                startDate.setDate(startDate.getDate() - 1);
                console.log(startDate)
                let sendDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
                await get_NASA_data(sendDate)
                counter++
            }
        }, 4000)
    } else {
        btn.disabled = false
    }
})

async function get_NASA_data(date = null) {
    if (date == null) {
        console.log(datePicker.value)
        let response = await fetch(api_url + '&date=' + datePicker.value)
        if (response.ok) {
            let data = JSON.parse(await response.text())
            console.log(data)
            await drawImage(data.url)

        }
    } else {
        let response = await fetch(api_url + '&date=' + date)
        if (response.ok) {
            let data = JSON.parse(await response.text())
            console.log(data)
            await drawImage(data.url)

        }
    }


}


async function drawImage(url) {
    let imageContainer = document.getElementById("image-container")
    imageContainer.innerHTML = ""
    let img = document.createElement("img");
    img.src = url;
    imageContainer.appendChild(img);

}