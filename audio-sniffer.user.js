// ==UserScript==
// @name         Audio Sniffer (кнопка "Скачать")
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Добавляет кнопку "Скачать" рядом с плеером при нажатии Play
// @match        *://fonki.pro/*
// @match        *://kg-music.club/*
// @match        *://holychords.pro/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton(audio, url) {
        if (!url) return;
        if (audio._downloadButtonAdded) return;

        const btn = document.createElement("a");
        btn.textContent = "⬇ Скачать";
        btn.href = url;
        btn.target = "_blank";
        btn.style.display = "inline-block";
        btn.style.marginLeft = "10px";
        btn.style.padding = "4px 8px";
        btn.style.background = "#2a623d";
        btn.style.color = "#fff";
        btn.style.borderRadius = "4px";
        btn.style.fontSize = "13px";
        btn.style.textDecoration = "none";
        btn.style.fontWeight = "bold";

        audio.insertAdjacentElement("afterend", btn);
        audio._downloadButtonAdded = true;
    }

    function attach(audio) {
        if (audio._snifferAttached) return;
        audio.addEventListener("play", () => {
            if (audio.currentSrc) {
                addDownloadButton(audio, audio.currentSrc);
                console.log("Audio link:", audio.currentSrc);
            }
        });
        audio._snifferAttached = true;
    }

    // существующие <audio>
    document.querySelectorAll("audio").forEach(attach);

    // новые <audio>
    new MutationObserver(muts => {
        muts.forEach(m => m.addedNodes.forEach(node => {
            if (node.tagName === "AUDIO") attach(node);
            if (node.querySelectorAll) node.querySelectorAll("audio").forEach(attach);
        }));
    }).observe(document.documentElement, { childList: true, subtree: true });
})();
