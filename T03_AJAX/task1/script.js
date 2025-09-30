function delay(ms) {
    return new Promise((resolve,reject) => {
        setTimeout(resolve, ms)
    });
}


async function main() {
    console.log("Print 1")
    await delay(1000)
    console.log("Print 2")
}

(async () => {
    try {
        await main()
    } catch (error) {
        console.log(error)
    }
})();

