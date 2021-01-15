window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
const transcript_element = document.getElementById("transcript");
const talk_button = document.getElementById("start")
const end_button = document.getElementById("end")

const synth = window.speechSynthesis;


let p = document.createElement("p");
transcript_element.appendChild(p);


recognition.addEventListener("result", (e) => {
    const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join("");
    console.log(transcript);

    p.textContent = transcript;
    if (e.results[0].isFinal) {
        p = document.createElement("p");
        p.textContent = transcript;
        apiCalls(transcript);
    }
    
});

recognition.addEventListener("end", () => {
    // end_button.disabled = true;
    talk_button.disabled = false;
})

talk_button.addEventListener("click", () => {
    // end_button.disabled = false;
    talk_button.disabled = true;
    recognition.start()
});


// end_button.addEventListener("click", () => {
    // end_button.disabled = true;
    // talk_button.disabled = false;
    // recognition.stop()

// });


function getTime() {
    const time = new Date(Date.now());
    return `the time is ${time.toLocaleString('en-UK', { hour: 'numeric', minute: 'numeric', hour12: true })}`
};


async function getJoke() {
    return fetch(`https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist&type=twopart`)
    .then(response => response.json())
    .then(jokes => { console.log(jokes);
        console.log(jokes.type);
        if (jokes.type == "twopart") {
            var setup = jokes.setup;
            var delivery = jokes.delivery;
       return [setup, delivery];
        }
        })
};


function getCat() {
        const url = `https://api.thecatapi.com/v1/images/search`;
        return fetch(url)
        .then(response => response.json())
        .then(cats => { console.log(cats);
            console.log(cats[0].url);
            catImg = cats[0].url;
            return catImg;
        });
};

function getQuote(){
        var randnum =  Math.floor(Math.random() * 1600)
        
         return fetch(`https://type.fit/api/quotes`)
         .then(response => response.json())
         .then(quote => {
            if (quote[randnum].text.length < 50) {
                var motQuote = quote[randnum];
                
                console.log(motQuote.text);
                let motQuoteText = motQuote.text;
                return motQuoteText;
            } else {
                return getQuote();
            };
         });
};



    const speak = (action) => {
        utterThis = new SpeechSynthesisUtterance(action);
        synth.speak(utterThis);
    };

function tellTime(transcript) {
    if (transcript.includes("what is the time")) {
        t = getTime();
        let answer = document.createElement("answer");
        transcript_element.appendChild(answer);
        answer.textContent = t;
        console.log(t);
        speak(t);

    }
}


async function tellJoke(transcript) {
    if (transcript.includes("tell me a joke")) {
        var joke = await getJoke();
        var setup = joke[0]
        var delivery = joke[1]

        let jokesetup = document.createElement("jokesetup");
        jokesetup.textContent = setup;
        transcript_element.appendChild(jokesetup);
        console.log(setup);
        
        br(jokesetup);
        speak(setup);

        // setTimeout(function () {
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            await delay(4000);
            let jokedelivery = document.createElement("jokedelivery");
            jokedelivery.textContent = delivery;
            transcript_element.appendChild(jokedelivery);
            speak(delivery);
        // }, 4000);
    }
}


async function getMotCat(transcript) {

    if (transcript.includes("advice" && "cat")) {

    var catImg = await getCat();
    img = document.createElement(`img`)
            img.src = catImg;
            transcript_element.appendChild(img); 

    var q =  await getQuote();
    console.log(q);
    
    var quote = document.createElement(`quote`)
    quote.textContent = `"${q}"`;
    br();
    transcript_element.appendChild(quote);
    console.log(quote);
    speak(q);
    }
 
};

function br(element) {
    var br = document.createElement("br");
    transcript_element.appendChild(br);
}



async function apiCalls(transcript){
    tellTime(transcript);
    await tellJoke(transcript);
    await getMotCat(transcript);
    transcript_element.appendChild(p)
    p.textContent = "";
};
