import { spfi, SPFx, SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { WebPartContext } from '@microsoft/sp-webpart-base';

let sp: SPFI;

export const initializePnp = (context: WebPartContext): void => {
    sp = spfi().using(SPFx(context));
};

export { sp };
