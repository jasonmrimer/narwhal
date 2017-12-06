require_relative './pages/roster_page'

describe 'roster', type: :feature do
  it 'shows a Roster' do
    roster_page = RosterPage.new
    expect(roster_page).to have_a_roster
    expect(roster_page).to have_airmen_in_roster
  end
end
