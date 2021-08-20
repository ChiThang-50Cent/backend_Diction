const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const wordModel = require('./src/models/wordModel.js')
const rl = require('readline')
const fs = require('fs')

//function Line() will read each line then return an array of word
async function Line() {
    let fls = fs.createReadStream('Ox_5000_word.txt')
    const rline = rl.createInterface({
        input: fls,
        crlfDelay: Infinity
    })

    let count = []

    for await (const line of rline) {
        count.push(line)
    }
    return count
}

const get = () => {
    mongoose
        .connect('mongodb+srv://ChiThang:@@~~~123lol@cluster0.exh3d.mongodb.net/Vocabulary?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
        .catch(err => {
            console.log(err.message)
        })
        .then(() => {
            console.log("Mongodb connected")
        })
        .then(async () => {
            const browers = await puppeteer.launch({ headless: false })
            const page = await browers.newPage();
            await page.goto('https://www.oxfordlearnersdictionaries.com/definition/english/', { timeout: 0 })

            //Start reading file
            let count = 0;
            const list = await Line()
            for await (const word of list) {

                await page.type('#q', word, { delay: 100 })
                await page.$eval('#search-form', (el) => { el.submit() })
                await page.waitForNavigation({ timeout: 0 })

                //get result of searching
                const result = await page.evaluate(() => {

                    //node 1 to get top info of the word
                    const node = document.querySelector('#entryContent')
                    if (node) {
						//get word
                        const word = node.querySelector('.headword').textContent
						//phonetic
                        let phonetic = document.querySelector('#entryContent .phonetics span.phon')
						phonetic === null ? phonetic = "/../" : phonetic = phonetic.textContent
						//soundMp3
                        let soundMp3 = node.querySelector('.phonetics div.sound')
						soundMp3 === null ? soundMp3 = "/../" : soundMp3 = soundMp3.getAttribute('data-src-mp3')
						//soundOgg
                        let soundOgg = node.querySelector('.phonetics div.sound')
						soundOgg === null ? soundOgg = "/../" : soundOgg =  soundOgg.getAttribute('data-src-ogg')
						//kind
                        const kind = document.querySelector('span.pos').textContent

                        //node 2 to get define and examples of each define
                        const node2 = document.querySelectorAll('#entryContent div.entry>ol[htag="ol"] li.sense')
                        let defineAndExample = []
                        node2.forEach(el => {
                            let define = el.querySelector('li span.def')
                            if (define) {
                                define = define.textContent
                            } else {
                                define = "<strong>Can't get this define</strong>"
                            }
                            const exnode = el.querySelectorAll('li.sense>ul.examples li')
                            let examples = []
                            if (exnode) {
                                exnode.forEach(el => {
                                    examples.push(el.textContent)
                                })
                            }
                            defineAndExample.push({
                                define,
                                examples
                            })
                        })

                        //node 3 to get idiom of word
                        const node3 = document.querySelectorAll('#entryContent div.idioms span.idm-g')
                        let idioms = []
                        if (node3) {
                            node3.forEach(el => {
                                const idiom = el.querySelector('span.idm').textContent
                                const dae = el.querySelectorAll('ol>li.sense')
                                let defineAndExample = []
                                dae.forEach(el => {
                                    const define = el.querySelector('span.def').textContent
                                    const exams = el.querySelectorAll('ul.examples li')
                                    let examples = []
                                    if (exams) {
                                        exams.forEach(el => {
                                            examples.push(el.textContent)
                                        })
                                    }
                                    defineAndExample.push({
                                        define,
                                        examples
                                    })
                                })
                                idioms.push({
                                    idiom,
                                    defineAndExample
                                })
                            })
                        }

                        const data = {
                            word,
                            phonetic,
                            sounds: {
                                mp3: soundMp3,
                                ogg: soundOgg
                            },
                            kind,
                            defineAndExample,
                            idioms
                        }
                        return {
                            status: true,
                            data
                        }
                    }
                    else {
                        return { status: false }
                    }
                })

                page.waitForTimeout(700)
				if(count === 150){
					page.waitForTimeout(30000)
					count = 0
				}

                if (result.status) {
                    const isExists = await wordModel.findOne({ word: result.data.word })
                    if (isExists) {
                        console.log("Existed")
                    } else {
                        await wordModel.create(result.data)
                        count += 1;
                        console.log(count)
                    }
                } else {
                    console.log("Word not found")
                }
            }
            await browers.close()
        })
}

get()


