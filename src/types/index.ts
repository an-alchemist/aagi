import { ServiceType as CoreServiceType } from '@elizaos/core';

// Extend the core ServiceType enum
export enum ExtendedServiceType {
    SCHEDULED_TWITTER = 'SCHEDULED_TWITTER'
}

// Combine both types
export type ServiceType = CoreServiceType | ExtendedServiceType;