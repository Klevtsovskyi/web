let API = "https://jsonplaceholder.typicode.com/posts/";
let input = document.getElementById("post-id")
let output = document.getElementById("post-name")
let button = document.getElementById("get-data-btn")

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    });
}

// button.addEventListener("click", async function (event) {
//     await get_data()
// })
function get_data() {
    setTimeout(function () {
        fetch(API + "/" + input.value)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                output.innerHTML = data.title;

            })
            .catch(error => console.log(error))
    }, 1000)


}