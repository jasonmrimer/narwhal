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

  it 'can filter the Roster by squadron' do
    tracker_page.assert_filters_by_squadron
  end
  
  it 'filtering by squadron populates the flight options' do
    tracker_page.assert_populate_flights
  end

  it 'can filter the Roster by flight' do
    tracker_page.assert_filters_by_flight
  end

  it "shows an airman's currency in the sidebar" do
    tracker_page.assert_shows_currency
  end

  it 'can filter the Roster by certification' do
    tracker_page.assert_filters_by_certification
  end

  it "shows an airman's availability in the sidebar" do
    tracker_page.assert_shows_availability
  end

  it "creates, views, deletes an event for a selected airman" do
    tracker_page.assert_can_create_and_view_and_delete_event
  end
end
