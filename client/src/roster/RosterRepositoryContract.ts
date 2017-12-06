import RosterRepository from './RosterRepository';

export default function rosterRepositoryContract(subject: RosterRepository) {
    describe('findOne', () => {
        it('returns a roster', async () => {
            const roster = await subject.findOne();
            expect(roster).toBeDefined();
        });
    });
}
