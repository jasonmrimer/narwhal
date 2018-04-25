require_relative './pages/login_page'
require_relative './pages/flights_page'

describe 'Flights page', type: :feature do
  let(:flights_page) {
    login_page = LoginPage.new
    login_page.login
    FlightsPage.new
  }

  it 'shows the Flights page' do
    flights_page.assert_shows_airmen
  end

  it 'shows an Airman profile details' do
    flights_page.assert_shows_airman_profile
  end

  it 'can edit the Airman first and last name' do
    flights_page.assert_edit_airman_profile
  end

end