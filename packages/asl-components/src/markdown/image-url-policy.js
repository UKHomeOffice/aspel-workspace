const ALLOWED_DATA_IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

function decodeMarkdownEscapes(value = '') {
    return value.replace(/\\([:/@?&=%#])/g, '$1');
}

function isPrivateIPv4(hostname) {
    const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (!ipv4Match) {
        return false;
    }

    const octets = ipv4Match.slice(1).map(Number);
    if (octets.some(octet => octet > 255)) {
        return true;
    }

    return (
        octets[0] === 10 ||
        (octets[0] === 127) ||
        (octets[0] === 169 && octets[1] === 254) ||
        (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
        (octets[0] === 192 && octets[1] === 168) ||
        hostname === '0.0.0.0'
    );
}

function isBlockedHostname(hostname = '') {
    const lower = hostname.toLowerCase();
    return (
        lower === 'localhost' ||
        lower === '::1' ||
        lower === '[::1]' ||
        lower === '0:0:0:0:0:0:0:1' ||
        isPrivateIPv4(lower)
    );
}

function isAllowedDataImageUrl(value = '') {
    const lower = value.toLowerCase();
    const matchedType = ALLOWED_DATA_IMAGE_MIME_TYPES.find(type => lower.startsWith(`data:${type};base64,`));
    if (!matchedType) {
        return false;
    }

    const payload = value.slice(`data:${matchedType};base64,`.length);
    return /^[a-z0-9+/=\s]+$/i.test(payload);
}

export function isAllowedImageUrl(rawValue) {
    if (typeof rawValue !== 'string') {
        return false;
    }

    const value = decodeMarkdownEscapes(rawValue.trim());
    if (!value || value.startsWith('//')) {
        return false;
    }

    if (/["'<>`]/.test(value)) {
        return false;
    }

    if (value.startsWith('/')) {
        return true;
    }

    if (value.toLowerCase().startsWith('data:')) {
        return isAllowedDataImageUrl(value);
    }

    if (/\s/.test(value)) {
        return false;
    }

    let parsed;
    try {
        parsed = new URL(value);
    }
    catch (e) {
        return false;
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
        return false;
    }

    if (parsed.username || parsed.password) {
        return false;
    }

    return !isBlockedHostname(parsed.hostname);
}

export function filterImageUrl(rawValue) {
    const value = decodeMarkdownEscapes((rawValue || '').trim());
    return isAllowedImageUrl(value) ? value : undefined;
}


