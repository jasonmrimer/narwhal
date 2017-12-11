require_relative './pages/roster_page'

describe 'roster', type: :feature do
  it 'shows a Roster' do
    roster_page = RosterPage.new
    expect(roster_page).to have_a_roster
    expect(roster_page).to have_airmen_in_roster
  end

  it 'can filter a Roster by unit' do
    roster_page = RosterPage.new
    expect(roster_page).to have_unit('All Units')
    roster_page.filter_by(unit: '30 IS')
    expect(roster_page).to have_unit('30 IS')
  end
end
