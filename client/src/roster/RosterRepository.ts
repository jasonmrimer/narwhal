import RosterModel from './RosterModel';

interface RosterRepository {
    findOne(): Promise<RosterModel>;
}

export default RosterRepository;