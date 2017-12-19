class TrackerPage
  include Capybara::DSL

  @@number_of_airmen = 3
  @@expected_columns = %w(NAME, QUALIFICATIONS, CERTIFICATION)
  
  def has_a_roster?
    within_table('Roster') do
      @@expected_columns.each {|column_name| page.has_text?(column_name)}
    end
  end

  def has_airmen_in_roster?
    within_table('Roster') do
      page.has_selector?('td', count: @@number_of_airmen * @@expected_columns.count)
    end
  end

  def has_unit?(unit)
    case unit
    when 'All Units'
      has_airmen_in_roster?
    when unit
      did_filter_roster = false
      within_table('Roster') do
        did_filter_roster = page.find_all('tbody tr').count < @@number_of_airmen
      end

      did_filter_planner = false
      within_table('Planner') do
        did_filter_planner = page.find_all('tbody tr').count < @@number_of_airmen
      end

      return did_filter_roster && did_filter_planner
    end
  end

  def filter_by(unit: 'All Units')
    page.find(:select).find(:option, text: unit).select_option
  end

  def click_on_airman(name)
    page.find(:xpath,"//*[text()='#{name}']").click
  end

  def has_currency?
    within '.side-panel' do
      page.has_content?('Currency')
      page.has_content?('MMS')
      page.has_content?('25 JAN 18')
      page.has_content?('Laser Vision')
      page.has_content?('18 Apr 18')
      page.has_content?('LastName1, FirstName1')
    end
  end

  def has_planner?
    within_table('Planner') do
      page.has_content?('SUN')
      page.has_content?('MON')
      page.has_content?('TUE')
      page.has_content?('WED')
      page.has_content?('THU')
      page.has_content?('FRI')
      page.has_content?('SAT')
      page.has_selector?('tbody tr', count: @@number_of_airmen)
    end
  end
end