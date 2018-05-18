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
    flights_page.assert_shows_airman
  end

  it 'can edit an Airman profile' do
    flights_page.assert_edit_airman
  end

  it 'create and delete an airman profile' do
    flights_page.assert_create_and_delete_airman
  end

  it 'shows certifications for that site' do
    flights_page.assert_shows_certifications
  end

  # FIXME : this refuses to work in chrome headless
  xit 'create a new certification' do
    flights_page.assert_create_certification
  end

  it 'can edit the acronym of a certification' do
    flights_page.assert_edit_certification
  end
end