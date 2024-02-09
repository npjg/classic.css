import {createContext} from 'react';

export const defaultAppContext = {elements: {}, windows: {}};
const PlatinumAppContext = createContext({
    appContext: defaultAppContext,
    setAppContext: (ctx) => {
    }
});

export default PlatinumAppContext;

