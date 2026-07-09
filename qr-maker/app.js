(function () {
    'use strict';

    var DEBOUNCE_MS = 200;
    var QR_OPTIONS = {
        width: 256,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
    };

    var activeTab = 'website';
    var hasValidQr = false;
    var debounceTimer = null;
    var renderId = 0;

    var tabButtons = document.querySelectorAll('.tabs__btn');
    var tabPanels = document.querySelectorAll('.tab-panel');
    var canvas = document.getElementById('qr-canvas');
    var placeholder = document.getElementById('preview-placeholder');
    var downloadBtn = document.getElementById('download-btn');

    var inputs = {
        website: document.getElementById('website-url'),
        contactName: document.getElementById('contact-name'),
        contactPhone: document.getElementById('contact-phone'),
        contactEmail: document.getElementById('contact-email'),
        text: document.getElementById('text-content')
    };

    function normalizeUrl(value) {
        var trimmed = value.trim();
        if (!trimmed) return '';
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        return 'https://' + trimmed;
    }

    function buildVcard(name, phone, email) {
        var lines = ['BEGIN:VCARD', 'VERSION:3.0'];
        if (name) lines.push('FN:' + name);
        if (phone) lines.push('TEL;TYPE=CELL:' + phone);
        if (email) lines.push('EMAIL:' + email);
        lines.push('END:VCARD');
        return lines.join('\n');
    }

    function getPayload() {
        if (activeTab === 'website') {
            var url = normalizeUrl(inputs.website.value);
            return url || null;
        }

        if (activeTab === 'contact') {
            var name = inputs.contactName.value.trim();
            var phone = inputs.contactPhone.value.trim();
            var email = inputs.contactEmail.value.trim();
            if (!phone && !email) return null;
            return buildVcard(name, phone, email);
        }

        if (activeTab === 'text') {
            var text = inputs.text.value;
            return text.length > 0 ? text : null;
        }

        return null;
    }

    function clearCanvas() {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function showPlaceholder(message) {
        renderId += 1;
        hasValidQr = false;
        clearCanvas();
        canvas.hidden = true;
        placeholder.hidden = false;
        placeholder.textContent = message;
        downloadBtn.disabled = true;
    }

    function renderQr(payload) {
        var currentRender = renderId + 1;
        renderId = currentRender;

        QRCode.toCanvas(canvas, payload, QR_OPTIONS, function (err) {
            if (currentRender !== renderId) return;

            if (err) {
                showPlaceholder('Could not generate QR code');
                return;
            }
            hasValidQr = true;
            canvas.hidden = false;
            placeholder.hidden = true;
            downloadBtn.disabled = false;
        });
    }

    function updateQr() {
        var payload = getPayload();
        if (!payload) {
            showPlaceholder('Enter content to generate a QR code');
            return;
        }
        renderQr(payload);
    }

    function scheduleUpdate() {
        clearTimeout(debounceTimer);
        if (!getPayload()) {
            showPlaceholder('Enter content to generate a QR code');
            return;
        }
        debounceTimer = setTimeout(updateQr, DEBOUNCE_MS);
    }

    function switchTab(tab) {
        activeTab = tab;

        tabButtons.forEach(function (btn) {
            var isActive = btn.dataset.tab === tab;
            btn.classList.toggle('tabs__btn--active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        tabPanels.forEach(function (panel) {
            var isActive = panel.id === 'panel-' + tab;
            panel.classList.toggle('tab-panel--active', isActive);
            panel.hidden = !isActive;
        });

        updateQr();
    }

    function downloadPng() {
        if (!hasValidQr) return;
        var link = document.createElement('a');
        link.download = 'qr-' + activeTab + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            switchTab(btn.dataset.tab);
        });
    });

    Object.keys(inputs).forEach(function (key) {
        inputs[key].addEventListener('input', scheduleUpdate);
    });

    downloadBtn.addEventListener('click', downloadPng);

    switchTab('website');
})();
