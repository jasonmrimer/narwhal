require_relative './pages/login_page'

describe 'Tracker page', type: :feature do
  let(:tracker_page) {
    login_page = LoginPage.new
    login_page.login
    tracker_page = TrackerPage.new
  }

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

    it 'can filter the Roster by Shift' do
      tracker_page.assert_filters_by_shift
    end

    it 'can filter the Roster by Last Name' do
      tracker_page.assert_filters_by_last_name
    end

    it 'can filter the Roster by certification' do
      tracker_page.assert_filters_by_certification
    end

    it 'can filter the Roster by qualification' do
      tracker_page.assert_filters_by_qualification
    end
  end

  describe 'events' do
    it 'validates an event title, start date, and end date' do
      tracker_page.assert_create_event_validation
    end

    it 'can create, update, and delete an event for a selected airman' do
      tracker_page.assert_create_update_delete_event
    end
  end

  describe 'skill' do
    it 'can view RIP items' do
      tracker_page.assert_view_RIP
    end

    it 'can delete, create and update a qualification' do
      tracker_page.assert_delete_create_update_qualification
    end

    it 'can delete, create and update a certification' do
      tracker_page.assert_delete_create_update_certification
    end

    it 'validates a skill type, name, start date, and end date' do
      tracker_page.assert_create_skill_validation
    end
  end

  describe 'roster' do
    it 'can move forward weeks on the planner' do
      tracker_page.assert_navigates_week
    end
  end

  describe 'crew creation' do
    it 'can add airmen to a mission and then view a created crew' do
      tracker_page.assert_create_and_view_crew
    end

    it 'can return to the tracker with previously selected filters' do
      tracker_page.assert_return_to_tracker
    end
  end
end
