import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { initializePnp } from './pnpjsConfig';

import SearchWebPart from './components/SearchWebPart';
import { ISearchWebPartProps } from './components/ISearchWebPartProps';

export interface ISearchWebPartWebPartProps {
  description: string;
}

export default class SearchWebPartWebPart extends BaseClientSideWebPart<ISearchWebPartWebPartProps> {

  public onInit(): Promise<void> {
    return super.onInit().then(() => {
      initializePnp(this.context);
    });
  }

  public render(): void {
    const element: React.ReactElement<ISearchWebPartProps> = React.createElement(
      SearchWebPart,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
