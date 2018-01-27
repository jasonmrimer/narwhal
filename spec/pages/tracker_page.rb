require 'date'
require_relative '../features/events'

class TrackerPage
  include Capybara::DSL
  include RSpec::Matchers

  @@expected_columns = %w(NAME QUALIFICATION CERTIFICATION SUN MON TUE WED THU FRI SAT).freeze
  @@expected_availability_days = %w(SUN MON TUE WED THU FRI SAT).freeze
  @@expected_flights = ['DOA', 'DOM', 'DOP'].freeze

  def initialize
    page.driver.browser.manage.window.resize_to(4096, 4096)

    expect(page).to have_content('All Sites')

    @@all_airmen_count = page.find_all('tbody tr').count
  end

  def assert_shows_tracker
    @@expected_columns.each { |column_name| expect(page).to have_content(column_name) }
    expect(page).not_to have_selector('.side-panel')
    expect(page).to have_css('tbody tr', count: @@all_airmen_count)
  end

  def assert_advances_week
      find('button.next-week').click
      expect(page).to have_content(get_start_of_next_week.strftime('%d %^a'))
  end

  def assert_filters_by_site
    expect(page).to have_content('All Sites')
    filter('site', 'DGS-1')
    expect(page).to have_css('tbody tr', maximum: @@all_airmen_count - 1)
  end

  def assert_filters_by_squadron
    filter('site', 'DGS-1')
    site_count = page.find_all('tbody tr').count

    expect(page).to have_content('All Squadrons')
    filter('squadron', '30 IS')
    expect(page).to have_css('tbody tr', maximum: site_count - 1)
  end

  def assert_filters_by_flight
    filter('site', 'DGS-1')
    filter('squadron', '30 IS')
    squadron_count = page.find_all('tbody tr').count

    expect(page).to have_content('All Flights')
    filter('flight', 'DOA')
    expect(page).to have_css('tbody tr', maximum: squadron_count - 1)
  end

  def assert_filters_by_certification
    expect(page).to have_content('Filter Certifications')
    multi_filter('certification', 'Super Speed')
    expect(page).to have_css('tbody tr', maximum: @@all_airmen_count - 1)
  end

  def assert_shows_availability
    click_on_airman('Spaceman')
    page.within('.side-panel') do
      expect(page).to have_content('AVAILABILITY')
      expect(page).to have_content('Spaceman, Corey')
      @@expected_availability_days.each { |day_name| expect(page).to have_content(day_name) }
    end
    can_forward_to_next_week
  end

  def assert_shows_currency
    click_on_airman('Spaceman')
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      expect(page).to have_content('CURRENCY')
      expect(page).to have_content('Spaceman, Corey')
      expect(page).to have_content('QB')
      expect(page).to have_content('25 Jan 19')
      expect(page).to have_content('Laser Vision')
      expect(page).to have_content('25 Jan 19')
    end
  end

  def assert_create_update_delete_event
    click_on_airman('Keeter')

    event = Event.new
    
    event.create
    expect(event).to exist
    
    event.update
    expect(event).to exist
    
    event.delete
    expect(event).not_to exist
  end

  private

  def click_on_airman(name)
    page.find(:xpath, "//*[text()='#{name}']").click
  end

  def create_event(event)
    page.within('.side-panel') do
      click_link_or_button '+ Add Event'
      fill_in 'title', with: event.title
      fill_in 'startDate', with: event.start.strftime('%m/%d/%Y')
      fill_in 'startTime', with: event.start.strftime('%H:%M')
      fill_in 'endDate', with: event.end.strftime('%m/%d/%Y')
      fill_in 'endTime', with: event.end.strftime('%H:%M')
      find('input[type="submit"]').click
    end
  end

  def delete_event(event)
    page.find('.event-title', text: event.title).find('button.delete').click
  end

  def filter(item, value)
    page.find("##{item}-filter").find(:option, text: value).select_option
  end

  def multi_filter(item, value)
    page.within('table') do
      find("##{item}-filter").send_keys(value)
      find("##{item}-filter").send_keys(:enter)
    end
  end

  def can_forward_to_next_week
    page.within('.side-panel') do
      find('button.next-week').click
      expect(page).to have_content(get_start_of_next_week.strftime('%d %^b'))
    end
  end

  def get_start_of_next_week
    now = Date.today
    (now - now.wday) + 7
  end
end
