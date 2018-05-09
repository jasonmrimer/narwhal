import { AbilityBuilder } from '@casl/ability';

export const readerAbility = AbilityBuilder.define((can: any, cannot: any) => {
  can('error', 'all');
  cannot('read', ['mission', 'flight']);
});

export const adminAbility = AbilityBuilder.define((can: any, cannot: any) => {
  can('manage', 'all');
});

export const writerAbility = AbilityBuilder.define((can: any, cannot: any) => {
  can('manage', 'all');
});