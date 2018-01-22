require 'date'

class TrackerPage
  include Capybara::DSL
  include RSpec::Matchers

  @@expected_columns = %w(NAME QUALIFICATION CERTIFICATION SUN MON TUE WED THU FRI SAT)
  @@expected_availability_days = %w(SUN MON TUE WED THU FRI SAT)
  @@expected_flights = ['SUPER FLIGHT']

  def initialize
    page.driver.browser.manage.window.resize_to(4096, 4096)
    expect(page).to have_content('All Squadrons')
    @@all_airmen = page.find_all('tbody tr').count
    @event_start = Time.now.utc
    @event_end = @event_start + 3600
    @event_title = "Test Dentist #{Time.now}"
  end

  def assert_shows_tracker
    has_a_roster
    has_airmen_in_roster
    has_no_side_panel
  end

  def assert_filters_by_site
    expect(page).to have_content('All Sites')
    filter_by_site('DGS-1')
    has_filter('DGS-1')
  end

  def assert_filters_by_squadron
    filter_by_site('DGS-1')
    expect(page).to have_content('All Squadron')
    filter_by_squadron('30 IS')
    has_filter('30 IS')
  end

  def assert_filters_by_flight
    filter_by_site('DGS-1')
    filter_by_squadron('30 IS')
    expect(page).to have_content('All Flights')
    filter_by_flight('SUPER FLIGHT')
    has_filter('SUPER FLIGHT')
  end

  def assert_filters_by_certification
    has_filter('Filter Certifications')
    filter_by_certification('Super Speed')
    has_filter('Super Speed')
  end

  def assert_shows_availability
    click_on_airman('LastName1')
    has_availability
    can_forward_to_next_week
  end

  def assert_shows_currency
    click_on_airman('LastName1')
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
    end
    has_currency
  end

  def assert_can_create_and_view_and_delete_event
    click_on_airman('LastName2')

    page.within('.side-panel') do
      click_link_or_button '+ Add Event'
      fill_in 'title', with: @event_title
      fill_in 'startDate', with: @event_start.strftime('%m/%d/%Y')
      fill_in 'startTime', with: @event_start.strftime('%H:%M')
      fill_in 'endDate', with: @event_end.strftime('%m/%d/%Y')
      fill_in 'endTime', with: @event_end.strftime('%H:%M')
      find('input[type="submit"]').click
    end

    expect(has_event).to be_truthy

    find('button.close').click

    has_highlevel_availability

    click_on_airman('LastName2')
    page.find('.event-title', text: @event_title).find('button.delete').click

    expect(has_event).to be_falsey

    find('button.close').click
  end

  private

  def has_a_roster
    @@expected_columns.each {|column_name| expect(page).to have_content(column_name) }
  end

  def has_no_side_panel
    expect(page).not_to have_selector('.side-panel')
  end

  def has_airmen_in_roster
    expect(page).to have_css('tbody tr', count: @@all_airmen)
  end

  def has_filter_options(options = [])
    options.each do |option_text|
      expect(page).to have_css('option', text: option_text)
    end
  end

  def has_event
    page.within('.side-panel') do
      page.has_content?(@event_start.strftime('%d %^b %y')) &&
      page.has_content?(@event_title) &&
      page.has_content?(@event_start.strftime('%H%MZ') + ' - ' + @event_end.strftime('%H%MZ'))
    end
  end

  def has_filter(filter)
    case filter
    when 'All Sites'
      return has_airmen_in_roster
    when 'All Squadrons'
      @@all_airmen_in_site = page.find_all('tbody tr').count
      return expect(page).to have_css('tbody tr', maximum: @@all_airmen - 1)
    when 'All Flights'
      @@all_airmen_in_squadron = page.find_all('tbody tr').count
      return expect(page).to have_css('tbody tr', maximum: @@all_airmen - 1)
    default
      expect(page).to have_css('tbody tr', maximum: @@all_airmen - 1)
    end
  end

  def filter_by_site(site)
    page.find("#site-filter").find(:option, text: site).select_option
  end

  def filter_by_squadron(squadron)
    page.find("#squadron-filter").find(:option, text: squadron).select_option
  end

  def filter_by_flight(flight)
    page.find("#flight-filter").find(:option, text: flight).select_option
  end

  def filter_by_certification(cert)
    page.within('table') do
      find('#certification-filter').send_keys('Super Speed')
      find('#certification-filter').send_keys(:enter)
    end
  end

  def click_on_airman(name)
    page.find(:xpath,"//*[text()='#{name}']").click
  end

  def has_currency
    page.within('.side-panel') do
      expect(page).to have_content('LastName1, FirstName1')
      expect(page).to have_content('CURRENCY')
      expect(page).to have_content('MMS')
      expect(page).to have_content('25 Jan 18')
      expect(page).to have_content('Laser Vision')
      expect(page).to have_content('18 Jan 18')
    end
  end

  def has_availability
    page.within('.side-panel') do
      expect(page).to have_content('LastName1, FirstName1')
      expect(page).to have_content('AVAILABILITY')
      @@expected_availability_days.each {|day_name| expect(page).to have_content(day_name)}
    end
  end

  def can_forward_to_next_week
    page.within('.side-panel') do
      find('button.next-week').click
      now = Date.today
      nextweek = now + (now.wday + 6)
      startofnextweek = nextweek - nextweek.wday
      expect(page).to have_content(startofnextweek.strftime('%d %^b'))
    end
  end

  def has_highlevel_availability
    second_row = page.all('tbody tr')[1]
    expect(second_row).to have_content('LastName2')

    page.within(second_row) do
      expect(page).to have_selector('span', :text => '', count: 7)
      expect(page).to have_css('span.unavailable', minimum: 1)
      expect(page).to have_css('span.available', maximum: 6)
    end
  end
end