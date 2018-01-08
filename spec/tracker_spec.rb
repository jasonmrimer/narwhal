require_relative './pages/login_page'

describe 'Tracker page', type: :feature do
  let(:tracker_page) {
    login_page = LoginPage.new
    login_page.login
    tracker_page = TrackerPage.new
  }

  it 'shows a Tracker' do
    tracker_page.assert_shows_tracker
  end

  it 'can filter the Roster by unit' do
    tracker_page.assert_filters_by_unit
  end
  
  it "shows an airman's availability in the sidebar" do
    tracker_page.assert_shows_availability
  end

  it 'can filter the Roster by flight' do
    tracker_page.assert_filters_by_flight
  end

  it "shows an airman's currency in the sidebar" do
    tracker_page.assert_shows_currency
  end
end
