require_relative './pages/login_page'

describe 'Tracker page', type: :feature do
  let(:roster_page) {
    login_page = LoginPage.new
    roster_page = login_page.login
  }

  it 'shows a Roster' do
    expect(roster_page).to have_a_roster
    expect(roster_page).to have_airmen_in_roster
  end

  it 'can filter the Roster by unit' do
    expect(roster_page).to have_unit('All Units')
    roster_page.filter_by(unit: '30 IS')
    expect(roster_page).to have_unit('30 IS')
  end

  it "shows an airman's currency in the sidebar" do
    roster_page.click_on_airman('LastName1')
    expect(roster_page).to have_currency
  end
end
