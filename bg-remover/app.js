import {
    removeBackground,
    preload
} from 'https://esm.sh/@imgly/background-removal@1.7.0?deps=onnxruntime-web@1.21.0';

const ACCEPTED_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif'
]);

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const statusInner = document.getElementById('status-inner');
const statusSpinner = document.getElementById('status-spinner');
const statusText = document.getElementById('status-text');
const resultImage = document.getElementById('result-image');
const resultPlaceholder = document.getElementById('result-placeholder');
const downloadBtn = document.getElementById('download-btn');

const modelStatus = document.getElementById('model-status');
const modelSpinner = document.getElementById('model-spinner');
const modelStatusText = document.getElementById('model-status-text');
const modelProgress = document.getElementById('model-progress');
const modelProgressBar = document.getElementById('model-progress-bar');

let runId = 0;
let resultObjectUrl = null;
let downloadName = 'background-removed.png';
let modelReady = false;
let isProcessing = false;

function canInteract() {
    return modelReady && !isProcessing;
}

function setDropzoneLocked(locked) {
    dropzone.classList.toggle('dropzone--locked', locked);
    dropzone.setAttribute('aria-disabled', locked ? 'true' : 'false');
    dropzone.tabIndex = locked ? -1 : 0;
    uploadBtn.disabled = locked;
    fileInput.disabled = locked;
}

function setProcessing(busy) {
    isProcessing = busy;
    dropzone.classList.toggle('dropzone--busy', busy);
    setDropzoneLocked(!canInteract());
}

function clearProcessStatus() {
    statusText.textContent = '';
    statusSpinner.hidden = true;
    statusSpinner.setAttribute('aria-hidden', 'true');
    statusInner.classList.remove('status--error');
}

function setProcessStatus(message, { spinning = false, error = false } = {}) {
    statusText.textContent = message || '';
    statusSpinner.hidden = !spinning;
    statusSpinner.setAttribute('aria-hidden', spinning ? 'false' : 'true');
    statusInner.classList.toggle('status--error', Boolean(error));
}

function showModelStatus(message, progressPct, error) {
    modelStatus.hidden = false;
    modelStatus.classList.toggle('model-status--error', Boolean(error));
    modelStatusText.textContent = message || '';
    modelSpinner.hidden = Boolean(error);
    modelSpinner.setAttribute('aria-hidden', error ? 'true' : 'false');

    if (progressPct == null || error) {
        modelProgress.hidden = true;
        modelProgressBar.style.width = '0%';
        return;
    }

    modelProgress.hidden = false;
    modelProgressBar.style.width = Math.max(0, Math.min(100, progressPct)) + '%';
}

function hideModelStatus() {
    modelStatus.hidden = true;
    modelSpinner.hidden = true;
    modelSpinner.setAttribute('aria-hidden', 'true');
    modelProgress.hidden = true;
    modelProgressBar.style.width = '0%';
    modelStatusText.textContent = '';
    modelStatus.classList.remove('model-status--error');
}

function clearResult() {
    if (resultObjectUrl) {
        URL.revokeObjectURL(resultObjectUrl);
        resultObjectUrl = null;
    }
    resultImage.hidden = true;
    resultImage.removeAttribute('src');
    resultPlaceholder.hidden = false;
    downloadBtn.disabled = true;
}

function showResult(blob) {
    if (resultObjectUrl) {
        URL.revokeObjectURL(resultObjectUrl);
    }
    resultObjectUrl = URL.createObjectURL(blob);
    resultImage.src = resultObjectUrl;
    resultImage.hidden = false;
    resultPlaceholder.hidden = true;
    downloadBtn.disabled = false;
}

function isAcceptedFile(file) {
    if (!file) return false;
    if (ACCEPTED_TYPES.has(file.type)) return true;
    return /\.(png|jpe?g|webp|gif)$/i.test(file.name || '');
}

function baseNameWithoutExt(name) {
    const trimmed = (name || 'image').trim() || 'image';
    const dot = trimmed.lastIndexOf('.');
    return dot > 0 ? trimmed.slice(0, dot) : trimmed;
}

async function initModel() {
    modelReady = false;
    setDropzoneLocked(true);
    showModelStatus('Downloading model…', 0);

    try {
        await preload({
            progress: function (key, current, total) {
                if (String(key).indexOf('fetch:') === 0 && total > 0) {
                    const pct = Math.min(100, Math.round((current / total) * 100));
                    showModelStatus('Downloading model… ' + pct + '%', pct);
                } else {
                    showModelStatus('Preparing model…', null);
                }
            }
        });
        modelReady = true;
        hideModelStatus();
        setDropzoneLocked(false);
    } catch (err) {
        console.error(err);
        modelReady = false;
        showModelStatus('Model download failed. Refresh the page to retry.', null, true);
        setDropzoneLocked(true);
    }
}

async function processFile(file) {
    if (!canInteract()) return;

    if (!isAcceptedFile(file)) {
        setProcessStatus('Please choose a PNG, JPEG, WebP, or GIF image.', { error: true });
        return;
    }

    const currentRun = ++runId;
    downloadName = baseNameWithoutExt(file.name) + '-no-bg.png';

    setProcessing(true);
    clearResult();
    setProcessStatus('Removing background…', { spinning: true });

    try {
        const blob = await removeBackground(file, {
            output: {
                format: 'image/png'
            }
        });

        if (currentRun !== runId) return;

        showResult(blob);
        clearProcessStatus();
    } catch (err) {
        if (currentRun !== runId) return;
        console.error(err);
        clearResult();
        setProcessStatus('Could not remove background. Try another image.', { error: true });
    } finally {
        if (currentRun === runId) {
            setProcessing(false);
            if (!statusInner.classList.contains('status--error') && !statusText.textContent) {
                clearProcessStatus();
            }
        }
    }
}

function openFilePicker() {
    if (!canInteract()) return;
    fileInput.click();
}

uploadBtn.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    openFilePicker();
});

dropzone.addEventListener('click', function (event) {
    if (!canInteract()) return;
    if (event.target === uploadBtn || uploadBtn.contains(event.target)) return;
    openFilePicker();
});

dropzone.addEventListener('keydown', function (event) {
    if (!canInteract()) return;
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFilePicker();
    }
});

fileInput.addEventListener('change', function () {
    if (!canInteract()) return;
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = '';
    if (file) processFile(file);
});

;['dragenter', 'dragover'].forEach(function (type) {
    dropzone.addEventListener(type, function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (canInteract()) {
            dropzone.classList.add('dropzone--active');
        }
    });
});

;['dragleave', 'drop'].forEach(function (type) {
    dropzone.addEventListener(type, function (event) {
        event.preventDefault();
        event.stopPropagation();
        dropzone.classList.remove('dropzone--active');
    });
});

dropzone.addEventListener('drop', function (event) {
    if (!canInteract()) return;
    const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) processFile(file);
});

downloadBtn.addEventListener('click', function () {
    if (!resultObjectUrl) return;
    const link = document.createElement('a');
    link.href = resultObjectUrl;
    link.download = downloadName;
    link.click();
});

initModel();
