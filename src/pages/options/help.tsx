import {useState, useEffect} from 'react';
import Page from '../../components/page';
import styles from './css/help.module.css';
import Code from '@/components/code';
import {type ConfigData, getConfig} from '@/helpers/import-export';
import Link from '@/components/link';

export default function HelpPage(): JSX.Element {
    const [config, setConfig] = useState<ConfigData>();

    useEffect(() => {
        (async (): Promise<void> => {
            setConfig(await getConfig());
        })();
    }, []);

    return (
        <Page>
            {config ? (
                <>
                    <h1 className={styles.header}>Links</h1>
                    <ul className={styles.list}>
                        <li>
                            GitHub:{' '}
                            <Link url="https://github.com/WhistlingZephyr/banger" />
                        </li>
                        <li>
                            Firefox Add-ons:{' '}
                            <Link url="https://addons.mozilla.org/en-US/firefox/addon/banger/" />
                        </li>
                    </ul>
                    <h1 className={styles.header}>Quick start</h1>
                    <ul className={styles.list}>
                        <li>
                            Choose your preferred search engine in Banger
                            settings.
                        </li>
                        <li>
                            Set your default search engine to Banger in Firefox
                            settings.
                        </li>
                        <li>
                            Type <Code>{config.bangPrefix}bang</Code> to get a
                            list of bangs, and{' '}
                            <Code>{config.bangPrefix}bang query</Code> to search
                            bangs.
                        </li>
                        <li>
                            Type <Code>{config.bangPrefix}yt</Code> to open up
                            YouTube.
                        </li>
                        <li>
                            Type <Code>{config.bangPrefix}yt example</Code> to
                            search <Code>example</Code> on YouTube.
                        </li>
                        <li>
                            Type <Code>{config.luckyBang} example</Code> to open
                            up the first result for <Code>example</Code>.
                        </li>
                        <li>
                            Type{' '}
                            <Code>{config.superLuckyBangPrefix}yt example</Code>{' '}
                            to open up the first YouTube result for{' '}
                            <Code>example</Code>.
                        </li>
                        <li>
                            Type{' '}
                            <Code>
                                {config.bangPrefix}
                                {config.siteBangSep}yt example
                            </Code>{' '}
                            to search YouTube videos for <Code>example</Code> in
                            your preferred search engine.
                        </li>
                        <li>
                            Type{' '}
                            <Code>
                                {config.bangPrefix}g{config.siteBangSep}yt
                                example
                            </Code>{' '}
                            to search YouTube videos for <Code>example</Code> on
                            Google.
                        </li>
                    </ul>
                    <h1 className={styles.header}>Advanced</h1>
                    <ul className={styles.list}>
                        <li>
                            Open multiple tabs by chaining bangs with{' '}
                            <Code>{config.multiBangDelim}</Code>. (
                            <Code>
                                {config.bangPrefix}yt{config.multiBangDelim}r
                            </Code>
                            ,{' '}
                            <Code>
                                {config.bangPrefix}yt{config.multiBangDelim}r
                                example
                            </Code>
                            ,{' '}
                            <Code>
                                {config.superLuckyBangPrefix}yt
                                {config.multiBangDelim}r example
                            </Code>
                            ,{' '}
                            <Code>
                                {config.bangPrefix}
                                {config.siteBangSep}yt{config.multiBangDelim}r
                                example
                            </Code>
                            ,{' '}
                            <Code>
                                !g{config.siteBangSep}yt{config.multiBangDelim}
                                ddg{config.siteBangSep}r example
                            </Code>
                            )
                        </li>
                        <li>
                            Chain site bangs with{' '}
                            <Code>{config.multiSiteBangDelim}</Code>. (
                            <Code>
                                {config.superLuckyBangPrefix}yt
                                {config.multiSiteBangDelim}r example
                            </Code>
                            ,{' '}
                            <Code>
                                {config.bangPrefix}
                                {config.siteBangSep}yt
                                {config.multiSiteBangDelim}r example
                            </Code>
                            ,{' '}
                            <Code>
                                {config.bangPrefix}g{config.siteBangSep}yt
                                {config.multiSiteBangDelim}r example
                            </Code>
                            )
                        </li>
                        <li>
                            Mix and match. (
                            <Code>
                                {config.superLuckyBangPrefix}yt
                                {config.multiSiteBangDelim}r
                                {config.multiBangDelim}r example
                            </Code>
                            ,{' '}
                            <Code>
                                {config.bangPrefix}g{config.siteBangSep}yt
                                {config.multiSiteBangDelim}r
                                {config.multiBangDelim}ddg
                                {config.siteBangSep}r example
                            </Code>
                            )
                        </li>
                    </ul>
                </>
            ) : (
                <h1 className={styles.header}>Loading...</h1>
            )}
        </Page>
    );
}
