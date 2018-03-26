///<reference path="site/repositories/web/WebSiteRepository.ts"/>
import { EventRepository } from './event/repositories/EventRepository';
import { MissionRepository } from './mission/repositories/MissionRepository';
import { AirmanRepository } from './airman/repositories/AirmanRepository';
import SkillRepository from './skills/repositories/SkillRepository';
import { SiteRepository } from './site/repositories/SiteRepository';
import { RipItemRepository } from './airman/repositories/AirmanRipItemRepository';
import { WebAirmanRepository } from './airman/repositories/web/WebAirmanRepository';
import { HTTPClient } from './HTTPClient';
import { WebSiteRepository } from './site/repositories/web/WebSiteRepository';
import { WebSkillRepository } from './skills/repositories/web/WebSkillRepository';
import { WebEventRepository } from './event/repositories/web/WebEventRepository';
import { WebMissionRepository } from './mission/repositories/web/WebMissionRepository';
import { WebRipItemRepository } from './airman/repositories/web/WebAirmanRipItemRepository';
import SkillRepositoryStub from './skills/repositories/doubles/SkillRepositoryStub';
import { FakeAirmanRepository } from './airman/repositories/doubles/FakeAirmanRepository';
import { EventRepositoryStub } from './event/repositories/doubles/EventRepositoryStub';
import { MissionRepositoryStub } from './mission/repositories/doubles/MissionRepositoryStub';
import { SiteRepositoryStub } from './site/repositories/doubles/SiteRepositoryStub';
import { RipItemRepositoryStub } from './airman/repositories/doubles/AirmanRipItemRepositoryStub';
import { CrewRepository } from './crew/repositories/CrewRepository';
import { WebCrewRepository } from './crew/repositories/web/WebCrewRepository';
import { CrewRepositorySpy } from './crew/repositories/doubles/CrewRepositorySpy';
import ProfileRepository from './profile/repositories/ProfileRepository';
import { WebProfileRepository } from './profile/repositories/web/WebProfileRepository';
import { ProfileRepositoryStub } from './profile/repositories/doubles/ProfileRepositoryStub';

export interface Repositories {
  airmanRepository: AirmanRepository;
  siteRepository: SiteRepository;
  skillRepository: SkillRepository;
  eventRepository: EventRepository;
  missionRepository: MissionRepository;
  ripItemRepository: RipItemRepository;
  crewRepository: CrewRepository;
  profileRepository: ProfileRepository;
}

const client = new HTTPClient();

export const WebRepositories: Repositories = Object.freeze({
  airmanRepository: new WebAirmanRepository(client),
  siteRepository: new WebSiteRepository(client),
  skillRepository: new WebSkillRepository(client),
  eventRepository: new WebEventRepository(client),
  missionRepository: new WebMissionRepository(client),
  ripItemRepository: new WebRipItemRepository(client),
  crewRepository: new WebCrewRepository(client),
  profileRepository: new WebProfileRepository(client),
});

export const DoubleRepositories: Repositories = Object.freeze({
  airmanRepository: new FakeAirmanRepository(),
  siteRepository: new SiteRepositoryStub(),
  skillRepository: new SkillRepositoryStub(),
  eventRepository: new EventRepositoryStub(),
  missionRepository: new MissionRepositoryStub(),
  ripItemRepository: new RipItemRepositoryStub(),
  crewRepository: new CrewRepositorySpy(),
  profileRepository: new ProfileRepositoryStub()
});