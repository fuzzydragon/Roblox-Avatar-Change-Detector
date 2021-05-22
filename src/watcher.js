const axios = require(`axios`)
const fs = require(`fs`)

function equal(a, b) {
    return JSON.stringify(a) == JSON.stringify(b)
}

async function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
}

async function get(url) {
    return axios.get(url)
        .then(response => response.data)
}

async function watch(userId) {
    if (!fs.existsSync(`./users`)) {
        fs.mkdirSync(`./users`)
    }
    
    if (!fs.existsSync(`./users/${userId}`)) {
        fs.mkdirSync(`./users/${userId}`)
    }

    const url = `https://avatar.roblox.com/v1/users/${userId}/avatar`

    let previous = {}
    let index = 0

    let dots = 0

    while (true) {
        process.title = `processing${(`.`).repeat(dots)}`

        const current = await get(url) 

        if (!equal(current, previous)) {
            fs.writeFileSync(`./users/${userId}/${index}.json`, JSON.stringify(current))

            previous = current
            index++

            console.log(`update detected! index: ${index}`)
        }

        dots = (dots + 1) % 4

        await sleep(500)
    }
}

watch(process.argv[2])