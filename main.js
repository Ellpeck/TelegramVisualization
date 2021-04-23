$.getJSON("result.json", data => {
    let messages = data.messages;
    let text = messages.map(m => {
        // messages with formatting are arrays of text and sometimes objects containing text
        if (Array.isArray(m.text))
            return m.text.map(e => typeof e == "object" ? e.text : e).join("");
        // other messages are just text
        return m.text.toString();
    });

    // generate word cloud of the first 500 words
    let freq = getFrequencies(text).slice(0, 500);
    console.log(freq);
    let canvas = $("#word-cloud")[0];
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetWidth;
    WordCloud(canvas, {
        list: freq,
        weightFactor: 0.015
    });
});

function getFrequencies(text) {
    let freq = new Map();
    for (let line of text) {
        for (let word of line.split(/[ |\n]/)) {
            if (word.length <= 0)
                continue;
            word = word.toLowerCase();
            let amount = freq.get(word);
            if (!amount)
                amount = 0;
            freq.set(word, amount + 1);
        }
    }

    let arr = Array.from(freq, ([w, a]) => [w, a]);
    arr.sort((e1, e2) => e2[1] - e1[1]);
    return arr;
}