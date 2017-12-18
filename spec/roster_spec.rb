require_relative './pages/login_page'

describe 'roster', type: :feature do
  it 'shows a Roster' do
    login_page = LoginPage.new
    roster_page = login_page.login
    expect(roster_page).to have_a_roster
    expect(roster_page).to have_airmen_in_roster
  end

  it 'can filter a Roster by unit' do
    login_page = LoginPage.new
    roster_page = login_page.login
    expect(roster_page).to have_unit('All Units')
    roster_page.filter_by(unit: '30 IS')
    expect(roster_page).to have_unit('30 IS')
  end

  it "shows an airman's currency in the sidebar" do
    login_page = LoginPage.new
    roster_page = login_page.login
    roster_page.click_on_airman('LastName1')
    expect(roster_page).to have_currency
  end
end
