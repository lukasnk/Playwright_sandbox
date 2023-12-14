import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    use: {
        headless: false, // Run tests in headful mode
        // other options...
    },
    // ... rest of the configuration ...
};

export default config;
