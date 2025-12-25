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
    SPEED_UNIT: 'Mbps',
    PING_UNIT: 'ms',
    LIVE_INDICATOR: 'Mbps (Live)',

    // Button States
    BUTTON_START: 'START PING TEST',
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
    formatSpeed: (mbps) => `${mbps.toFixed(2)} Mbps`,
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
    IP_INFO: '/api/ip-info', // Your own API route
    CLOUDFLARE_TRACE: 'https://cloudflare.com/cdn-cgi/trace',
};

// Speed Test Configuration - Optimized for accuracy
export const SPEEDTEST_CONFIG = {
    autoStart: false,
    measureUpload: true,
    measureDownload: true,
    measurements: [
        { type: 'latency', numPackets: 5 },  // Initial ping samples
        { type: 'download', bytes: 1e5, count: 8, bypassMinDuration: true },
        { type: 'latency', numPackets: 10 }, // Mid-test latency
        { type: 'upload', bytes: 1e5, count: 8, bypassMinDuration: true },
        { type: 'latency', numPackets: 30 }  // Final latency (more samples = accurate jitter)
    ]
};

// Default export for convenience
export default APP_STRINGS;
