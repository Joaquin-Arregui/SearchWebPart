import { IDeliverableItem } from '../models/IDeliverableItem';

export interface ISearchWebPartState {
  searchQuery: string;
  items: IDeliverableItem[];
  selectedTopic: string;
  selectedProject: string;
  selectedLeader: string;
}
