require 'date'

class TrackerPage
  include Capybara::DSL
  include RSpec::Matchers

  @@expected_columns = %w(NAME QUALIFICATION CERTIFICATION SUN MON TUE WED THU FRI SAT).freeze
  @@expected_availability_days = %w(SUN MON TUE WED THU FRI SAT).freeze
  @@expected_flights = ['SUPER FLIGHT'].freeze

  def initialize
    page.driver.browser.manage.window.resize_to(4096, 4096)

    expect(page).to have_content('All Sites')

    @@all_airmen_count = page.find_all('tbody tr').count
  end

  def assert_shows_tracker
    @@expected_columns.each {|column_name| expect(page).to have_content(column_name) }
    expect(page).not_to have_selector('.side-panel')
    expect(page).to have_css('tbody tr', count: @@all_airmen_count)
  end

  def assert_filters_by_site
    expect(page).to have_content('All Sites')
    filter('site', 'DGS-1')
    expect(page).to have_css('tbody tr', maximum: @@all_airmen_count - 1)
  end

  def assert_filters_by_squadron
    filter('site', 'DGS-1')
    site_count = page.find_all('tbody tr').count

    expect(page).to have_content('All Squadron')
    filter('squadron', '30 IS')
    expect(page).to have_css('tbody tr', maximum: site_count - 1)
  end

  def assert_filters_by_flight
    filter('site', 'DGS-1')
    filter('squadron', '30 IS')
    squadron_count = page.find_all('tbody tr').count

    expect(page).to have_content('All Flights')
    filter('flight', 'SUPER FLIGHT')
    expect(page).to have_css('tbody tr', maximum: squadron_count - 1)
  end

  def assert_filters_by_certification
    expect(page).to have_content('Filter Certifications')
    multi_filter('certification', 'Super Speed')
    expect(page).to have_css('tbody tr', maximum: @@all_airmen_count - 1)
  end

  def assert_shows_availability
    click_on_airman('LastName1')
    page.within('.side-panel') do
      expect(page).to have_content('AVAILABILITY')
      expect(page).to have_content('LastName1, FirstName1')
      @@expected_availability_days.each {|day_name| expect(page).to have_content(day_name)}
    end
    can_forward_to_next_week
  end

  def assert_shows_currency
    click_on_airman('LastName1')
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      expect(page).to have_content('CURRENCY')
      expect(page).to have_content('LastName1, FirstName1')
      expect(page).to have_content('MMS')
      expect(page).to have_content('25 Jan 18')
      expect(page).to have_content('Laser Vision')
      expect(page).to have_content('18 Jan 18')
    end
  end

  def assert_can_create_and_view_and_delete_event
    click_on_airman('LastName2')
    
    event = Event.new

    event.create
    expect(event).to exist
  
    event.delete
    expect(event).not_to exist
  end

  private

  def click_on_airman(name)
    page.find(:xpath,"//*[text()='#{name}']").click
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

  def has_event(event)
    page.within('.side-panel') do
      page.has_content?(event.start.strftime('%d %^b %y')) &&
      page.has_content?(event.title) &&
      page.has_content?(event.start.strftime('%H%MZ') + ' - ' + event.end.strftime('%H%MZ'))
    end
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
      now = Date.today
      next_week = now + (now.wday + 6)
      start_of_next_week = next_week - next_week.wday
      expect(page).to have_content(start_of_next_week.strftime('%d %^b'))
    end
  end
end

class Event
  include Capybara::DSL
  attr_accessor :start, :end, :title

  def initialize()
    @start = Time.now.utc
    @end = @start + 3600
    @title = "Test Event #{Time.now}"
  end

  def create
    page.within('.side-panel') do
      click_link_or_button '+ Add Event'
      fill_in 'title', with: @title
      fill_in 'startDate', with: @start.strftime('%m/%d/%Y')
      fill_in 'startTime', with: @start.strftime('%H:%M')
      fill_in 'endDate', with: @end.strftime('%m/%d/%Y')
      fill_in 'endTime', with: @end.strftime('%H:%M')
      find('input[type="submit"]').click
    end
  end

  def delete
    page.find('.event-title', text: @title).find('button.delete').click
  end

  def exists?
    page.within('.side-panel') do
      page.has_content?(@start.strftime('%d %^b %y')) &&
      page.has_content?(@title) &&
      page.has_content?(@start.strftime('%H%MZ') + ' - ' + @end.strftime('%H%MZ'))
    end
  end
end