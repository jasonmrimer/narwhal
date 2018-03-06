require 'date'
require_relative '../features/events'
require_relative '../features/skills'
require_relative '../features/msn_assignment'
require_relative './crew_page'

class TrackerPage
  include Capybara::DSL
  include RSpec::Matchers

  @@expected_columns = %w(NAME QUALIFICATION CERTIFICATION SUN MON TUE WED THU FRI SAT).freeze
  @@expected_availability_days = %w(SUN MON TUE WED THU FRI SAT).freeze
  @@expected_flights = %w(DOA DOM DOP).freeze

  def initialize
    expect(page).to have_content('All Sites')

    @@all_airmen_count = page.find_all('tbody tr').count
  end

  def assert_navigates_week
    click(page.find('button.next-week'))
    expect(page).to have_content(get_start_of_next_week.strftime('%d %^a'))
    click(page.find('button.last-week'))
    click(page.find('button.last-week'))
    expect(page).to have_content(get_start_of_last_week.strftime('%d %^a'))
  end

  def assert_filters_by_site
    expect(page).to have_content('All Sites')
    filter('site', 'DMS-MD')
    expect(page).to have_css('tbody tr', maximum: @@all_airmen_count)
  end

  def assert_filters_by_squadron
    filter('site', 'DMS-MD')
    site_count = page.find_all('tbody tr').count

    expect(page).to have_content('All Squadrons')
    filter('squadron', '94 IS')
    expect(page).to have_css('tbody tr', maximum: site_count)
  end

  def assert_filters_by_flight
    filter('site', 'DMS-MD')
    filter('squadron', '94 IS')
    squadron_count = page.find_all('tbody tr').count

    expect(page).to have_content('All Flights')
    filter('flight', 'DOB')
    expect(page).to have_css('tbody tr', maximum: squadron_count)
  end

  def assert_filters_by_certification
    typeahead('Filter Certifications', 'Super Speed')
    expect(page).to have_css('tbody tr', maximum: @@all_airmen_count - 1)
  end

  def assert_filters_by_qualification
    typeahead('Filter Qualifications', 'QB')
    expect(page).to have_css('tbody tr', maximum: @@all_airmen_count - 1)
  end

  def assert_filters_by_last_name
    last_name = "Spaceman"
    fill_in('last-name', with: last_name)
    expect(page).to have_css('tbody tr', count: 1)

    last_name.split("").each do |i|
      page.find('input[name=last-name]').native.send_key(:backspace)
    end

    expect(page).to have_css('tbody tr', count: @@all_airmen_count)
  end

  def assert_shows_availability
    click_on_airman('Spaceman, Corey')
    page.within('.side-panel') do
      expect(page).to have_content('AVAILABILITY')
      expect(page).to have_content('Spaceman, Corey')
      @@expected_availability_days.each { |day_name| expect(page).to have_content(day_name) }
    end
    can_advance_to_next_week
  end

  def assert_shows_currency
    click_on_airman('Spaceman, Corey')
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
    click_on_airman('Keeter, Tracy')

    event = Event.new

    event.create
    expect(event).to exist

    event.update
    expect(event).to exist

    event.delete
    expect(event).not_to exist
  end

  def assert_create_event_validation
    click_on_airman('Keeter, Tracy')
    event = Event.new

    event.create_invalid
    expect(page.has_content?('This field is required.')).to be true
  end

  def assert_delete_create_update_qualification
    click_on_airman('Spaceman, Corey')

    skill = Skill.new

    if skill.qualification_exists?
      skill.delete_qualification
      expect(skill.qualification_exists?).to be false
    end

    skill.create_qualification
    expect(skill.qualification_exists?).to be true

    skill.update_qualification
    expect(skill.qualification_exists?).to be true
    expect(skill.qualification_correct_date?).to be true

    skill.delete_qualification
    expect(skill.qualification_exists?).to be false
  end

  def assert_delete_create_update_certification
    click_on_airman('Spaceman, Corey')

    skill = Skill.new

    if skill.certification_exists?
      skill.delete_certification
      expect(skill.certification_exists?).to be false
    end
    skill.create_certification
    expect(skill.certification_exists?).to be true

    skill.update_certification
    expect(skill.certification_exists?).to be true
    expect(skill.certification_correct_date?).to be true

    skill.delete_certification
    expect(skill.certification_exists?).to be false
  end

  def assert_create_skill_validation
    click_on_airman('Keeter, Tracy')
    skill = Skill.new

    skill.create_invalid
    expect(page.has_content?('This field is required.')).to be true
  end

  def assert_create_and_view_crew
    click_on_airman('Spaceman, Corey')
    msn_assignment = MsnAssignment.new
    msn_assignment.create

    click_on_airman('Keeter, Tracy')
    msn_assignment = MsnAssignment.new
    msn_assignment.create

    crew_page = CrewPage.new(msn_assignment.msn_title)
    crew_page.assert_has_assigned_airmen('Spaceman, Corey', 'Keeter, Tracy')

    crew_page.fill_in_position_and_make_critical
    crew_page.add_new_crew_member
  end

  private

  def click_on_airman(name)
    page.within 'table > tbody' do
      expect(page).to have_selector('tr', count: 39)
    end
    page.find(:xpath, "//*[text()='#{name}']").click
    page.within '.side-panel' do
      expect(page).to have_content name
    end
  end

  def filter(item, value)
    page.find("##{item}-filter").find(:option, text: value).select_option
  end

  def typeahead(item, value)
    page.within('table') do
      fill_in(item, with: value)
      click_link(value)
    end
  end

  def can_advance_to_next_week
    page.within('.side-panel') do
      find('button.next-week').click
      expect(page).to have_content(get_start_of_next_week.strftime('%d %^b'))
    end
  end

  def get_start_of_next_week
    now = Date.today
    (now - now.wday) + 7
  end

  def get_start_of_last_week
    now = Date.today
    (now - now.wday) - 7
  end

  def click(element)
    script = <<-JS
      arguments[0].click();
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end
end

