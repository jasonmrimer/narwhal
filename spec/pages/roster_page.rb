class RosterPage
  include Capybara::DSL

  @@number_of_airmen = 3
  @@expected_columns = %w(NAME, QUALIFICATIONS)
  
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
end