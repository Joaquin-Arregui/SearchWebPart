export interface IDeliverableItem {
        Id?: number;
        Deliverable?: string;
        Title?: string;
        Leader?: string;
        Project?: string;
        Submitted?: boolean;
        Dissemination?: string;
        Topic?: string;
        [key: string]: string | number | boolean | undefined;
    }