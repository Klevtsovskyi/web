let API = "https://jsonplaceholder.typicode.com/posts/";
let input = document.getElementById("post-id")
let output = document.getElementById("post-name")
let button = document.getElementById("get-data-btn")

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    });
}

button.addEventListener("click", async function (event) {
    try{
        await get_data()
    }catch(err){
        console.log(err)
    }
})
async function get_data() {
    await delay(1500)
    let response = await fetch(API + "/" + input.value,{method:"GET"})

    if (response.status === 200){
        let data = JSON.parse(await response.text())
        console.log(data)
        output.innerText = data.title
    }



}