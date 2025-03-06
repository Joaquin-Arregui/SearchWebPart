import * as React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { ListView, IViewField } from '@pnp/spfx-controls-react/lib/ListView';
import { sp } from '../pnpjsConfig';
import { ISearchWebPartProps } from './ISearchWebPartProps';
import { ISearchWebPartState } from './ISearchWebPartState';
import styles from '../SearchWebPart.module.scss';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IDeliverableItem } from '../models/IDeliverableItem';

export default class SearchWebPart extends React.Component<ISearchWebPartProps, ISearchWebPartState> {

  private viewFields: IViewField[] = [
    { 
      name: 'Id', 
      displayName: 'ID', 
      sorting: true, 
      minWidth: 25 
    },
    { 
      name: 'Deliverable', 
      displayName: 'Deliverable', 
      sorting: true, 
      minWidth: 100 
    },
    { 
      name: 'Title', 
      displayName: 'Title', 
      sorting: true, 
      minWidth: 300 
    },
    {
      name: 'Topic',
      displayName: 'Topic',
      sorting: true,
      minWidth: 200,
      render: (item: IDeliverableItem) => {
        const topicValues = Object.keys(item)
          .filter(key => key.indexOf('Topic.') === 0 && /^\d+$/.test(key.split('.')[1]))
          .map(key => item[key]);

        const values = topicValues.length > 0
          ? topicValues
          : (item.Topic ? [item.Topic] : []);

        const topicColors: { [key: string]: string } = {
          'Management': '#d4e7f6',
          'Campus': '#caf0cc',
          'Education': '#ffebc0',
          'Research': '#0078d4',
          'Innovation': '#4f6bed',
          'EDI': '#ca5010',
          'Mobility': '#498205',
          'Dissemination/Impact': '#a4262c',
          'Internationalisation': '#e5d2e3',
          'Structures': '#eaeaea'
        };
        const topicLetterColors: { [key: string]: string } = {
          'Management': '#007ace',
          'Campus': '#437406',
          'Education': '#d08b00',
          'Research': '#ffffff',
          'Innovation': '#ffffff',
          'EDI': '#ffffff',
          'Mobility': '#ffffff',
          'Dissemination/Impact': '#ffffff',
          'Internationalisation': '#864199',
          'Structures': '#000000'
        };

        return (
          <div>
            {values.map((val: string, idx: number) => {
              const color = topicColors[val] || '#FFFFFF';
              const letterColor = topicLetterColors[val] || '#000000';
              return (
                <span
                  key={idx}
                  style={{
                    backgroundColor: color,
                    color: letterColor,
                    padding: '4px 8px',
                    borderRadius: '12px',
                    marginRight: '6px',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {val}
                </span>
              );
            })}
          </div>
        );
      }
    },
    { 
      name: 'Leader', 
      displayName: 'Leader', 
      sorting: true, 
      minWidth: 70,
      render: (item: IDeliverableItem) => {
        const leaderColors: { [key: string]: string } = {
          'USE': '#a4262c', 
          'UniCA': '#80c6ff',
          'UniGE': '#004e8c',
          'TUKE': '#9e6c00',
          'MCI': '#ac539d',
          'HH': '#caf0cc',
          'UMS': '#498205',
          'UoM': '#ffebc0'
        };
        const leaderLetterColors: { [key: string]: string } = {
          'USE': '#ffffff', 
          'UniCA': '#004e8c',
          'UniGE': '#ffffff',
          'TUKE': '#ffffff',
          'MCI': '#ffffff',
          'HH': '#437406',
          'UMS': '#ffffff',
          'UoM': '#8f6200'
        };
        const leaderVal = item.Leader || '—';
        const color = leaderColors[leaderVal] || '#000000';
        const colorLetter = leaderLetterColors[leaderVal] || '#ffffff';
        return (
          <span
            style={{
              backgroundColor: color,
              color: colorLetter,
              padding: '4px 8px',
              borderRadius: '12px',
              marginRight: '6px',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap'
            }}
          >
            {leaderVal}
          </span>
        );
      }
    },
    { 
      name: 'Project', 
      displayName: 'Project', 
      sorting: true, 
      minWidth: 80,
      render: (item: IDeliverableItem) => {
        const projectColors: { [key: string]: string } = {
          'Ulysseus1': '#d13438',
          'Ulysseus2': '#7252aa',
          'Compass': '#038387'
        };
        const projectVal = item.Project || '—';
        const color = projectColors[projectVal] || '#666666';
        return (
          <span
            style={{
              backgroundColor: color,
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem'
            }}
          >
            {projectVal}
          </span>
        );
      }
    },
    {
      name: 'Submitted',
      displayName: 'Submitted',
      sorting: true,
      minWidth: 100,
      render: (item: IDeliverableItem) => {
        return item.Submitted ? (
          <Icon
            iconName="CheckMark"
            styles={{ root: { fontSize: '16px', color: '#000' } }}
          />
        ) : null;
      }
    },
    { 
      name: 'Dissemination', 
      displayName: 'Dissemination', 
      sorting: true, 
      minWidth: 100,
      render: (item: IDeliverableItem) => {
        const disseminationColors: { [key: string]: string } = {
          'Confidential': '#4f6bed',
          'Public': '#ac539d'
        };
        const val = item.Dissemination || '—';
        const color = disseminationColors[val] || '#666666';
        return (
          <span
            style={{
              backgroundColor: color,
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem'
            }}
          >
            {val}
          </span>
        );
      }
    }
  ];

  constructor(props: ISearchWebPartProps) {
    super(props);
    this.state = {
      searchQuery: '',
      items: [],
      selectedTopic: '',
      selectedProject: '',
      selectedLeader: ''
    };
  }

  private _onSearchChange = (newValue: string): void => {
    this.setState({ searchQuery: newValue }, () => {
      this._performSearch();
    });
  }

  private _onTopicChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    this.setState({ selectedTopic: option ? option.key.toString() : '' }, () => {
      this._performSearch();
    });
  }

  private _onProjectChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    this.setState({ selectedProject: option ? option.key.toString() : '' }, () => {
      this._performSearch();
    });
  }

  private _onLeaderChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    this.setState({ selectedLeader: option ? option.key.toString() : '' }, () => {
      this._performSearch();
    });
  }

  private _onRenderTopicOption = (option: IDropdownOption): JSX.Element => {
    if (!option || !option.text) return <span />;
    if (option.key === '') return <span>{option.text}</span>;

    const topicColors: { [key: string]: string } = {
      'Management': '#d4e7f6',
      'Campus': '#caf0cc',
      'Education': '#ffebc0',
      'Research': '#0078d4',
      'Innovation': '#4f6bed',
      'EDI': '#ca5010',
      'Mobility': '#498205',
      'Dissemination/Impact': '#a4262c',
      'Internationalisation': '#e5d2e3',
      'Structures': '#eaeaea'
    };
    const topicLetterColors: { [key: string]: string } = {
      'Management': '#007ace',
      'Campus': '#437406',
      'Education': '#d08b00',
      'Research': '#ffffff',
      'Innovation': '#ffffff',
      'EDI': '#ffffff',
      'Mobility': '#ffffff',
      'Dissemination/Impact': '#ffffff',
      'Internationalisation': '#864199',
      'Structures': '#000000'
    };

    const color = topicColors[option.text] || '#FFFFFF';
    const letterColor = topicLetterColors[option.text] || '#000000';

    return (
      <span
        style={{
          backgroundColor: color,
          color: letterColor,
          padding: '4px 8px',
          borderRadius: '12px',
          marginRight: '6px',
          fontSize: '0.75rem',
          whiteSpace: 'nowrap'
        }}
      >
        {option.text}
      </span>
    );
  };

  private _onRenderProjectOption = (option: IDropdownOption): JSX.Element => {
    if (!option || !option.text) return <span />;
    if (option.key === '') return <span>{option.text}</span>;

    const projectColors: { [key: string]: string } = {
      'Ulysseus1': '#d13438',
      'Ulysseus2': '#7252aa',
      'Compass': '#038387'
    };
    const color = projectColors[option.text] || '#666666';

    return (
      <span
        style={{
          backgroundColor: color,
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem'
        }}
      >
        {option.text}
      </span>
    );
  };

  private _onRenderLeaderOption = (option: IDropdownOption): JSX.Element => {
    if (!option || !option.text) return <span />;
    if (option.key === '') return <span>{option.text}</span>;

    const leaderColors: { [key: string]: string } = {
      'USE': '#a4262c', 
      'UniCA': '#80c6ff',
      'UniGE': '#004e8c',
      'TUKE': '#9e6c00',
      'MCI': '#ac539d',
      'HH': '#caf0cc',
      'UMS': '#498205',
      'UoM': '#ffebc0'
    };
    const leaderLetterColors: { [key: string]: string } = {
      'USE': '#ffffff', 
      'UniCA': '#004e8c',
      'UniGE': '#ffffff',
      'TUKE': '#ffffff',
      'MCI': '#ffffff',
      'HH': '#437406',
      'UMS': '#ffffff',
      'UoM': '#8f6200'
    };

    const color = leaderColors[option.text] || '#000000';
    const letterColor = leaderLetterColors[option.text] || '#ffffff';

    return (
      <span
        style={{
          backgroundColor: color,
          color: letterColor,
          padding: '4px 8px',
          borderRadius: '12px',
          marginRight: '6px',
          fontSize: '0.75rem',
          whiteSpace: 'nowrap'
        }}
      >
        {option.text}
      </span>
    );
  };

  private _onRenderTopicTitle = (options: IDropdownOption[]): JSX.Element => {
    if (!options || options.length === 0) {
      return <span />;
    }
    const option = options[0];
    if (option.key === '') {
      return <span>{option.text}</span>;
    }

    const topicColors: { [key: string]: string } = {
      'Management': '#d4e7f6',
      'Campus': '#caf0cc',
      'Education': '#ffebc0',
      'Research': '#0078d4',
      'Innovation': '#4f6bed',
      'EDI': '#ca5010',
      'Mobility': '#498205',
      'Dissemination/Impact': '#a4262c',
      'Internationalisation': '#e5d2e3',
      'Structures': '#eaeaea'
    };
    const topicLetterColors: { [key: string]: string } = {
      'Management': '#007ace',
      'Campus': '#437406',
      'Education': '#d08b00',
      'Research': '#ffffff',
      'Innovation': '#ffffff',
      'EDI': '#ffffff',
      'Mobility': '#ffffff',
      'Dissemination/Impact': '#ffffff',
      'Internationalisation': '#864199',
      'Structures': '#000000'
    };

    const color = topicColors[option.text] || '#FFFFFF';
    const letterColor = topicLetterColors[option.text] || '#000000';

    return (
      <span
        style={{
          backgroundColor: color,
          color: letterColor,
          padding: '4px 8px',
          borderRadius: '12px',
          marginRight: '6px',
          fontSize: '0.75rem',
          whiteSpace: 'nowrap'
        }}
      >
        {option.text}
      </span>
    );
  };

  private _onRenderProjectTitle = (options: IDropdownOption[]): JSX.Element => {
    if (!options || options.length === 0) {
      return <span />;
    }
    const option = options[0];
    if (option.key === '') {
      return <span>{option.text}</span>;
    }

    const projectColors: { [key: string]: string } = {
      'Ulysseus1': '#d13438',
      'Ulysseus2': '#7252aa',
      'Compass': '#038387'
    };
    const color = projectColors[option.text] || '#666666';

    return (
      <span
        style={{
          backgroundColor: color,
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem'
        }}
      >
        {option.text}
      </span>
    );
  };

  private _onRenderLeaderTitle = (options: IDropdownOption[]): JSX.Element => {
    if (!options || options.length === 0) {
      return <span />;
    }
    const option = options[0];
    if (option.key === '') {
      return <span>{option.text}</span>;
    }

    const leaderColors: { [key: string]: string } = {
      'USE': '#a4262c', 
      'UniCA': '#80c6ff',
      'UniGE': '#004e8c',
      'TUKE': '#9e6c00',
      'MCI': '#ac539d',
      'HH': '#caf0cc',
      'UMS': '#498205',
      'UoM': '#ffebc0'
    };
    const leaderLetterColors: { [key: string]: string } = {
      'USE': '#ffffff', 
      'UniCA': '#004e8c',
      'UniGE': '#ffffff',
      'TUKE': '#ffffff',
      'MCI': '#ffffff',
      'HH': '#437406',
      'UMS': '#ffffff',
      'UoM': '#8f6200'
    };

    const color = leaderColors[option.text] || '#000000';
    const letterColor = leaderLetterColors[option.text] || '#ffffff';

    return (
      <span
        style={{
          backgroundColor: color,
          color: letterColor,
          padding: '4px 8px',
          borderRadius: '12px',
          marginRight: '6px',
          fontSize: '0.75rem',
          whiteSpace: 'nowrap'
        }}
      >
        {option.text}
      </span>
    );
  };

  private _performSearch = (): void => {
    const { searchQuery, selectedTopic, selectedProject, selectedLeader } = this.state;
    
    if (!searchQuery && !selectedTopic && !selectedProject && !selectedLeader) {
      this.setState({ items: [] });
      return;
    }

    const filters: string[] = [];

    if (searchQuery) {
      const searchableColumns = ['ID', 'Deliverable', 'Title', 'Topic', 'Leader', 'Project', 'Dissemination', 'Leader'];
      const queryFilters = searchableColumns.map(col => `substringof('${searchQuery}', ${col})`);
      const parsedQuery = parseInt(searchQuery, 10);
      if (!isNaN(parsedQuery)) {
        queryFilters.push(`Id eq ${parsedQuery}`);
      }
      filters.push(`(${queryFilters.join(' or ')})`);
    }

    if (selectedTopic) {
      filters.push(`substringof('${selectedTopic}', Topic)`);
    }
    if (selectedProject) {
      filters.push(`Project eq '${selectedProject}'`);
    }
    if (selectedLeader) {
      filters.push(`Leader eq '${selectedLeader}'`);
    }

    const filterQuery = filters.join(' and ');

    sp.web.lists.getByTitle('Deliverables').items
      .select("Id, Deliverable, Title, Leader, Project, Submitted, Dissemination, Topic, Leader")
      .filter(filterQuery)()
      .then((items: IDeliverableItem[]) => {
        this.setState({ items });
      })
      .catch((error: IDeliverableItem) => {
        console.error("Error fetching items: ", error);
      });
  }
  
  public render(): React.ReactElement<ISearchWebPartProps> {
    const topicOptions: IDropdownOption[] = [
      { key: '', text: 'Select Topic' },
      { key: 'Management', text: 'Management' },
      { key: 'Campus', text: 'Campus' },
      { key: 'Education', text: 'Education' },
      { key: 'Research', text: 'Research' },
      { key: 'EDI', text: 'EDI' },
      { key: 'Mobility', text: 'Mobility' },
      { key: 'Structures', text: 'Structures' },
      { key: 'Dissemination/Impact', text: 'Dissemination/Impact' },
      { key: 'Internationalisation', text: 'Internationalisation' }
    ];

    const projectOptions: IDropdownOption[] = [
      { key: '', text: 'Select Project' },
      { key: 'Ulysseus1', text: 'Ulysseus1' },
      { key: 'Ulysseus2', text: 'Ulysseus2' },
      { key: 'Compass', text: 'Compass' }
    ];

    const LeaderOptions: IDropdownOption[] = [
      { key: '', text: 'Select Leader' },
      { key: 'USE', text: 'USE' },
      { key: 'UniCA', text: 'UniCA' },
      { key: 'UniGE', text: 'UniGE' },
      { key: 'TUKE', text: 'TUKE' },
      { key: 'MCI', text: 'MCI' },
      { key: 'HH', text: 'HH' },
      { key: 'UMS', text: 'UMS' },
      { key: 'UoM', text: 'UoM' }
    ];

    return (
      <div className={styles.searchWebPart}>
        <SearchBox
          placeholder="Search..."
          onChange={(
            ev: React.ChangeEvent<HTMLInputElement>,
            newValue?: string
          ) => this._onSearchChange(newValue || "")}
        />

        <div className={styles.filters}>
          <div className={styles.filterItem}>
            <span className={styles.filterLabel}>Topic:</span>
            <Dropdown
              placeholder="Select Topic"
              options={topicOptions}
              onChange={this._onTopicChange}
              selectedKey={this.state.selectedTopic}
              onRenderOption={this._onRenderTopicOption}
              onRenderTitle={this._onRenderTopicTitle}
              styles={{
                dropdown: {
                  width: '170px'
                }
              }}
            />
          </div>
          <div className={styles.filterItem}>
            <span className={styles.filterLabel}>Project:</span>
            <Dropdown
              placeholder="Select Project"
              options={projectOptions}
              onChange={this._onProjectChange}
              selectedKey={this.state.selectedProject}
              onRenderOption={this._onRenderProjectOption}
              onRenderTitle={this._onRenderProjectTitle}
              styles={{
                dropdown: {
                  width: '170px'
                }
              }}
            />
          </div>
          <div className={styles.filterItem}>
            <span className={styles.filterLabel}>Leader:</span>
            <Dropdown
              placeholder="Select Leader"
              options={LeaderOptions}
              onChange={this._onLeaderChange}
              selectedKey={this.state.selectedLeader}
              onRenderOption={this._onRenderLeaderOption}
              onRenderTitle={this._onRenderLeaderTitle}
              styles={{
                dropdown: {
                  width: '170px'
                }
              }}
            />
          </div>
        </div>

        <div className={styles.results}>
          <ListView
            items={this.state.items}
            viewFields={this.viewFields}
            compact={true}
          />
        </div>
      </div>
    );
  }
}
