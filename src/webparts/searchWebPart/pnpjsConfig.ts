import { spfi, SPFx, SPFI } from '@pnp/sp';
import '@pnp/sp/webs';    // Extends sp with the .web property
import '@pnp/sp/lists';   // Enables lists functionality
import '@pnp/sp/items';   // Enables items functionality
import { WebPartContext } from '@microsoft/sp-webpart-base';

// Declare a module-level variable to hold the SPFI instance.
let sp: SPFI;

/**
 * Initializes PnPjs with the SPFx context.
 * Call this method in your web part's onInit.
 */
export const initializePnp = (context: WebPartContext): void => {
    sp = spfi().using(SPFx(context));
};

// Export the configured sp instance.
export { sp };
