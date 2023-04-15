<template>
    <div style="height: 100vh">
        <VueReader url="/files/啼笑因缘.epub" :getRendition="getRendition" />
        <button class="speak" @click="speak('click')">{{ isReading ? 'cancel' : 'speak' }}</button>
    </div>
</template>
<script setup>
import { VueReader } from "@/modules/index"
import { nextTick, ref } from 'vue'

let rendition = null, isAudioOn = false, text = null
let isReading = ref(false)
const getRendition = val => rendition = val
//Speak the text
const speak = (type) => {
    if (type === 'click') isReading.value = !isReading.value
    if (isReading.value) {
        voice(text)
    } else {
        isAudioOn = false
        window.speechSynthesis.cancel()
    }
}

const voice = (text, rate = 1) => {
    isAudioOn = true
    const msg = new SpeechSynthesisUtterance()
    msg.text = text;
    msg.voice = window.speechSynthesis.getVoices()[0];
    msg.rate = rate
    window.speechSynthesis.speak(msg);
    msg.onerror = (err) => {
        console.log(err);
    };
    msg.onend = async (event) => {
        if (!isReading.value && !isAudioOn) return
        rendition.next()
        speak()
    };
}

nextTick(() => {
    rendition.hooks.content.register((contents, view) => {
        let textContent = contents.document.body.textContent
        textContent = textContent
            .replace(/\s\s/g, "")
            .replace(/\r/g, "")
            .replace(/\n/g, "")
            .replace(/\t/g, "")
            .replace(/\f/g, "")
        text = textContent
    })
})
</script>
<style>
.speak {
    position: absolute;
    bottom: 1rem;
    /* right:50%; */
    /* left: 1rem; */
    /* text-align: center; */
    /* z-index: 1; */
}
</style>