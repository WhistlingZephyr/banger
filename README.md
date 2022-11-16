# Banger
![Icon](static/icons/icon.svg)

A FireFox extension that adds DuckDuckGo-like !Bangs to any search engine.

Install this extension at https://addons.mozilla.org/en-US/firefox/addon/banger/

Banger fetches list of bangs from DuckDuckGo and Brave, letting you choose which backend to use.
All processing is done client-side, so bang execution is faster than usual.

To learn more about bangs, see https://help.duckduckgo.com/duckduckgo-help-pages/features/bangs/ and https://search.brave.com/help/bangs

## Development
### Installation
You must install the required pnpm packages and setup husky hooks in order to develop this repository.
1. `pnpm install`
2. `pnpm run prepare`
### Testing
- `pnpm run test` to run all tests
- `pnpm run watch` to watch source files
- `pnpm run start` to start a firefox instance with the current addon build temporarily installed