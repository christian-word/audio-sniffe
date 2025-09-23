// ==UserScript==
// @name         Audio Sniffer (Play detector)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Показывает ссылку на mp3 при нажатии Play на сайтах с христианскими песнями
// @match        *://fonki.pro/*
// @match        *://kg-music.club/*
// @match        *://holychords.pro/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function showLink(url) {
        if (!url) return;
        // Всплывающее окно
        alert("Ссылка на аудио:\n" + url);
        // Лог в консоль (на всякий случай)
        console.log("Audio link:", url);
    }

    function attach(a) {
        if (!a._snifferAttached) {
            a.addEventListener("play", () => {
                if (a.currentSrc) showLink(a.currentSrc);
            });
            a._snifferAttached = true;
        }
    }

    // уже существующие <audio>
    document.querySelectorAll("audio").forEach(attach);

    // отслеживаем новые <audio>
    new MutationObserver(muts => {
        muts.forEach(m => m.addedNodes.forEach(node => {
            if (node.tagName === "AUDIO") attach(node);
            if (node.querySelectorAll) node.querySelectorAll("audio").forEach(attach);
        }));
    }).observe(document.documentElement, { childList: true, subtree: true });
})();
