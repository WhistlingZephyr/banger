declare namespace browser {
    /**
     * Retrieves search engines and executes a search with a specific search engine.
     *
     * To use this API you need to have the "search" permission.
     */
    export namespace search {
        type Engine = {
            name: string;
            isDefault: boolean;
            alias?: string;
            favIconUrl?: string;
        };
        /**
         * Gets an array of all installed search engines.
         *
         * Each search engine returned is identified with a name,
         * which you can pass into search.search() to use that particular engine to make a search.
         *
         * This is an asynchronous function that returns a Promise.
         */
        export function get(): Promise<Engine[]>;
        /**
         * Perform a search using the search engine specified,
         * or the default search engine if no search engine is specified.
         *
         * The results will be displayed in a new tab, or if the tabId argument is given,
         * in the tab identified by this.
         *
         * To use this function in your extension you must ask for the "search" manifest permission.
         * @param searchProperties To get the installed search engines, use search.get().
         */
        export function search(searchProperties: {
            query: string;
            engine?: string;
            tabId?: number;
        }): void;
    }
}
