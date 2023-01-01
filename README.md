# Banger
![Banger icon](static/icons/icon.svg)

A Firefox extension that adds DuckDuckGo-like !Bangs to any search engine.

Install this extension at https://addons.mozilla.org/en-US/Firefox/addon/banger/

## FAQ

### What are bangs?
Bangs are a feature of certain search engines (DuckDuckGo[^1.1], Brave Search[^1.2], Searx[^1.3], SearXNG[^1.4], You.com[^1.5]) that allow you to type shortcuts to quickly open up another search engine or website's URL. For example, you can type `!yt example` in DuckDuckGo to open up https://www.youtube.com/results?search_query=example, which is the page on YouTube for searching `example`; likewise, you can simply type `!yt` to open up https://www.youtube.com.

[^1.1]: https://duckduckgo.com/bangs
[^1.2]: https://search.brave.com/bangs
[^1.3]: https://searx.github.io/searx/user/search_syntax.html
[^1.4]: https://docs.searxng.org/user/index.html
[^1.5]: https://about.you.com/bangs/

### What does banger do?
Banger lets you execute !bangs client-side without having to send a request to a search engine's server each time you fetch a bang. It also allows you to use !bangs with any search engine rather than only those that support them. Also, it speeds your queries up because all the data is cached client-side and there are fewer redirects.

Banger also goes a step further and adds exclusive new features such as allowing you to define your own !bangs and having site bangs and super lucky bangs.

### Why does banger's search suggestions use Google?
Due to a technical limitation with the Web Extensions API, Banger can't direct search suggestions to its engine of choice instead of choosing a permanent search suggestion provider. Which forces it to settle down with one search suggestion provider, and Google is the most popular choice.

### What's a lucky bang?
Lucky bang is a bang without a specified search engine. Currently, it's only supported in DuckDuckGo (but with Banger you can use it anywhere) and you can use it by typing a `!` followed by a whitespace and your search query. It allows you to directly open up the first search result instead of having to manually click it after searching.

Officially, lucky lang doesn't have a name. Banger calls it `lucky lang` because of this feature similar to Google's `I'm feeling lucky` button.

Note: You can configure what symbol to use for the Lucky Bang on Banger's settings page.

### What's a site bang?
A site bang is what Banger calls the bangs that you can execute inside your search engine rather than opening up the target site's search. It works by using the `site:` syntax[^2.1][^2.2] of search engines. By default, Banger uses the prefix `!@` for site bangs; So you can type `!@yt example` to search up `site:https://www.youtube.com example` on your preferred search engine. There's plans to support sub-domain modification later.

[^2.1]: https://support.google.com/websearch/answer/2466433
[^2.2]: https://help.duckduckgo.com/duckduckgo-help-pages/results/syntax/

### What's a mixed site bang?
A mixed site bang is what banger calls the bangs where you can execute a site bang inside another bang, such as using `!ddg@yt example` to search `site:https://www.youtube.com example` on DuckDuckGo.

### What's a super lucky bang?
A super lucky bang is what Banger calls the bang where you combine a site bang with the lucky bang. By default, Banger uses the prefix `!!` for super lucky bangs. So you can type `!!yt example` and it'll open the first search result of `example` from YouTube. Unfortunately, the search results are currently only fetched from DuckDuckGo as I'm not aware of other search engines allowing you to redirect to the first search result freely.

### How to chain multiple bangs together?
You can chain multiple bangs, site bangs, mixed site bangs, or super lucky bangs together with Banger's multi-bang delimiter, which is `;` by default. So you can type `!yt;r` to open up YouTube and Reddit in their respective tabs, and `!yr;r example` to search `example` on both of them.

### How can I chain multiple sites together in site bangs, mixed site bangs, and super lucky bangs?
You can chain multiple of them together using Banger's multi-site bang delimiter, which is `,` by default. So you can type `!@yt,r example` to search `site:https://www.youtube.com/ | site:https://www.reddit.com/ example`. `|` here is the `OR` operator supported by most search engines[^3.1]; although as of 1st January 2023 Brave Search doesn't appear to support it yet.

[^3.1]: https://support.microsoft.com/en-gb/topic/advanced-search-options-b92e25f1-0085-4271-bdf9-14aaea720930

### Can I mix multi-bang and multi-site-bang chaining?
Yes, you can! Typing `!@yt,r;r example` searches `site:https://www.youtube.com/ | site:https://www.reddit.com/ example` in one tab and `site:https://www.reddit.com/ example` in another.

### Can I add my own bangs?
You absolutely can! Head to Banger's options page and click on the `Custom Bangs` tab.

### Can I use the symbols as postfixes rather than prefixes?
Yes, you can! Both postfix and prefix syntax is supported for bangs.

### Can I place my bang at the end of my query rather than at the start?
Yes, you can! Although placing them in the middle isn't supported, unfortunately.

### Will you add Chrome support?
I've been considering it but I don't think I'll do it unless this extension gets enough users. Unfortunately, Chrome's addon marketplace requires a $5 registration fee for publishing extensions[^4.1]. I'm not planning on adding Chrome compatibility until I can publish it there.

[^4.1]: https://developer.chrome.com/docs/webstore/register/

### Will you add Edge support?
It's planned! Since Microsoft Edge's marketplace doesn't require any registration fees[^5.1], I've been considering porting Banger to support Edge and publishing it there. Although currently, it doesn't appear that Edge's marketplace has anything similar to [web-ext-submit](https://www.npmjs.com/package/web-ext-submit), so integrating it into GitHub Actions might not be feasible.

[^5.1]: https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/create-dev-account

## Roadmap

- [x] Bangs with any search engine. (`!yt` to open YouTube, `!yt example` to search `example` in YouTube.)
- [x] Quick client-side bang querying and caching.
- [x] Support for all 13.5k DuckDuckGo bangs (https://duckduckgo.com/bangs). As well as the ability to switch to Brave Search's bangs instead. (https://search.brave.com/bangs)
- [x] Lucky bangs. (`! example` to open up the first search result for `example`.)
- [x] Site bangs. (`!@yt example` to search for `example` from YouTube on your preferred search engine.)
- [x] Mixed site bangs. (`!g@yt example` to search for `example` from YouTube on Google.)
- [x] Multi-bangs. (`!yt;r` to open up YouTube and Reddit in their respective tabs.)
- [x] Multi-site bangs. (`!@yt,r example` to search for `example` from YouTube or Reddit.)
- [x] Custom bangs. (You can define your own bangs in settings.)
- [x] Flexible syntax. (`!yt example`, `yt! example`, `example yt!`, `example !yt`)
- [x] Customization options.
- [x] Import/Export settings.
- [ ] Negative site bangs.
- [ ] Negative mixed site bangs.
- [ ] Mobile support.
- [ ] Custom bang sources.

## Development

### Installation

You must install the required npm packages and set up husky hooks to develop this repository.

1. `pnpm install`
2. `pnpm run prepare`

### Testing

- `pnpm run test` to run all tests
- `pnpm run watch` to watch source files
- `pnpm run start` to start a Firefox instance with the current addon build temporarily installed