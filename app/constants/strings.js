// App-wide string constants
// Centralized strings for easy updates and potential i18n

export const APP_STRINGS = {
    // App Info
    APP_NAME: 'ScanPing',
    APP_TAGLINE: 'Fast, Accurate Internet Speed Test',
    APP_DESCRIPTION: 'Test your internet speed with ScanPing - check download, upload speeds, ping, and latency. Free online speed test for wifi, broadband, and network diagnostics.',

    // Header
    HEADER_TITLE: 'ScanPing',
    HEADER_SUBTITLE: 'Fast, Accurate Internet Speed Test',

    // Connection Info
    CONNECTION_TITLE: 'Your Connection',
    IP_LABEL: 'IP:',
    IP_DETECTING: 'Detecting...',
    IP_ERROR: 'Unable to detect',
    LOCATION_DETECTING: 'Detecting...',
    LOCATION_UNKNOWN: 'Unknown',

    // Speed Test Cards
    DOWNLOAD_LABEL: 'Download',
    UPLOAD_LABEL: 'Upload',
    PING_LABEL: 'Ping',
    JITTER_LABEL: 'Jitter',
    SPEED_UNIT: 'Mbps',
    PING_UNIT: 'ms',
    LIVE_INDICATOR: 'Mbps (Live)',

    // Button States
    BUTTON_START: 'Start Speed Test',
    BUTTON_TESTING: 'Testing...',

    // Test Stages
    STAGE_INIT: 'Initializing...',
    STAGE_LATENCY: 'Measuring latency...',
    STAGE_DOWNLOAD: 'Testing download speed...',
    STAGE_UPLOAD: 'Testing upload speed...',
    STAGE_COMPLETE: 'Complete!',
    STAGE_FAILED: 'Test failed',

    // Results
    RESULTS_TITLE: 'Test Complete',
    RESULTS_DOWNLOAD: 'Download:',
    RESULTS_UPLOAD: 'Upload:',
    RESULTS_LATENCY: 'Latency:',

    // Footer
    FOOTER_TEXT: `© Copyright ${new Date().getFullYear()} scanpings.net - Powered by ScanPing`,

    // Console Messages
    CONSOLE_START: '🚀 ScanPing - Powered by ScanPing',
    CONSOLE_ENGINE: '⚡ ScanPing library',
    CONSOLE_COMPLETE: '✅ TEST COMPLETE!',
    CONSOLE_FAILED: '❌ Test failed:',

    // Units & Formatting
    formatSpeed: (mbps) => {
        // Ensure mbps is a number
        const speed = typeof mbps === 'string' ? parseFloat(mbps) : (typeof mbps === 'number' ? mbps : 0);

        if (speed >= 1000) {
            return `${(speed / 1000).toFixed(1)} Gbps`;
        } else if (speed >= 1) {
            return `${speed.toFixed(1)} Mbps`;
        } else if (speed >= 0.001) {
            return `${(speed * 1000).toFixed(0)} Kbps`;
        } else {
            return `${(speed * 1000000).toFixed(0)} bps`;
        }
    },
    formatSpeedValue: (mbps) => {
        const n = Number(mbps);
        if (n >= 1000) {
            return (n / 1000).toFixed(1);
        } else if (n >= 1) {
            return n.toFixed(1);
        } else if (n >= 0.001) {
            return (n * 1000).toFixed(0);
        } else {
            return (n * 1000000).toFixed(0);
        }
    },
    formatSpeedUnit: (mbps) => {
        if (mbps >= 1000) {
            return 'Gbps';
        } else if (mbps >= 1) {
            return 'Mbps';
        } else if (mbps >= 0.001) {
            return 'Kbps';
        } else {
            return 'bps';
        }
    },
    formatSpeedWithBytes: (mbps) => `${mbps.toFixed(2)} Mbps (${(mbps / 8).toFixed(2)} MB/s)`,
    formatPing: (ms) => `${ms} ms`,
    formatLocation: (city, country) => {
        if (city && city !== 'Unknown' && country && country !== 'Unknown') return `${city}, ${country}`;
        if (country && country !== 'Unknown') return country;
        return 'Detecting...';
    },
};

// API Endpoints
export const API_ENDPOINTS = {
    IP_PRIMARY: 'https://ipwho.is/json/',
    IP_FALLBACK: 'https://ipapi.co/json/',
    CLOUDFLARE_TRACE: 'https://cloudflare.com/cdn-cgi/trace',
};

// Speed Test Configuration - Optimized for accuracy
export const SPEEDTEST_CONFIG = {
    autoStart: false,
    measureUpload: true,
    measureDownload: true,
    measurements: [
        { type: 'latency', numPackets: 1 },  // Simple latency test
        { type: 'download', bytes: 1e5, count: 5, bypassMinDuration: true },
        { type: 'upload', bytes: 1e5, count: 5, bypassMinDuration: true },
        { type: 'latency', numPackets: 1 }  // Final latency
    ]
};

// Test Servers - Cloudflare edge locations
export const TEST_SERVERS = [
    {
        id: 'auto',
        name: 'Auto Select',
        location: 'Nearest Server',
        host: 'auto',
        distance: 0,
        region: 'auto'
    },
    {
        id: 'lax',
        name: 'Los Angeles',
        location: 'California, USA',
        host: 'speed.cloudflare.com',
        distance: 0, // Will be calculated based on user location
        region: 'us-west'
    },
    {
        id: 'iad',
        name: 'Washington DC',
        location: 'Virginia, USA',
        host: 'speed.cloudflare.com',
        distance: 0,
        region: 'us-east'
    },
    {
        id: 'lhr',
        name: 'London',
        location: 'England, UK',
        host: 'speed.cloudflare.com',
        distance: 0,
        region: 'eu-west'
    },
    {
        id: 'fra',
        name: 'Frankfurt',
        location: 'Germany',
        host: 'speed.cloudflare.com',
        distance: 0,
        region: 'eu-central'
    },
    {
        id: 'sin',
        name: 'Singapore',
        location: 'Singapore',
        host: 'speed.cloudflare.com',
        distance: 0,
        region: 'asia-southeast'
    },
    {
        id: 'syd',
        name: 'Sydney',
        location: 'Australia',
        host: 'speed.cloudflare.com',
        distance: 0,
        region: 'oceania'
    }
];

// Default export for convenience
export default APP_STRINGS;
