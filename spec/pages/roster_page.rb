class RosterPage
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
      page.find_all('tbody tr').count < @@number_of_airmen
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
end