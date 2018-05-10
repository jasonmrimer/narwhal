import { AbilityBuilder } from '@casl/ability';

export const readerAbility = AbilityBuilder.define((can: any, cannot: any) => {
  can('error', 'all');
  cannot('read', ['mission', 'flight']);
  cannot('write', 'skill');
});

export const writerAbility = AbilityBuilder.define((can: any, cannot: any) => {
  can(['manage', 'write'], 'all');
});

export const adminAbility = AbilityBuilder.define((can: any, cannot: any) => {
  can(['manage', 'write'], 'all');
});
