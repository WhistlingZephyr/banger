import '@fontsource/inter';
import {useState} from 'react';
import ReactDOM from 'react-dom';
import {
    MdSettings,
    MdArchitecture,
    MdImportExport,
    MdHelp,
} from 'react-icons/md';
import NavBar, {type PageInfo} from '../components/navbar';
import SettingsPage from './options/settings';
import CustomBangsPage from './options/custom-bangs';
import ImportExportPage from './options/import-export';
import HelpPage from './options/help';

function App(): JSX.Element {
    const pageComponents: Record<string, JSX.Element> = {
        help: <HelpPage />,
        settings: <SettingsPage />,
        'custom-bangs': <CustomBangsPage />,
        'import-export': <ImportExportPage />,
    };
    const [page, setPage] = useState<JSX.Element>(pageComponents.settings);
    const pageInfo: PageInfo = [
        {icon: MdHelp, label: 'Help', id: 'help'},
        {icon: MdSettings, label: 'Settings', id: 'settings'},
        {icon: MdArchitecture, label: 'Custom bangs', id: 'custom-bangs'},
        {icon: MdImportExport, label: 'Import/Export', id: 'import-export'},
    ];
    return (
        <>
            <NavBar
                defaultPage="settings"
                pages={pageInfo}
                callback={(pageId): void => {
                    setPage(pageComponents[pageId]);
                }}
            />
            {page}
        </>
    );
}

ReactDOM.render(<App />, document.querySelector('#app'));
