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

  describe 'filtering' do
    it 'can filter the Roster by site' do
      tracker_page.assert_filters_by_site
    end

    it 'can filter the Roster by squadron' do
      tracker_page.assert_filters_by_squadron
    end
    
    it 'can filter the Roster by flight' do
      tracker_page.assert_filters_by_flight
    end

    it 'can filter the Roster by certification' do
      tracker_page.assert_filters_by_certification
    end
  end

  describe 'the side panel' do
    it "shows an airman's currency in the side panel" do
      tracker_page.assert_shows_currency
    end

    it "shows an airman's availability in the side panel" do
      tracker_page.assert_shows_availability
    end
  end

  describe 'events' do
    it 'can create, update, and delete an event for a selected airman' do
      tracker_page.assert_create_update_delete_event
    end
  end
end
