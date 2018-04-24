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

  it 'show an Airman profile details' do
    flights_page.assert_shows_airman_profile
  end

end