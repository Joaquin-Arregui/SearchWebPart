export interface IDeliverableItem {
        Id?: number;
        Deliverable?: string;
        Title?: string;
        Leader?: string;
        Project?: string;
        Submitted?: boolean;
        Dissemination?: string;
        Topic?: string;
        
        // This allows dynamic keys (e.g., "Topic.1", "Topic.2", etc.),
        // but avoids using 'any' (uses string | number | boolean | undefined).
        [key: string]: string | number | boolean | undefined;
    }