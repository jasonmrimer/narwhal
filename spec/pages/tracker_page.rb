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
  end

  def assert_shows_tracker
    has_a_roster
    has_airmen_in_roster
    has_no_side_panel
  end

  def assert_filters_by_squadron
    expect(page).to have_content('All Squadron')
    filter_by_squadron('30 IS')
    has_filter('30 IS')
  end

  def assert_populate_flights
    filter_by_squadron('30 IS')
    has_filter_options(@@expected_flights)
  end

  def assert_filters_by_flight
    filter_by_squadron('30 IS')
    has_filter('All Flights')
    filter_by_flight('SUPER FLIGHT')
    has_filter('SUPER FLIGHT')
  end

  def assert_shows_availability
    click_on_airman('LastName1')
    has_availability
  end

  def assert_shows_currency
    click_on_airman('LastName1')
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
    end
    has_currency
  end

  def assert_filters_by_certification
    has_filter('Filter Certifications')
    filter_by_certification('Super Speed')
    has_filter('Super Speed')
  end

  def assert_show_events
    click_on_airman('LastName2')
    page.within('.side-panel') do
      expect(page).to have_content('10 JAN 18')
      expect(page).to have_content('Sleep')
      expect(page).to have_content('1232Z - 1632Z')
    end
  end

  def assert_shows_highlevel_availability
    firstRow = page.first('tbody tr')
    expect(firstRow).to have_content('LastName1')

    page.within(firstRow) do
      expect(page).to have_selector('span', :text => '', count: 7)
      expect(page).to have_css('span.unavailable', count: 1)
      expect(page).to have_css('span.available', count: 6)
    end
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

  def has_filter(filter)
    case filter
    when 'All Squadrons'
      return has_airmen_in_roster
    when 'All Flights'
      @@all_airmen_in_squadron = page.find_all('tbody tr').count
      return expect(page).to have_css('tbody tr', maximum: @@all_airmen - 1)
    default
      expect(page).to have_css('tbody tr', maximum: @@all_airmen_in_squadron - 1)
    end
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
      expect(page).to have_content('No Events Scheduled', count: 6)
      expect(page).to have_content('dentist', count: 1)
      @@expected_availability_days.each {|day_name| expect(page).to have_content(day_name)}
    end
  end
end