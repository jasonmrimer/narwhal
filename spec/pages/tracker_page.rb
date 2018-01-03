class TrackerPage
  include Capybara::DSL
  include RSpec::Matchers

  @@expected_columns = %w(NAME QUALIFICATION CERTIFICATION SUN MON TUE WED THU FRI SAT)
  
  def initialize
    expect(page).to have_content("All Unit")
    @@all_airmen = page.find_all('tbody tr').count
  end

  def assert_shows_tracker
    has_a_roster
    has_airmen_in_roster
    has_no_side_panel
  end

  def assert_filters_by_unit
    has_unit('All Units')
    filter_by(unit: '30 IS')
    has_unit('30 IS')
  end

  def assert_shows_currency
    click_on_airman('LastName1')
    has_currency
  end

  private
  def has_a_roster
    @@expected_columns.each {|column_name| expect(page).to have_content(column_name) }
  end

  def has_no_side_panel
    # TODO fail test
    expect(page).to have_selector('.side-panel')
  end

  def has_airmen_in_roster
    expect(page).to have_css('tbody tr', minimum: 1)
  end

  def has_unit(unit)
    case unit
    when 'All Units'
      has_airmen_in_roster
    when unit
      expect(page).to have_css('tbody tr', :maximum => @@all_airmen - 1)
    end
  end

  def filter_by(unit: 'All Units')
    page.find(:select).find(:option, text: unit).select_option
  end

  def click_on_airman(name)
    page.find(:xpath,"//*[text()='#{name}']").click
  end

  def has_currency
    within '.side-panel' do
      expect(page).to have_content('Currency')
      expect(page).to have_content('MMS')
      expect(page).to have_content('25 Jan 18')
      expect(page).to have_content('Laser Vision')
      expect(page).to have_content('18 Apr 18')
      expect(page).to have_content('LastName1, FirstName1')
    end
  end
end