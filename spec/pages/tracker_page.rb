class TrackerPage
  include Capybara::DSL
  include RSpec::Matchers

  @@expected_columns = %w(NAME QUALIFICATION CERTIFICATION SUN MON TUE WED THU FRI SAT)
  @@expected_availability_days = %w(SUN MON TUE WED THU FRI SAT)
  
  def initialize
    page.driver.browser.manage.window.resize_to(4096, 4096)
    expect(page).to have_content("All Unit")
    @@all_airmen = page.find_all('tbody tr').count
  end

  def assert_shows_tracker
    has_a_roster
    has_airmen_in_roster
    has_no_side_panel
  end

  def assert_filters_by_unit
    has_filter('All Units')
    filter_by_unit(unit: '30 IS')
    has_filter('30 IS')
  end

  def assert_filters_by_crew
    has_filter('All Crew')
    filter_by_crew(crew: 'SUPER CREW')
    has_filter('SUPER CREW')
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

  private

  def has_a_roster
    @@expected_columns.each {|column_name| expect(page).to have_content(column_name) }
  end

  def has_no_side_panel
    expect(page).not_to have_selector('.side-panel')
  end

  def has_airmen_in_roster
    expect(page).to have_css('tbody tr', minimum: 1)
  end

  def has_filter(unit)
    case unit
    when 'All Units'
      has_airmen_in_roster
    when 'All Crew'
      has_airmen_in_roster
    when unit
      expect(page).to have_css('tbody tr', :maximum => @@all_airmen - 1)
    end
  end

  def filter_by_unit(unit: 'All Units')
    page.find("#unit-filter").find(:option, text: unit).select_option
  end

  def filter_by_crew(crew: 'All Crew')
    page.find("#crew-filter").find(:option, text: crew).select_option
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
      expect(page).to have_content('No Events Scheduled', count: 7)
      @@expected_availability_days.each {|day_name| expect(page).to have_content(day_name)}
    end
  end
end