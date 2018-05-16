///<reference path="../site/repositories/web/WebSiteRepository.ts"/>
///<reference path="../schedule/repositories/web/WebScheduleRepository.ts"/>
import { HTTPClient } from './HTTPClient';
import { EventRepository } from '../event/repositories/EventRepository';
import { MissionRepository } from '../mission/repositories/MissionRepository';
import { AirmanRepository } from '../airman/repositories/AirmanRepository';
import { QualificationRepository } from '../skills/qualifications/repositories/QualificationRepository';
import { SiteRepository } from '../site/repositories/SiteRepository';
import { RipItemRepository } from '../airman/repositories/AirmanRipItemRepository';
import { WebAirmanRepository } from '../airman/repositories/web/WebAirmanRepository';
import { WebSiteRepository } from '../site/repositories/web/WebSiteRepository';
import { WebQualificationRepository } from '../skills/qualifications/repositories/web/WebQualificationRepository';
import { WebEventRepository } from '../event/repositories/web/WebEventRepository';
import { WebMissionRepository } from '../mission/repositories/web/WebMissionRepository';
import { WebRipItemRepository } from '../airman/repositories/web/WebAirmanRipItemRepository';
import { QualificationRepositoryStub } from '../skills/qualifications/repositories/doubles/QualificationRepositoryStub';
import { FakeAirmanRepository } from '../airman/repositories/doubles/FakeAirmanRepository';
import { FakeEventRepository } from '../event/repositories/doubles/FakeEventRepository';
import { MissionRepositoryStub } from '../mission/repositories/doubles/MissionRepositoryStub';
import { SiteRepositoryStub } from '../site/repositories/doubles/SiteRepositoryStub';
import { RipItemRepositoryStub } from '../airman/repositories/doubles/AirmanRipItemRepositoryStub';
import { CrewRepository } from '../crew/repositories/CrewRepository';
import { WebCrewRepository } from '../crew/repositories/web/WebCrewRepository';
import { CrewRepositorySpy } from '../crew/repositories/doubles/CrewRepositorySpy';
import { ProfileRepository } from '../profile/repositories/ProfileRepository';
import { WebProfileRepository } from '../profile/repositories/web/WebProfileRepository';
import { ProfileRepositoryStub } from '../profile/repositories/doubles/ProfileRepositoryStub';
import { CrewPositionRepository } from '../crew/repositories/CrewPositionRepository';
import { WebCrewPositionRepository } from '../crew/repositories/web/WebCrewPositionRepository';
import { CrewPositionRepositorySpy } from '../crew/repositories/doubles/CrewPositionRepositorySpy';
import { ScheduleRepository } from '../schedule/repositories/ScheduleRepository';
import { WebScheduleRepository } from '../schedule/repositories/web/WebScheduleRepository';
import { ScheduleRepositoryStub } from '../schedule/repositories/doubles/ScheduleRepositoryStub';
import { RankRepository } from '../rank/repositories/RankRepository';
import { WebRankRepository } from '../rank/repositories/web/WebRankRepository';
import { RankRepositoryStub } from '../rank/repositories/doubles/RankRepositoryStub';
import { CertificationRepository } from '../skills/certification/repositories/CertificationRepository';
import { WebCertificationRepository } from '../skills/certification/repositories/web/WebCertificationRepository';
import { CertificationRepositoryStub } from '../skills/certification/repositories/doubles/CertificationRepositoryStub';

export interface Repositories {
  airmanRepository: AirmanRepository;
  siteRepository: SiteRepository;
  qualificationRepository: QualificationRepository;
  certificationRepository: CertificationRepository;
  eventRepository: EventRepository;
  missionRepository: MissionRepository;
  ripItemRepository: RipItemRepository;
  crewRepository: CrewRepository;
  crewPositionRepository: CrewPositionRepository;
  profileRepository: ProfileRepository;
  scheduleRepository: ScheduleRepository;
  rankRepository: RankRepository;
}

const client = new HTTPClient();

export const WebRepositories: Repositories = Object.freeze({
  airmanRepository: new WebAirmanRepository(client),
  siteRepository: new WebSiteRepository(client),
  qualificationRepository: new WebQualificationRepository(client),
  certificationRepository: new WebCertificationRepository(client),
  eventRepository: new WebEventRepository(client),
  missionRepository: new WebMissionRepository(client),
  ripItemRepository: new WebRipItemRepository(client),
  crewRepository: new WebCrewRepository(client),
  crewPositionRepository: new WebCrewPositionRepository(client),
  profileRepository: new WebProfileRepository(client),
  scheduleRepository: new WebScheduleRepository(client),
  rankRepository: new WebRankRepository(client)
});

export const DoubleRepositories: Repositories = {
  airmanRepository: new FakeAirmanRepository(),
  siteRepository: new SiteRepositoryStub(),
  qualificationRepository: new QualificationRepositoryStub(),
  certificationRepository: new CertificationRepositoryStub(),
  eventRepository: new FakeEventRepository(),
  missionRepository: new MissionRepositoryStub(),
  ripItemRepository: new RipItemRepositoryStub(),
  crewRepository: new CrewRepositorySpy(),
  crewPositionRepository: new CrewPositionRepositorySpy(),
  profileRepository: new ProfileRepositoryStub(),
  scheduleRepository: new ScheduleRepositoryStub(),
  rankRepository: new RankRepositoryStub()
};